package com.example.backend.dto;

import java.util.UUID;

import com.example.backend.model.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@JsonPropertyOrder({
        "id", "brAkt", "redenBroj", "podBroj", "godina",
        "datumZaveduvanje", "tipPosta", "prioritet",
        "isprakjacId", "isprakjacNaziv", "brAktNivni",
        "datumIsprakjanje", "brAktArhivski", "vidPredmetId",
        "sodrzina", "odgovornoLiceId", "informativnaPosta",
        "realizirano", "arhivaId", "zabeleska",
        "statusPredmet", "tipDelovnik","isActive"
})
public class PostaResponse {
    private UUID id;

    private String brAkt;
    private Integer redenBroj;
    private Integer podBroj;
    private Integer godina;
    private LocalDate datumZaveduvanje;

    private TipPosta tipPosta;
    private Prioritet prioritet;

    private UUID isprakjacId;

    private String brAktNivni;
    private LocalDate datumIsprakjanje;
    private String brAktArhivski;

    //Naum
    private List<UUID> vidPredmetDobienaId;
    private List<UUID> vidPredmetIspratenaId;
    //    private UUID vidPredmetId;
    //Mislam nema potreba da ima i naziv poso ke go dobivame preku ID <-Naum
//    private String vidPredmetNaziv;

    private String sodrzina;

    private List<UUID> odgovornoLiceId;
    private List<UUID> dodelenoNaId;
    //Naum
//    private UUID odgovornoLiceId;
    //Isto ko gore <-Naum
//    private String odgovornoLiceIme;
//    private String odgovornoLicePrezime;
//    private String odgovornoLiceEmail;

    private Boolean informativnaPosta;
    private Boolean realizirano;

    private List<UUID> arhivaId;
    //Naum
//    private UUID arhivaId;
    //isto ko gore <Naum
//    private String arhivaNaziv;

    private String zabeleska;

    private StatusPredmet statusPredmet;
    private TipDelovnik tipDelovnik;

    private TipOdgovor tipOdgovor;
    private Boolean isActive;
    private String isprakjacIme;
    private String promenilKorisnik;

    public static PostaResponse from(Predmet predmet) {
        String promenil = predmet.getPromenil().getIme() +" "+ predmet.getPromenil().getPrezime();

        PostaResponse dto = new PostaResponse();

        dto.setId(predmet.getId());
        dto.setBrAkt(predmet.getBrAkt());
        dto.setRedenBroj(predmet.getRedenBroj());
        dto.setPodBroj(predmet.getPodBroj());
        dto.setGodina(predmet.getGodina());
        dto.setDatumZaveduvanje(predmet.getDatumZaveduvanje());
        dto.setTipPosta(predmet.getTipPosta());
        dto.setPrioritet(predmet.getPrioritet());
        dto.setIsprakjacId(predmet.getIsprakjac().getId());
        dto.setBrAktNivni(predmet.getBrAktNivni());
        dto.setDatumIsprakjanje(predmet.getDatumIsprakjanje());
        dto.setBrAktArhivski(predmet.getBrAktArhivski());
        dto.setVidPredmetDobienaId(
                predmet.getVidPredmetDobiena() != null
                        ? predmet.getVidPredmetDobiena().stream()
                        .map(VidPredmetDobiena::getId)
                        .collect(Collectors.toList())
                        : new ArrayList<>()
        );

        dto.setVidPredmetIspratenaId(
                predmet.getVidPredmetIspratena() != null
                        ? predmet.getVidPredmetIspratena().stream()
                        .map(VidPredmetIspratena::getId)
                        .collect(Collectors.toList())
                        : new ArrayList<>()
        );
        dto.setSodrzina(predmet.getSodrzina());
        dto.setOdgovornoLiceId(predmet.getOdgovornoLice().stream().map(UserTable::getId).toList());
        dto.setDodelenoNaId(predmet.getDodelenoNa().stream().map(UserTable::getId).toList());
        dto.setInformativnaPosta(predmet.getInformativnaPosta());
        dto.setRealizirano(predmet.getRealizirano());
        dto.setArhivaId(predmet.getArhiva().stream().map(Arhiva::getId).toList());
        dto.setZabeleska(predmet.getZabeleska());
//        dto.setRoditelPredmetId(predmet.getRoditelPredmet() != null
//                ? predmet.getRoditelPredmet().getId() : null);
//        dto.setOrganizaciskaEdinicaId(predmet.getOrganizaciskaedinica() != null
//                ? predmet.getOrganizaciskaedinica().getId() : null);
        dto.setStatusPredmet(predmet.getStatusPredmet());
        dto.setTipDelovnik(predmet.getTipDelovnik());
        dto.setTipOdgovor(predmet.getTipOdgovor());
        dto.setIsActive(predmet.isActive());
        dto.setIsprakjacIme(predmet.getIsprakjacIme());
        dto.setPromenilKorisnik(promenil);
        return dto;
    }
}