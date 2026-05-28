package com.example.LibrarySystem.service;

import com.example.LibrarySystem.dto.ReviewRequest;
import com.example.LibrarySystem.dto.ReviewResponse;
import com.example.LibrarySystem.model.Book;
import com.example.LibrarySystem.model.Member;
import com.example.LibrarySystem.model.Review;
import com.example.LibrarySystem.repository.BookRepository;
import com.example.LibrarySystem.repository.ReviewRepository;
import com.example.LibrarySystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            BookRepository bookRepository,
            UserRepository userRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public ReviewResponse addReview(ReviewRequest request) {
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5.");
        }

        if (reviewRepository.existsByBookIdAndMemberId(request.getBookId(), request.getMemberId())) {
            throw new RuntimeException("This member already reviewed this book.");
        }

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found."));

        Member member = userRepository.findByIdAndType(request.getMemberId(), Member.class)
                .orElseThrow(() -> new RuntimeException("Member not found."));

        Review review = new Review();
        review.setBook(book);
        review.setMember(member);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);

        return mapToResponse(savedReview);
    }

    public List<ReviewResponse> getReviewsByBook(Long bookId) {
        return reviewRepository.findByBookId(bookId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReviewResponse> getReviewsByMember(Long memberId) {
        return reviewRepository.findByMemberId(memberId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Double getAverageRating(Long bookId) {
        Double average = reviewRepository.findAverageRatingByBookId(bookId);
        return average == null ? 0.0 : average;
    }

    private ReviewResponse mapToResponse(Review review) {
        String memberName = review.getMember().getFullName();

        if (memberName == null || memberName.isBlank()) {
            memberName = review.getMember().getEmail();
        }

        return new ReviewResponse(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getBook().getId(),
                review.getMember().getId(),
                memberName,
                review.getCreatedAt()
        );
    }
}