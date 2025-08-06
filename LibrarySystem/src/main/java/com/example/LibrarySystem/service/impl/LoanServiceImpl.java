package com.example.LibrarySystem.service.impl;

import com.example.LibrarySystem.model.Book;
import com.example.LibrarySystem.model.Loan;
import com.example.LibrarySystem.model.User;
import com.example.LibrarySystem.repository.BookRepository;
import com.example.LibrarySystem.repository.LoanRepository;
import com.example.LibrarySystem.repository.UserRepository;
import com.example.LibrarySystem.service.LoanService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {
    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Loan createLoan(Long bookId, Long memberId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found"));
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));

        // Additional business logic (check if book is available)
        if (!book.isAvailable()) {
            throw new IllegalStateException("Book is not available for loan");
        }

        Loan loan = new Loan(book, member);
        book.addLoan(loan);
        return loanRepository.save(loan);
    }


    @Transactional
    public List<Loan> getLoansByMemberId(Long memberId) {
        if (!userRepository.existsById(memberId)) {
            throw new EntityNotFoundException("Member not found with id: " + memberId);
        }
        return loanRepository.findLoansByMemberIdWithBooks(memberId);
    }

    @Transactional
    public void returnLoan(Long loanId) {
        // Find the active loan (not yet returned)
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new EntityNotFoundException("Loan not found"));

        if (loan.getReturnDate() != null) {
            throw new IllegalStateException("This book was already returned");
        }

        // Update loan
        loan.setReturnDate(LocalDate.now());

        // Update book availability
        Book book = loan.getBook();
        book.setAvailable(true);

        // Save changes
        loanRepository.save(loan);
        bookRepository.save(book);
    }

    @Override
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }
}