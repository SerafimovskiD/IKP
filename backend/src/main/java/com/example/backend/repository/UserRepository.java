package com.example.backend.repository;

import java.util.UUID;

import com.example.backend.model.UserTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserTable, UUID> {
    Optional<UserTable> findByEmail(String email);

    @Query("SELECT u FROM UserTable u LEFT JOIN FETCH u.organizaciskaEdinica")
    List<UserTable> findAllWithOrgEdinica();

    // Корисници од конкретна орг. единица - за да секоја единица си гледа само
    // свои "Одговорно лице" / "Доделено на".
    @Query("SELECT u FROM UserTable u LEFT JOIN FETCH u.organizaciskaEdinica " +
            "WHERE u.organizaciskaEdinica.id = :orgId")
    List<UserTable> findAllByOrgEdinicaId(@Param("orgId") UUID orgId);
}