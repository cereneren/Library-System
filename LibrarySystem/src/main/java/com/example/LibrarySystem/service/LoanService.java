package com.example.LibrarySystem.service;

import com.example.LibrarySystem.model.Loan;
import com.example.LibrarySystem.model.Member;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface LoanService {
    Loan createLoan(Long bookId, Long memberId, Long numberOfDays);
    List<Loan> getLoansByMemberId(Long memberId);
    List<Loan> getLoansByBookId(Long bookId);
    Optional<Loan> getActiveLoanForBook(Long bookId);
    void returnLoan(Long loanId);
    List<Loan> getAllLoans();
}
