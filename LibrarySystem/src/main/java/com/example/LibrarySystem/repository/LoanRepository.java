package com.example.LibrarySystem.repository;

import com.example.LibrarySystem.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    @Query("SELECT l FROM Loan l JOIN FETCH l.book WHERE l.member.id = :memberId")
    List<Loan> findLoansByMemberIdWithBooks(@Param("memberId") Long memberId);

    @Query("SELECT l FROM Loan l JOIN FETCH l.member WHERE l.book.id = :bookId")
    List<Loan> findLoansByBookIdWithMembers(@Param("bookId") Long bookId);

    @Modifying
    @Query("UPDATE Loan l SET l.returnDate = :returnDate WHERE l.id = :loanId AND l.returnDate IS NULL")
    int markAsReturned(@Param("loanId") Long loanId, @Param("returnDate") LocalDate returnDate);

    Optional<Loan> findFirstByBook_IdAndReturnDateIsNullOrderByDueDateAsc(Long bookId);

    int countActiveByBookId(long id);
}
