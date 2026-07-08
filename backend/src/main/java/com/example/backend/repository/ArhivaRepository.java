package com.example.backend.repository;

import com.example.backend.model.Arhiva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArhivaRepository extends JpaRepository<Arhiva,Long> {
    @Query("SELECT a FROM Arhiva a LEFT JOIN FETCH a.organizaciskaedinica")
    List<Arhiva> findAllWithOrgEdinica();
}
