package com.example.LibrarySystem.dto;

public record RegisterDto(
        String fullName,
        String email,
        String password
) { }