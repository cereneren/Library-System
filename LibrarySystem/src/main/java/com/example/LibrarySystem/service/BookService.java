
package com.example.LibrarySystem.service;

import com.example.LibrarySystem.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BookService {
    Book addBook(Book book);
    List<Book> getAllBooks();
    Book getBookById(long id);
    Book updateBook(Book book, long id);
    void deleteBook(long id);
    List<Book> searchByTitleOrAuthor(String title, String author);
    List<String> getAllTitles();
    void setCover(Long id, MultipartFile file) throws IOException;
}

