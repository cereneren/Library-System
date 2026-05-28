package com.example.LibrarySystem.service;

import com.example.LibrarySystem.model.Book;
import com.example.LibrarySystem.model.Review;
import com.example.LibrarySystem.repository.BookRepository;
import com.example.LibrarySystem.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;

    public RecommendationService(BookRepository bookRepository, ReviewRepository reviewRepository) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<Book> getRecommendations(Long memberId) {
        List<Review> memberReviews = reviewRepository.findByMemberId(memberId);
        List<Book> allBooks = bookRepository.findAll();

        Set<Long> alreadyReviewedBookIds = memberReviews.stream()
                .map(review -> review.getBook().getId())
                .collect(Collectors.toSet());

        if (memberReviews.isEmpty()) {
            return getGeneralRecommendations(allBooks, alreadyReviewedBookIds);
        }

        List<Review> likedReviews = memberReviews.stream()
                .filter(review -> review.getRating() >= 4)
                .toList();

        if (likedReviews.isEmpty()) {
            return getGeneralRecommendations(allBooks, alreadyReviewedBookIds);
        }

        Map<Book, Integer> scoredBooks = new HashMap<>();

        for (Book candidateBook : allBooks) {
            if (alreadyReviewedBookIds.contains(candidateBook.getId())) {
                continue;
            }

            int score = calculateScore(candidateBook, likedReviews);

            if (score > 0) {
                scoredBooks.put(candidateBook, score);
            }
        }

        List<Book> recommendations = scoredBooks.entrySet()
                .stream()
                .sorted(Map.Entry.<Book, Integer>comparingByValue().reversed())
                .limit(5)
                .map(Map.Entry::getKey)
                .toList();

        if (recommendations.isEmpty()) {
            return getGeneralRecommendations(allBooks, alreadyReviewedBookIds);
        }

        return recommendations;
    }

    private int calculateScore(Book candidateBook, List<Review> likedReviews) {
        int score = 0;

        for (Review likedReview : likedReviews) {
            Book likedBook = likedReview.getBook();

            if (sameText(candidateBook.getAuthor(), likedBook.getAuthor())) {
                score += 5;
            }

            score += commonWordScore(candidateBook.getTitle(), likedBook.getTitle(), 3);
            score += commonWordScore(candidateBook.getSummary(), likedBook.getSummary(), 2);
        }

        Double averageRating = reviewRepository.findAverageRatingByBookId(candidateBook.getId());

        if (averageRating != null) {
            if (averageRating >= 4.5) {
                score += 3;
            } else if (averageRating >= 4.0) {
                score += 2;
            } else if (averageRating >= 3.5) {
                score += 1;
            }
        }

        return score;
    }

    private int commonWordScore(String text1, String text2, int pointsPerMatch) {
        Set<String> words1 = tokenize(text1);
        Set<String> words2 = tokenize(text2);

        if (words1.isEmpty() || words2.isEmpty()) {
            return 0;
        }

        words1.retainAll(words2);

        return words1.size() * pointsPerMatch;
    }

    private Set<String> tokenize(String text) {
        if (text == null || text.isBlank()) {
            return new HashSet<>();
        }

        Set<String> stopWords = Set.of(
                "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with",
                "is", "are", "was", "were", "this", "that", "by", "from"
        );

        return Arrays.stream(text.toLowerCase().split("\\W+"))
                .filter(word -> word.length() > 2)
                .filter(word -> !stopWords.contains(word))
                .collect(Collectors.toSet());
    }

    private boolean sameText(String text1, String text2) {
        if (text1 == null || text2 == null) {
            return false;
        }

        return text1.trim().equalsIgnoreCase(text2.trim());
    }

    private List<Book> getGeneralRecommendations(List<Book> allBooks, Set<Long> alreadyReviewedBookIds) {
        return allBooks.stream()
                .filter(book -> !alreadyReviewedBookIds.contains(book.getId()))
                .sorted(Comparator.comparing(Book::getId).reversed())
                .limit(5)
                .toList();
    }
}