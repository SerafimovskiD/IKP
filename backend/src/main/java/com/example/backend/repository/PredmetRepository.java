package com.example.backend.repository;

import com.example.backend.model.Predmet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PredmetRepository extends JpaRepository<Predmet, Long> {
    @Query("SELECT COALESCE(MAX(p.redenBroj),0) FROM Predmet p WHERE p.godina = :godina")
    Integer findMaxRedenBroj(@Param("godina")Integer godina);
}
