package com.example.LibrarySystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter @Setter
@DiscriminatorValue("MEMBER")
public class Member extends User {

    public Member(String name, String email, String password) {
        super(name, email, password);
    }
    public Member() {
        super();
    }
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Loan> loans = new ArrayList<>();

    public void borrow(Book book) {
        Loan loan = new Loan(book, this);
        addLoan(loan);
        book.addLoan(loan);
    }

    public void returnBook(Loan loan) {
        loan.markReturned();
        loans.remove(loan);
    }

    public void addLoan(Loan loan) {
        loans.add(loan);
        loan.setMember(this);
    }
}