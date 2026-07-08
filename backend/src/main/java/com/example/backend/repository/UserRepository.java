package com.example.backend.repository;

import com.example.backend.model.UserTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserTable, Long> {
    Optional<UserTable> findByEmail(String email);

    @Query("SELECT u FROM UserTable u LEFT JOIN FETCH u.organizaciskaEdinica")
    List<UserTable> findAllWithOrgEdinica();
}