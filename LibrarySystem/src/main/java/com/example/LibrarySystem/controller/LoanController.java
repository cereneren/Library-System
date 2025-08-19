package com.example.LibrarySystem.controller;

import com.example.LibrarySystem.dto.CreateLoanRequest;
import com.example.LibrarySystem.model.Book;
import com.example.LibrarySystem.model.Loan;
import com.example.LibrarySystem.service.LoanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
public class LoanController {
    private LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    // build create loan REST API
    @PostMapping
    public ResponseEntity<Loan> createLoan(@RequestBody CreateLoanRequest request) {
        Loan loan = loanService.createLoan(request.bookId(), request.memberId());
        return ResponseEntity.ok(loan);
    }

    @PostMapping("/{loanId}/return")
    public ResponseEntity<String> returnBook(@PathVariable Long loanId) {
        loanService.returnLoan(loanId);
        return ResponseEntity.ok("Book successfully returned");
    }

    // build get all loans REST API
    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    /*
    // build get loan by id REST API
    // http://localhost:8080/api/loan/1
    @GetMapping("/{id}")
    public ResponseEntity<Loan> getLoanById(@PathVariable("id") long id) {
        return new ResponseEntity<Loan>(loanService.getLoanById(id), HttpStatus.OK);
    }

    // build delete loan REST API
    // http://localhost:8080/api/loan/1
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLoan(@PathVariable("id") long id) {
        loanService.deleteLoan(id);
        return new ResponseEntity<String>("Loan deleted succesfully.", HttpStatus.OK);
    }
     */
}
