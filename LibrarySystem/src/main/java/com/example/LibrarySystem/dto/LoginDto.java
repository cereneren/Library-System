package com.example.LibrarySystem.dto;


public record LoginDto(
        String email,
        String password
) {
    public String getEmail() {
        return this.email;
    }
    public String getPassword() {
        return this.password;
    }

}
