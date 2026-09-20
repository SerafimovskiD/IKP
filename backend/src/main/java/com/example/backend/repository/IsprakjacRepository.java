package com.example.backend.repository;

import java.util.UUID;

import com.example.backend.model.Isprakjac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IsprakjacRepository extends JpaRepository<Isprakjac, UUID> {
    @Query("SELECT i FROM Isprakjac i LEFT JOIN FETCH i.organizaciskaEdinica")
    List<Isprakjac> findAllWithOrgEdinica();
}
