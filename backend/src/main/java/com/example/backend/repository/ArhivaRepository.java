package com.example.backend.repository;

import com.example.backend.model.Arhiva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArhivaRepository extends JpaRepository<Arhiva,Long> {

}
