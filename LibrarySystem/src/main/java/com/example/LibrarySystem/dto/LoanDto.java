package com.example.LibrarySystem.dto;

import java.time.LocalDate;

public record LoanDto(
        Long   id,
        String bookTitle,
        LocalDate loanDate,
        LocalDate dueDate,
        LocalDate returnDate
) {}
