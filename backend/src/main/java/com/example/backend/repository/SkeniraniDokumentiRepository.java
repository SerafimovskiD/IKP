package com.example.backend.repository;

import java.util.UUID;

import com.example.backend.model.SkeniraniDokumenti;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface SkeniraniDokumentiRepository extends JpaRepository<SkeniraniDokumenti, UUID> {

    List<SkeniraniDokumenti> findAllByPredmetId(UUID predmetId);
}