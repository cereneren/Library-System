package com.example.LibrarySystem.dto;

import java.time.LocalDateTime;

public class ReviewResponse {

    private Long id;
    private int rating;
    private String comment;
    private Long bookId;
    private Long memberId;
    private String memberName;
    private LocalDateTime createdAt;

    public ReviewResponse(Long id, int rating, String comment, Long bookId, Long memberId, String memberName, LocalDateTime createdAt) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.bookId = bookId;
        this.memberId = memberId;
        this.memberName = memberName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public Long getBookId() {
        return bookId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}