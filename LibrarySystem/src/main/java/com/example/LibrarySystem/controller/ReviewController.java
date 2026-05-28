package com.example.LibrarySystem.controller;

import com.example.LibrarySystem.dto.ReviewRequest;
import com.example.LibrarySystem.dto.ReviewResponse;
import com.example.LibrarySystem.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ReviewResponse addReview(@RequestBody ReviewRequest request) {
        return reviewService.addReview(request);
    }

    @GetMapping("/book/{bookId}")
    public List<ReviewResponse> getReviewsByBook(@PathVariable Long bookId) {
        return reviewService.getReviewsByBook(bookId);
    }

    @GetMapping("/member/{memberId}")
    public List<ReviewResponse> getReviewsByMember(@PathVariable Long memberId) {
        return reviewService.getReviewsByMember(memberId);
    }

    @GetMapping("/book/{bookId}/average")
    public Double getAverageRating(@PathVariable Long bookId) {
        return reviewService.getAverageRating(bookId);
    }
}