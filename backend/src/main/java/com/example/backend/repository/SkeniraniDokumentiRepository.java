package com.example.backend.repository;

import com.example.backend.model.SkeniraniDokumenti;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkeniraniDokumentiRepository extends JpaRepository<SkeniraniDokumenti, Long> {

}
