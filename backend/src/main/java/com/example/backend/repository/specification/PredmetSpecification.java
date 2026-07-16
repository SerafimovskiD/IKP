package com.example.backend.repository.specification;

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
}
