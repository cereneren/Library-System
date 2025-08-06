package com.example.LibrarySystem.repository;

import com.example.LibrarySystem.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByTitleOrAuthor(String title, String author);

    @Query("SELECT b.title FROM Book b")
    List<String> findAllTitles();
}
