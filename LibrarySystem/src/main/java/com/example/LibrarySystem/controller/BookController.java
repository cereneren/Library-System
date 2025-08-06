package com.example.LibrarySystem.controller;

import com.example.LibrarySystem.model.Book;
import com.example.LibrarySystem.service.BookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    public BookController(BookService bookService) {
        this.bookService = bookService;
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
    public ResponseEntity<String> deleteBook(@PathVariable("id") long id) {
        bookService.deleteBook(id);
        return new ResponseEntity<String>("Book deleted succesfully.", HttpStatus.OK);
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

    /** upload a cover file into the BLOB column */
    @PostMapping(path = "/{id}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadCover(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        Book book = bookService.getBookById(id);
        book.setCoverImage(file.getBytes(), file.getContentType());
        bookService.addBook(book);
        return ResponseEntity.noContent().build();
    }

    /** stream the cover bytes out with correct MIME */
    @GetMapping(value = "/{id}/cover")
    public ResponseEntity<byte[]> getCover(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        byte[] data = book.getCoverImage();
        if (data == null || data.length == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No cover");
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(book.getCoverContentType()));
        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }
}
