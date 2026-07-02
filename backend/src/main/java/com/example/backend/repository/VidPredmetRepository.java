package com.example.backend.repository;

import com.example.backend.model.VidPredmet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VidPredmetRepository extends JpaRepository<VidPredmet, Long> {
}
