package com.example.backend.repository;

import java.util.UUID;

import com.example.backend.model.Predmet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface PredmetRepository extends JpaRepository<Predmet, UUID>, JpaSpecificationExecutor<Predmet> {
    // Нумерацијата на предметите е по орг. единица (brAkt) + година - две различни
    // орг. единици може да имаат ист redenBroj во иста година, па сите методи
    // клучирани на (redenBroj, godina) мора да носат и brAkt.
    @Query("SELECT COALESCE(MAX(p.redenBroj),0) FROM Predmet p WHERE p.brAkt = :brAkt AND p.godina = :godina")
    Integer findMaxRedenBrojByBrAktAndGodina(@Param("brAkt") String brAkt, @Param("godina") Integer godina);

    Optional<Predmet> findPredmetByBrAktAndRedenBrojAndGodinaAndPodBroj(String brAkt, Integer redenBroj, Integer godina, Integer podBroj);

    @Query("SELECT COALESCE(MAX(p.podBroj), 0) FROM Predmet p " +
            "WHERE p.brAkt = :brAkt AND p.redenBroj = :redenBroj AND p.godina = :godina")
    Integer findMaxPodBrojByBrAktAndRedenBrojAndGodina(
            @Param("brAkt") String brAkt,
            @Param("redenBroj") Integer redenBroj,
            @Param("godina") Integer godina
    );

    @Query("SELECT p.brAkt, p.redenBroj, p.godina, MAX(p.podBroj) FROM Predmet p " +
            "WHERE p.godina IN :godini GROUP BY p.brAkt, p.redenBroj, p.godina")
    List<Object[]> findMaxPodBrojGroupedByGodini(@Param("godini") Collection<Integer> godini);

    @Override
    @EntityGraph(attributePaths = {"isprakjac",
            "isprakjac.organizaciskaEdinica"})
    Page<Predmet> findAll(Specification<Predmet> spec, Pageable pageable);
    @Modifying
    @Query("UPDATE Predmet p SET p.isActive = false " +
            "WHERE p.brAkt = :brAkt AND p.redenBroj = :redenBroj AND p.godina = :godina AND p.isActive = true")
    void deactivateByBrAktAndRedenBrojAndGodina(
            @Param("brAkt") String brAkt,
            @Param("redenBroj") Integer redenBroj,
            @Param("godina") Integer godina
    );

    List<Predmet> findAllByBrAktAndRedenBrojAndGodina(String brAkt, Integer redenBroj, Integer godina);
}
