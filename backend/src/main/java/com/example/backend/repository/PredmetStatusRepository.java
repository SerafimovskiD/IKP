package com.example.backend.repository;

import com.example.backend.model.PredmetStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PredmetStatusRepository extends JpaRepository<PredmetStatusLog, Long> {

}
