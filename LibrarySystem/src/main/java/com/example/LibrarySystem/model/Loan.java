package com.example.LibrarySystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "loans")
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // which book is being loaned
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"loans"})
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    // which member borrowed it
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"loans"})
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    // when it was borrowed
    @Column(name = "loan_date", nullable = false)
    private LocalDate loanDate;

    // when it's due
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    // when it was actually returned (null if not yet)
    @Column(name = "return_date")
    private LocalDate returnDate;

    public Loan(Book book, User member, Long numberOfDays) {
        if (book == null || member == null) {
            throw new IllegalArgumentException("Book and member cannot be null");
        }
        this.book = book;
        this.member = member;
        this.loanDate = LocalDate.now();
        calculateDueDate(numberOfDays);
    }

    private void calculateDueDate(Long numberOfDays) {
        if(numberOfDays > 0) {
            this.dueDate = loanDate.plusDays(numberOfDays);
        }
        else{
            throw new IllegalArgumentException("Return date cannot be 0 or less.");
        }

    }
}
