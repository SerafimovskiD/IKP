package com.example.backend.repository;

import com.example.backend.model.Isprakjac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IsprakjacRepository extends JpaRepository<Isprakjac, Long> {

}
