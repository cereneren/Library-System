package com.example.LibrarySystem.service;

import com.example.LibrarySystem.model.Loan;
import com.example.LibrarySystem.model.Member;

import java.util.List;
import java.util.Map;

public interface LoanService {
    /*
    Loan addLoan(Loan loan);

    Loan getLoanById(long id);
    List<Loan> getLoansByMember(Member member);
    Loan returnLoan(long id);
    boolean isOverdue(long id);
    void deleteLoan(long id);

     */
    Loan createLoan(Long bookId, Long memberId);
    List<Loan> getLoansByMemberId(Long memberId);
    void returnLoan(Long loanId);
    List<Loan> getAllLoans();
}
