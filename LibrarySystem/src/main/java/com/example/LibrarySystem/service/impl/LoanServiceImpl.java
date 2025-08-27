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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {
    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Loan createLoan(Long bookId, Long memberId, Long numberOfDays) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found"));
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No copies available");
        }

        Loan loan = new Loan(book, member, numberOfDays);
        book.addLoan(loan);            // just links both sides
        book.updateCopiesDecrement();  // adjust stock; do NOT flip 'available' here

        loanRepository.save(loan);     // ← persist exactly once
        bookRepository.save(book);     // ← because counters changed

        return loan;
    }


    @Transactional
    public List<Loan> getLoansByMemberId(Long memberId) {
        if (!userRepository.existsById(memberId)) {
            throw new EntityNotFoundException("Member not found with id: " + memberId);
        }
        return loanRepository.findLoansByMemberIdWithBooks(memberId);
    }

    @Transactional
    public List<Loan> getLoansByBookId(Long bookId) {
        if (!bookRepository.existsById(bookId)) {
            throw new EntityNotFoundException("Book not found with id: " + bookId);
        }
        return loanRepository.findLoansByBookIdWithMembers(bookId);
    }

    public Optional<Loan> getActiveLoanForBook(Long bookId) {
        return loanRepository.findFirstByBook_IdAndReturnDateIsNullOrderByDueDateAsc(bookId);
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
        book.updateCopiesIncrement();

        // Save changes
        loanRepository.save(loan);
        bookRepository.save(book);
    }

    @Override
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }


}