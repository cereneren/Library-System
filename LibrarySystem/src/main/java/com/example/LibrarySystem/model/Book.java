package com.example.LibrarySystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "books")
@Getter @Setter
@SQLDelete(sql = "UPDATE books SET enabled = false WHERE id = ?")
@Where(clause = "enabled = true")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "author")
    private String author;


    @Column(name = "availability_status")
    private boolean available;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime dateCreated;

    @LastModifiedDate
    @Column(name = "updated_at")
    private java.time.LocalDateTime dateUpdated;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Lob
    @Column(name="cover_image", columnDefinition="LONGBLOB")
    private byte[] coverImage;

    private String coverContentType;

    @Column(name = "summary")
    private String summary;

    public void setCoverImage(byte[] coverImage, String contentType) {
        this.coverImage       = coverImage;
        this.coverContentType = contentType;
    }

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Loan> loans = new ArrayList<>();

    public Book() {
        this.available = true;
    }

    public Book(String title, String author, byte[] url, String summary) {
        this.title = title;
        this.author = author;
        this.available = true;
        this.coverImage = coverImage != null ? coverImage.clone() : null;
        this.summary = summary;
    }

    public void addLoan(Loan loan) {
        loans.add(loan);
        loan.setBook(this);
        this.available = false;
    }

    public void removeLoan(Loan loan) {
        loans.remove(loan);
        loan.setBook(null);
        this.available = true;
    }
}
