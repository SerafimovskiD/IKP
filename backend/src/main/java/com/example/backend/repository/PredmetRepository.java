package com.example.backend.repository;

import com.example.backend.model.Predmet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PredmetRepository extends JpaRepository<Predmet, Long>, JpaSpecificationExecutor<Predmet> {
    @Query("SELECT COALESCE(MAX(p.redenBroj),0) FROM Predmet p WHERE p.godina = :godina")
    Integer findMaxRedenBroj(@Param("godina")Integer godina);

    Optional<Predmet> findPredmetByRedenBrojAndGodinaAndPodBroj(Integer redenBroj, Integer godina,Integer podbroj);

    @Query("SELECT COALESCE(MAX(p.podBroj), 0) FROM Predmet p " +
            "WHERE p.redenBroj = :redenBroj AND p.godina = :godina")
    Integer findMaxPodBrojByRedenBrojAndGodina(
            @Param("redenBroj") Integer redenBroj,
            @Param("godina") Integer godina
    );

    @Override
    @EntityGraph(attributePaths = {"isprakjac",
            "isprakjac.organizaciskaEdinica"})
    Page<Predmet> findAll(Specification<Predmet> spec, Pageable pageable);
    @Modifying
    @Query("UPDATE Predmet p SET p.isActive = false " +
            "WHERE p.redenBroj = :redenBroj AND p.godina = :godina AND p.isActive = true")
    void deactivateByRedenBrojAndGodina(
            @Param("redenBroj") Integer redenBroj,
            @Param("godina") Integer godina
    );

    List<Predmet> findAllByRedenBrojAndGodina(Integer redenBroj,Integer godina);
}
