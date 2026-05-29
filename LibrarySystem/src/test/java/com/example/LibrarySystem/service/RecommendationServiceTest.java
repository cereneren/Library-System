package com.example.LibrarySystem.service;

import com.example.LibrarySystem.model.Book;
import com.example.LibrarySystem.model.Member;
import com.example.LibrarySystem.model.Review;
import com.example.LibrarySystem.repository.BookRepository;
import com.example.LibrarySystem.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private RecommendationService recommendationService;

    @Test
    void getRecommendations_shouldRecommendSimilarBooks_whenMemberHasLikedReviews() {
        Member member = createMember(1L, "Ozan Dokur");

        Book likedBook = createBook(
                10L,
                "Harry Potter and the Philosopher Stone",
                "J.K. Rowling",
                "A young wizard starts his magical journey."
        );

        Book similarBook = createBook(
                11L,
                "Harry Potter and the Chamber of Secrets",
                "J.K. Rowling",
                "A young wizard continues his magical adventure."
        );

        Book unrelatedBook = createBook(
                12L,
                "Clean Code",
                "Robert Martin",
                "A book about software engineering."
        );

        Review likedReview = createReview(member, likedBook, 5, "Excellent book.");

        when(reviewRepository.findByMemberId(1L)).thenReturn(List.of(likedReview));
        when(bookRepository.findAll()).thenReturn(List.of(likedBook, similarBook, unrelatedBook));
        when(reviewRepository.findAverageRatingByBookId(11L)).thenReturn(4.5);
        when(reviewRepository.findAverageRatingByBookId(12L)).thenReturn(3.0);

        List<Book> recommendations = recommendationService.getRecommendations(1L);

        assertFalse(recommendations.isEmpty());
        assertTrue(recommendations.contains(similarBook));
        assertFalse(recommendations.contains(likedBook));
    }

    @Test
    void getRecommendations_shouldNotRecommendAlreadyReviewedBooks() {
        Member member = createMember(1L, "Ozan Dokur");

        Book reviewedBook = createBook(
                10L,
                "Book Already Reviewed",
                "Author A",
                "Test summary"
        );

        Book otherBook = createBook(
                11L,
                "Another Book",
                "Author A",
                "Test summary"
        );

        Review review = createReview(member, reviewedBook, 5, "Already reviewed.");

        when(reviewRepository.findByMemberId(1L)).thenReturn(List.of(review));
        when(bookRepository.findAll()).thenReturn(List.of(reviewedBook, otherBook));
        when(reviewRepository.findAverageRatingByBookId(11L)).thenReturn(4.0);

        List<Book> recommendations = recommendationService.getRecommendations(1L);

        assertFalse(recommendations.contains(reviewedBook));
        assertTrue(recommendations.contains(otherBook));
    }

    @Test
    void getRecommendations_shouldReturnGeneralRecommendations_whenMemberHasNoReviews() {
        Book book1 = createBook(1L, "Book One", "Author One", "Summary one");
        Book book2 = createBook(2L, "Book Two", "Author Two", "Summary two");
        Book book3 = createBook(3L, "Book Three", "Author Three", "Summary three");

        when(reviewRepository.findByMemberId(99L)).thenReturn(List.of());
        when(bookRepository.findAll()).thenReturn(List.of(book1, book2, book3));

        List<Book> recommendations = recommendationService.getRecommendations(99L);

        assertEquals(3, recommendations.size());
        assertTrue(recommendations.contains(book1));
        assertTrue(recommendations.contains(book2));
        assertTrue(recommendations.contains(book3));
    }

    @Test
    void getRecommendations_shouldReturnGeneralRecommendations_whenMemberHasOnlyLowRatedReviews() {
        Member member = createMember(1L, "Ozan Dokur");

        Book lowRatedBook = createBook(10L, "Low Rated Book", "Author A", "Summary");
        Book candidateBook = createBook(11L, "Candidate Book", "Author B", "Summary");

        Review lowReview = createReview(member, lowRatedBook, 2, "Did not like it.");

        when(reviewRepository.findByMemberId(1L)).thenReturn(List.of(lowReview));
        when(bookRepository.findAll()).thenReturn(List.of(lowRatedBook, candidateBook));

        List<Book> recommendations = recommendationService.getRecommendations(1L);

        assertFalse(recommendations.contains(lowRatedBook));
        assertTrue(recommendations.contains(candidateBook));
    }

    private Book createBook(Long id, String title, String author, String summary) {
        Book book = new Book();
        book.setId(id);
        book.setTitle(title);
        book.setAuthor(author);
        book.setSummary(summary);
        book.setTotalCopies(1);
        book.setAvailableCopies(1);
        book.setAvailable(true);
        return book;
    }

    private Member createMember(Long id, String fullName) {
        Member member = new Member();
        member.setId(id);
        member.setFullName(fullName);
        member.setEmail(fullName.toLowerCase().replace(" ", ".") + "@test.com");
        return member;
    }

    private Review createReview(Member member, Book book, int rating, String comment) {
        Review review = new Review();
        review.setMember(member);
        review.setBook(book);
        review.setRating(rating);
        review.setComment(comment);
        return review;
    }
}