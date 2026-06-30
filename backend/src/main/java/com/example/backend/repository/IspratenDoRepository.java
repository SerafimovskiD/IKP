package com.example.backend.repository;

import com.example.backend.model.IspratenDo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IspratenDoRepository extends JpaRepository<IspratenDo, Long> {

}
