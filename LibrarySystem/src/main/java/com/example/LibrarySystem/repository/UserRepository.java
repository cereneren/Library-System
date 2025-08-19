package com.example.LibrarySystem.repository;


import com.example.LibrarySystem.model.Member;
import com.example.LibrarySystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // Find all members (using discriminator value)
    @Query("SELECT m FROM Member m")
    List<Member> findAllMembers();

    // Find all users of specific type using JPQL TYPE operator
    @Query("SELECT m FROM Member m WHERE m.enabled = true")
    List<Member> findAllEnabledMembers();

    // Find spesific user by ID and type
    @Query("SELECT u FROM User u WHERE u.id = :id AND TYPE(u) = :type")
    <T extends User> Optional<T> findByIdAndType(@Param("id") Long id,
                                                 @Param("type") Class<T> type);
}
