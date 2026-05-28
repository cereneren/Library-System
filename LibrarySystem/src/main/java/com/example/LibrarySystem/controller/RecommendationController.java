package com.example.LibrarySystem.controller;

import com.example.LibrarySystem.model.Book;
import com.example.LibrarySystem.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/member/{memberId}")
    public List<Book> getRecommendations(@PathVariable Long memberId) {
        return recommendationService.getRecommendations(memberId);
    }
}