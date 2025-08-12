
package com.example.LibrarySystem.service.impl;

import com.example.LibrarySystem.exception.ResourceNotFoundException;
import com.example.LibrarySystem.model.Book;
import com.example.LibrarySystem.repository.BookRepository;
import com.example.LibrarySystem.service.BookService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class BookServiceImpl implements BookService {
    private BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        super();
        this.bookRepository = bookRepository;
    }

    @Override
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book getBookById(long id) {
        return bookRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book", "Id", id));
    }

    @Override
    public Book updateBook(Book book, long id) {
        Book existingBook = bookRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Book", "Id", id));

        existingBook.setTitle(book.getTitle());
        existingBook.setAuthor(book.getAuthor());
        existingBook.setSummary(book.getSummary());

        bookRepository.save(existingBook);
        return existingBook;
    }

    @Override
    public void deleteBook(long id) {
        bookRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Book", "Id", id));
        bookRepository.deleteById(id);
    }

    public List<Book> searchByTitleOrAuthor(String title, String author) {
        return bookRepository.findByTitleOrAuthor(title, author);
    }

    @Override
    public List<String> getAllTitles() {
        return bookRepository.findAllTitles();
    }

    @Transactional
    public void setCover(Long id, MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("Empty file");
        if (!file.getContentType().startsWith("image/"))
            throw new IllegalArgumentException("Only images allowed");

        // Optional: enforce size limit (e.g., 5 MB)
        long maxBytes = 5 * 1024 * 1024;
        if (file.getSize() > maxBytes) throw new IllegalArgumentException("File too large");

        Book b = bookRepository.findById(id).orElseThrow();
        b.setCover(file.getBytes());
        b.setCoverContentType(file.getContentType());
        b.setCoverFilename(file.getOriginalFilename());
        // repo.save(b); // not needed with managed entity inside @Transactional
    }

}


