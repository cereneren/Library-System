package com.example.LibrarySystem.dto;

import java.util.List;

public record MemberDto(
        Long          id,
        String        fullName,
        String        password,
        String        email,
        List<LoanDto> loans
) {}