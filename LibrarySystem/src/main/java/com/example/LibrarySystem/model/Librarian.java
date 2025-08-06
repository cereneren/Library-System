package com.example.LibrarySystem.model;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@DiscriminatorValue("LIBRARIAN")
public class Librarian extends User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    public Librarian() {
        super();          // calls User’s no-arg ctor
    }

    public Librarian(String name, String email, String password) {
        super(name, email,password);
    }
}