package com.example.backend.dto;

import com.example.backend.model.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public record PredmetListResponse(
        Long id,
        String brAkt,
        Integer redenBroj,
        Integer podBroj,
        Integer godina,
        LocalDate datumZaveduvanje,
        TipPosta tipPosta,
        Prioritet prioritet,
        String sodrzina,
        Boolean realizirano,
        StatusPredmet statusPredmet,
        TipDelovnik tipDelovnik,
        String isprakjacNaziv,
        String brAktNivni,
        List<String> odgovornoLiceNaziv,
        List<String> vidPredmetNaziv,
        List<String> arhivaNaziv,
        String zabeleska,
        Long isprakjacId,
        List<Long> odgovornoLiceId,
        List<Long> vidPredmetId,
        List<Long> arhivaId,
        Boolean isActive,
        String isprakjacIme,
        String promenilKorisnik,
        String brAktArhivski,
        LocalDate datumIsprakjanje

) {
    public static PredmetListResponse from(Predmet p) {
        List<String> vidPredmet = p.getTipDelovnik() == TipDelovnik.Dobiena
                ? p.getVidPredmetDobiena().stream()
                .map(VidPredmetDobiena::getNaziv)
                .collect(Collectors.toList())
                : p.getVidPredmetIspratena().stream()
                .map(VidPredmetIspratena::getNaziv)
                .collect(Collectors.toList());
        String promenil = p.getPromenil().getIme() +" "+ p.getPromenil().getPrezime();
        return new PredmetListResponse(
                p.getId(),
                p.getBrAkt(),
                p.getRedenBroj(),
                p.getPodBroj(),
                p.getGodina(),
                p.getDatumZaveduvanje(),
                p.getTipPosta(),
                p.getPrioritet(),
                p.getSodrzina(),
                p.getRealizirano(),
                p.getStatusPredmet(),
                p.getTipDelovnik(),
                p.getIsprakjac() != null ? p.getIsprakjac().getNaziv() : null,
                p.getBrAktNivni(),
                p.getOdgovornoLice() != null
                        ? p.getOdgovornoLice().stream()
                        .map(u -> u.getIme() + " " + u.getPrezime())
                        .collect(Collectors.toList())
                        : new ArrayList<>(),

                vidPredmet,
                p.getArhiva().stream().map(Arhiva::getNaziv).collect(Collectors.toList()),
                p.getZabeleska(),
                p.getIsprakjac() != null ? p.getIsprakjac().getId() : null,
                p.getOdgovornoLice() != null
                        ? p.getOdgovornoLice().stream()
                        .map(UserTable::getId)
                        .collect(Collectors.toList())
                        : new ArrayList<>(),
                p.getTipDelovnik() == TipDelovnik.Dobiena
                        ? p.getVidPredmetDobiena().stream()
                        .map(VidPredmetDobiena::getId)
                        .collect(Collectors.toList())
                        : p.getVidPredmetIspratena().stream()
                        .map(VidPredmetIspratena::getId)
                        .collect(Collectors.toList()),
                p.getArhiva().stream().map(Arhiva::getId).collect(Collectors.toList()),
                p.isActive(),
                p.getIsprakjacIme(),
                promenil,
                p.getBrAktArhivski(),
                p.getDatumIsprakjanje()
        );

    }
}
