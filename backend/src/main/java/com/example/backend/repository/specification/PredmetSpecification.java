package com.example.backend.repository.specification;
import com.example.backend.model.StatusPredmet;
import com.example.backend.model.TipDelovnik;
import com.example.backend.model.TipPosta;
import jakarta.persistence.criteria.JoinType;

import com.example.backend.model.Predmet;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;


public class PredmetSpecification {

    public static Specification<Predmet> hasGodina(Integer godina) {
        return (root,query,cb)->
                godina==null ? null :cb.equal(root.get("godina"),godina);
    }

    // Секоја орг. единица си ги гледа само своите предмети (brAkt = code на единицата).
    // null = без филтер (за ADMIN, кој гледа сѐ).
    public static Specification<Predmet> hasBrAkt(String brAkt) {
        return (root, query, cb) ->
                brAkt == null ? null : cb.equal(root.get("brAkt"), brAkt);
    }
    public static Specification<Predmet> hasRedenBrojLike(String redenBroj) {
        return (root, query, cb) -> {
            if (redenBroj == null || redenBroj.isEmpty()) return null;
            return cb.like(cb.function("text",String.class, root.get("redenBroj")), redenBroj.toLowerCase() + "%");
        };
    }
    public static Specification<Predmet> hasIsprakjac(String isprakjacIme) {
        return (root, query, cb) -> {
            if (isprakjacIme == null || isprakjacIme.isEmpty()) return null;
            return cb.like(cb.lower(root.get("isprakjacIme")), "%" + isprakjacIme.toLowerCase() + "%");
        };
    }
    public static Specification<Predmet> hasOdgovornoLice(UUID odgovornoLiceId) {
        return (root, query, cb)->{
            if(odgovornoLiceId==null) return null;
            query.distinct(true);
            return cb.equal(root.join("odgovornoLice").get("id"),odgovornoLiceId);
        };
    }
    public static Specification<Predmet> hasVidPredmetDobiena (UUID vidPredmetDobienaId) {
        return (root, query, cb) -> {
            if(vidPredmetDobienaId==null) return null;
            query.distinct(true);
            return cb.equal(root.join("vidPredmetDobiena").get("id"),vidPredmetDobienaId);
        };
    }
    public static Specification<Predmet> hasArhiva (UUID arhivaId) {
        return (root, query, cb) -> {
            if(arhivaId==null) return null;
            query.distinct(true);
            return cb.equal(root.join("arhiva").get("id"),arhivaId);
        };
    }
    public static Specification<Predmet> hasVidPredmetIspratena(UUID vidPredmetIspratenaId) {
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
            var dodelenoNa=root.join("dodelenoNa", JoinType.LEFT);
            var promenil=root.join("promenil", JoinType.LEFT);
            var vidDobiena=root.join("vidPredmetDobiena", JoinType.LEFT);
            var vidIspratena=root.join("vidPredmetIspratena", JoinType.LEFT);
            var arhiva=root.join("arhiva", JoinType.LEFT);

            return cb.or(
//                    cb.like(cb.lower(root.get("brAkt")), pattern),
                    cb.like(cb.lower(root.get("brAktArhivski")), pattern),
                    cb.like(cb.lower(root.get("brAktNivni")), pattern),
                    cb.like(cb.function("to_char", String.class,
                            root.get("datumIsprakjanje"), cb.literal("YYYY-MM-DD")), pattern),
                    cb.like(cb.function("to_char", String.class,
                            root.get("datumZaveduvanje"), cb.literal("YYYY-MM-DD")), pattern),
                    cb.like(cb.function("text", String.class, root.get("redenBroj")), pattern),
                    cb.like(cb.lower(root.get("sodrzina")), pattern),
                    cb.like(cb.lower(root.get("zabeleska")), pattern),
//                    cb.like(cb.lower(root.get("tipPosta").as(String.class)), pattern),
                    cb.like(cb.lower(root.get("isprakjacIme")), pattern),
                    cb.like(cb.lower(odgovornoLice.get("ime")), pattern),
                    cb.like(cb.lower(odgovornoLice.get("prezime")), pattern),
                    cb.like(cb.lower(dodelenoNa.get("ime")), pattern),
                    cb.like(cb.lower(dodelenoNa.get("prezime")), pattern),
                    cb.like(cb.lower(promenil.get("ime")), pattern),
                    cb.like(cb.lower(promenil.get("prezime")), pattern),
                    cb.like(cb.lower(vidDobiena.get("naziv")), pattern),
                    cb.like(cb.lower(vidIspratena.get("naziv")), pattern),
                    cb.like(cb.lower(arhiva.get("naziv")), pattern)
                    );
        };
    }
    public static Specification<Predmet> hasTipDelovnik(TipDelovnik tipDelovnik) {
        return (root, query, cb) ->
                tipDelovnik == null ? null : cb.equal(root.get("tipDelovnik"), tipDelovnik);
    }

    public static Specification<Predmet> hasTipPosta(TipPosta tipPosta) {
        return (root, query, cb) ->
                tipPosta == null ? null : cb.equal(root.get("tipPosta"), tipPosta);
    }

    public static Specification<Predmet> hasStatusPredmet(StatusPredmet statusPredmet) {
        return (root, query, cb) ->
                statusPredmet == null ? null : cb.equal(root.get("statusPredmet"), statusPredmet);
    }

    public static Specification<Predmet> hasDatumZaveduvanjeLike(String datum) {
        return (root, query, cb) -> {
            if (datum == null || datum.isEmpty()) return null;
            return cb.like(
                    cb.function("to_char", String.class,
                            root.get("datumZaveduvanje"),
                            cb.literal("YYYY-MM-DD")),
                    "%" + datum + "%"
            );
        };
    }

    public static Specification<Predmet> hasBrAktNivniLike(String brAktNivni) {
        return (root, query, cb) -> {
            if (brAktNivni == null || brAktNivni.isEmpty()) return null;
            return cb.like(cb.lower(root.get("brAktNivni")), "%" + brAktNivni.toLowerCase() + "%");
        };
    }

    public static Specification<Predmet> hasSodrzina(String sodrzina) {
        return (root, query, cb) -> {
            if (sodrzina == null || sodrzina.isEmpty()) return null;
            return cb.like(cb.lower(root.get("sodrzina")), "%" + sodrzina.toLowerCase() + "%");
        };
    }

    public static Specification<Predmet> hasZabeleska(String zabeleska) {
        return (root, query, cb) -> {
            if (zabeleska == null || zabeleska.isEmpty()) return null;
            return cb.like(cb.lower(root.get("zabeleska")), "%" + zabeleska.toLowerCase() + "%");
        };
    }

    public static Specification<Predmet> hasDodelenoNa(UUID dodelenoNaId) {
        return (root, query, cb) -> {
            if (dodelenoNaId == null) return null;
            query.distinct(true);
            return cb.equal(root.join("dodelenoNa").get("id"), dodelenoNaId);
        };
    }

    public static Specification<Predmet> hasBrAktArhivskiLike(String brAktArhivski) {
        return (root, query, cb) -> {
            if (brAktArhivski == null || brAktArhivski.isEmpty()) return null;
            return cb.like(cb.lower(root.get("brAktArhivski")), "%" + brAktArhivski.toLowerCase() + "%");
        };
    }


    public static Specification<Predmet> hasPromenilKorisnikLike(String promenilKorisnik) {
        return (root, query, cb) -> {
            if (promenilKorisnik == null || promenilKorisnik.isEmpty()) return null;
            var promenil = root.join("promenil", JoinType.LEFT);
            String pattern = "%" + promenilKorisnik.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(promenil.get("ime")), pattern),
                    cb.like(cb.lower(promenil.get("prezime")), pattern)
            );
        };
    }
    public static Specification<Predmet> isActive() {
        return (root, query, cb) ->
                cb.equal(root.get("podBroj"), 1);
    }

}
