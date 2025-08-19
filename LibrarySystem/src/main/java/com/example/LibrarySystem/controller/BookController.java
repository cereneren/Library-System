package com.example.LibrarySystem.controller;

import com.example.LibrarySystem.dto.CoverUrlRequest;
import com.example.LibrarySystem.exception.ResourceNotFoundException;
import com.example.LibrarySystem.model.Book;
import com.example.LibrarySystem.model.Loan;
import com.example.LibrarySystem.repository.BookRepository;
import com.example.LibrarySystem.service.BookService;
import com.example.LibrarySystem.service.LoanService;
import org.apache.coyote.BadRequestException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private BookService bookService;
    private LoanService loanService;
    private BookRepository bookRepository;

    public BookController(BookService bookService, LoanService loanService, BookRepository bookRepository) {
        this.bookService = bookService;
        this.loanService = loanService;
        this.bookRepository = bookRepository;
    }

    // POST or PUT: upload image file
    @PutMapping(value = "/{id}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadCover(@PathVariable Long id,
                                         @RequestParam("file") MultipartFile file) throws IOException {
        bookService.setCover(id, file);
        return ResponseEntity.ok().body("Cover saved");
    }

    // build create member REST API
    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        return new ResponseEntity<Book>(bookService.addBook(book), HttpStatus.CREATED);
    }

    // build get book by id REST API
    // http://localhost:8080/api/books/1
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable("id") long bookId) {
        return new ResponseEntity<Book>(bookService.getBookById(bookId), HttpStatus.OK);
    }

    // build update book REST API
    // http://localhost:8080/api/books/1
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable("id") long bookId, @RequestBody Book book) {
        return new ResponseEntity<Book>(bookService.updateBook(book, bookId), HttpStatus.OK);
    }

    // build delete book REST API
    // http://localhost:8080/api/books/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") long id) {
        Book existing = bookService.getBookById(id);
        if (existing == null || !existing.isEnabled()) {
            throw new ResourceNotFoundException("Book", "id", id);
        }
        bookService.deleteBook(id); // implement as soft delete: enabled=false
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<Book> list(
            @RequestParam(defaultValue = "") String title,
            @RequestParam(defaultValue = "") String author
    ) {
        // if no title supplied, returns all books
        if (title.isBlank() && author.isBlank()) {
            return bookService.getAllBooks();
        }
        // otherwise, returns only matching titles
        return bookService.searchByTitleOrAuthor(title, author);
    }

    @GetMapping("/titles")
    public ResponseEntity<List<String>> getAllTitles() {
        return ResponseEntity.ok(bookService.getAllTitles());
    }

    @GetMapping(value = "/{id}/cover")
    public ResponseEntity<byte[]> getCover(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        byte[] data = book.getCover();
        if (data == null || data.length == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No cover");
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(book.getCoverContentType()));
        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }

    @PostMapping("/{id}/cover-from-url")
    public ResponseEntity<Void> uploadCoverFromUrl(@PathVariable Long id,
                                                   @RequestBody CoverUrlRequest req) throws BadRequestException {
        if (req == null || req.url() == null || req.url().isBlank()) {
            throw new BadRequestException("URL required");
        }
        try {
            var client = java.net.http.HttpClient.newHttpClient();
            var request = java.net.http.HttpRequest.newBuilder(java.net.URI.create(req.url())).GET().build();
            var response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() >= 400) throw new BadRequestException("Could not fetch image (HTTP " + response.statusCode() + ")");

            var contentType = response.headers().firstValue("content-type").orElse("application/octet-stream");
            if (!contentType.startsWith("image/")) throw new BadRequestException("URL does not point to an image");

            var bytes = response.body();
            if (bytes == null || bytes.length == 0) throw new BadRequestException("Empty image");
            if (bytes.length > 5_000_000) throw new BadRequestException("Image too large (max 5MB)");

            var book = bookService.getBookById(id);
            if (book == null || (book.isEnabled() == false)) {
                throw new ChangeSetPersister.NotFoundException();
            }

            book.setCoverImage(bytes, contentType);
            bookService.addBook(book); // or save/update
            return ResponseEntity.noContent().build();

        } catch (java.net.MalformedURLException e) {
            throw new BadRequestException("Invalid URL");
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            throw new BadRequestException("Fetch interrupted");
        } catch (IOException | ChangeSetPersister.NotFoundException ioe) {
            throw new BadRequestException("Failed to read image");
        }
    }

    @GetMapping("/{id}/loans")
    public ResponseEntity<List<Loan>> getBookLoans(@PathVariable("id") long bookId) {
        List<Loan> loans = loanService.getLoansByBookId(bookId);
        return ResponseEntity.ok(loans);
    }


    @GetMapping("/{id}/loan")
    public ResponseEntity<Loan> getActiveLoan(@PathVariable("id") Long bookId) {
        // 404 if the book doesn't exist
        if (!bookRepository.existsById(bookId)) {
            return ResponseEntity.notFound().build();
        }

        // 204 if no active loan, else 200 with the loan
        return loanService.getActiveLoanForBook(bookId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

}
