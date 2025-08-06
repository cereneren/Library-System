package com.example.LibrarySystem.dto;

import com.example.LibrarySystem.model.Role;

import java.util.List;

public record UserDto(
        Long          id,
        String        email,
        Role role,
        List<LoanDto> loans
) {}
