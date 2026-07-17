package com.example.backend.repository.specification;
import jakarta.persistence.criteria.JoinType;

import com.example.backend.model.Predmet;
import org.springframework.data.jpa.domain.Specification;


public class PredmetSpecification {

    public static Specification<Predmet> hasGodina(Integer godina) {
        return (root,query,cb)->
                godina==null ? null :cb.equal(root.get("godina"),godina);
    }
    public static Specification<Predmet> hasRedenBroj(Integer redenBroj) {
        return (root, query, cb)->
                redenBroj==null ? null :cb.equal(root.get("redenBroj"),redenBroj);
    }
    public static Specification<Predmet> hasIsprakjac(Long isprakjacId) {
        return (root, query, cb)->
                isprakjacId==null ? null :cb.equal(root.get("isprakjac").get("id"),isprakjacId);
    }
    public static Specification<Predmet> hasOdgovornoLice(Long odgovornoLiceId) {
        return (root, query, cb)->{
            if(odgovornoLiceId==null) return null;
            query.distinct(true);
            return cb.equal(root.join("odgovornoLice").get("id"),odgovornoLiceId);
        };
    }
    public static Specification<Predmet> hasVidPredmetDobiena (Long vidPredmetDobienaId) {
        return (root, query, cb) -> {
            if(vidPredmetDobienaId==null) return null;
            query.distinct(true);
            return cb.equal(root.join("vidPredmetDobiena").get("id"),vidPredmetDobienaId);
        };
    }
    public static Specification<Predmet> hasVidPredmetIspratena(Long vidPredmetIspratenaId) {
        return (root, query, cb) -> {
            if (vidPredmetIspratenaId == null) return null;
            query.distinct(true);
            return cb.equal(root.join("vidPredmetIspratena").get("id"), vidPredmetIspratenaId);
        };
    }

    public static Specification<Predmet> isRealizirano(Boolean realizirano) {
        return (root, query, cb) ->
                realizirano == null ? null : cb.equal(root.get("realizirano"), realizirano);
    }

    public static Specification<Predmet> searchText(String search){
        return (root, query, cb) -> {
            if (search==null || search.isEmpty()) return null;
            query.distinct(true);
            String pattern = "%" +  search.toLowerCase() + "%";

            var isprakjac=root.join("isprakjac", JoinType.LEFT);
            var odgovornoLice=root.join("odgovornoLice", JoinType.LEFT);
            var vidDobiena=root.join("vidPredmetDobiena", JoinType.LEFT);
            var vidIspratena=root.join("vidPredmetIspratena", JoinType.LEFT);
            var arhiva=root.join("arhiva", JoinType.LEFT);

            return cb.or(
                    cb.like(cb.lower(root.get("brAkt")), pattern),
                    cb.like(cb.lower(root.get("brAktNivni")), pattern),
                    cb.like(cb.lower(root.get("tipPosta").as(String.class)), pattern),
                    cb.like(cb.lower(root.get("sodrzina")), pattern),
                    cb.like(cb.lower(root.get("zabeleska")), pattern),
                    cb.like(cb.lower(isprakjac.get("naziv")), pattern),
                    cb.like(cb.lower(odgovornoLice.get("ime")), pattern),
                    cb.like(cb.lower(odgovornoLice.get("prezime")), pattern),
                    cb.like(cb.lower(vidDobiena.get("naziv")), pattern),
                    cb.like(cb.lower(vidIspratena.get("naziv")), pattern),
                    cb.like(cb.lower(arhiva.get("naziv")), pattern)
            );

        };
    }
}
