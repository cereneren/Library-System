package com.example.LibrarySystem.dto;

public record LoginDto(
        String email,
        String password
) {
    public String getEmail() {
        return this.email;
    }
}
