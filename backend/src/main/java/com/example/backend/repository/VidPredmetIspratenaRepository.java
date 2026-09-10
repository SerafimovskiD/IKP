package com.example.backend.repository;

import java.util.UUID;

import com.example.backend.model.VidPredmetIspratena;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VidPredmetIspratenaRepository extends JpaRepository<VidPredmetIspratena, UUID> {
}
