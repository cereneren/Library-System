package com.example.LibrarySystem.repository;

import com.example.LibrarySystem.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByBookId(Long bookId);

    List<Review> findByMemberId(Long memberId);

    boolean existsByBookIdAndMemberId(Long bookId, Long memberId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.book.id = :bookId")
    Double findAverageRatingByBookId(Long bookId);
}