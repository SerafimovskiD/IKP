package com.example.backend.repository;

import com.example.backend.model.OrganizaciskaEdinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface orgEdinicaRepository extends JpaRepository<OrganizaciskaEdinica, Long> {

}
