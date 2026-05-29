package com.example.LibrarySystem.service;

import com.example.LibrarySystem.dto.ReviewRequest;
import com.example.LibrarySystem.dto.ReviewResponse;
import com.example.LibrarySystem.model.Book;
import com.example.LibrarySystem.model.Member;
import com.example.LibrarySystem.model.Review;
import com.example.LibrarySystem.repository.BookRepository;
import com.example.LibrarySystem.repository.ReviewRepository;
import com.example.LibrarySystem.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReviewService reviewService;

    @Test
    void addReview_shouldSaveReview_whenRequestIsValid() {
        ReviewRequest request = new ReviewRequest();
        request.setBookId(1L);
        request.setMemberId(2L);
        request.setRating(5);
        request.setComment("Great book.");

        Book book = new Book();
        book.setId(1L);
        book.setTitle("Test Book");
        book.setAuthor("Test Author");

        Member member = new Member();
        member.setId(2L);
        member.setFullName("Ozan Dokur");
        member.setEmail("ozan@test.com");

        Review savedReview = new Review();
        savedReview.setBook(book);
        savedReview.setMember(member);
        savedReview.setRating(5);
        savedReview.setComment("Great book.");

        when(reviewRepository.existsByBookIdAndMemberId(1L, 2L)).thenReturn(false);
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(userRepository.findByIdAndType(2L, Member.class)).thenReturn(Optional.of(member));
        when(reviewRepository.save(any(Review.class))).thenReturn(savedReview);

        ReviewResponse response = reviewService.addReview(request);

        assertNotNull(response);
        assertEquals(5, response.getRating());
        assertEquals("Great book.", response.getComment());
        assertEquals(1L, response.getBookId());
        assertEquals(2L, response.getMemberId());
        assertEquals("Ozan Dokur", response.getMemberName());

        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void addReview_shouldThrowException_whenRatingIsLessThanOne() {
        ReviewRequest request = new ReviewRequest();
        request.setBookId(1L);
        request.setMemberId(2L);
        request.setRating(0);
        request.setComment("Invalid rating.");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            reviewService.addReview(request);
        });

        assertEquals("Rating must be between 1 and 5.", exception.getMessage());
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void addReview_shouldThrowException_whenRatingIsGreaterThanFive() {
        ReviewRequest request = new ReviewRequest();
        request.setBookId(1L);
        request.setMemberId(2L);
        request.setRating(6);
        request.setComment("Invalid rating.");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            reviewService.addReview(request);
        });

        assertEquals("Rating must be between 1 and 5.", exception.getMessage());
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void addReview_shouldThrowException_whenMemberAlreadyReviewedBook() {
        ReviewRequest request = new ReviewRequest();
        request.setBookId(1L);
        request.setMemberId(2L);
        request.setRating(4);
        request.setComment("Duplicate review.");

        when(reviewRepository.existsByBookIdAndMemberId(1L, 2L)).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            reviewService.addReview(request);
        });

        assertEquals("This member already reviewed this book.", exception.getMessage());
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void addReview_shouldThrowException_whenBookDoesNotExist() {
        ReviewRequest request = new ReviewRequest();
        request.setBookId(1L);
        request.setMemberId(2L);
        request.setRating(4);
        request.setComment("Book not found test.");

        when(reviewRepository.existsByBookIdAndMemberId(1L, 2L)).thenReturn(false);
        when(bookRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            reviewService.addReview(request);
        });

        assertEquals("Book not found.", exception.getMessage());
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void getAverageRating_shouldReturnZero_whenBookHasNoReviews() {
        when(reviewRepository.findAverageRatingByBookId(1L)).thenReturn(null);

        Double average = reviewService.getAverageRating(1L);

        assertEquals(0.0, average);
    }

    @Test
    void getReviewsByBook_shouldReturnReviewResponses() {
        Book book = new Book();
        book.setId(1L);
        book.setTitle("Test Book");

        Member member = new Member();
        member.setId(2L);
        member.setFullName("Ceren Eren");
        member.setEmail("ceren@test.com");

        Review review = new Review();
        review.setBook(book);
        review.setMember(member);
        review.setRating(5);
        review.setComment("Nice book.");

        when(reviewRepository.findByBookId(1L)).thenReturn(List.of(review));

        List<ReviewResponse> reviews = reviewService.getReviewsByBook(1L);

        assertEquals(1, reviews.size());
        assertEquals(5, reviews.get(0).getRating());
        assertEquals("Nice book.", reviews.get(0).getComment());
        assertEquals("Ceren Eren", reviews.get(0).getMemberName());
    }
}