package com.example.backend.dto;

import com.example.backend.model.*;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@JsonPropertyOrder({
        "id", "brAkt", "redenBroj", "podBroj", "godina",
        "datumZaveduvanje", "tipPosta", "prioritet",
        "isprakjacId", "isprakjacNaziv", "brAktNivni",
        "datumIsprakjanje", "brAktArhivski", "vidPredmetId",
        "sodrzina", "odgovornoLiceId", "informativnaPosta",
        "realizirano", "arhivaId", "zabeleska",
        "statusPredmet", "tipOdgovor"
})
public class DobienaPostaResponse {
    private Long id;

    private String brAkt;
    private Integer redenBroj;
    private Integer podBroj;
    private Integer godina;
    private LocalDate datumZaveduvanje;

    private TipPosta tipPosta;
    private Prioritet prioritet;

    private Long isprakjacId;
    private String isprakjacNaziv;

    private String brAktNivni;
    private LocalDate datumIsprakjanje;
    private String brAktArhivski;

    //Naum
    private List<Long> vidPredmetId;
    //    private Long vidPredmetId;
    //Mislam nema potreba da ima i naziv poso ke go dobivame preku ID <-Naum
//    private String vidPredmetNaziv;

    private String sodrzina;

    private List<Long> odgovornoLiceId;
    //Naum
//    private Long odgovornoLiceId;
    //Isto ko gore <-Naum
//    private String odgovornoLiceIme;
//    private String odgovornoLicePrezime;
//    private String odgovornoLiceEmail;

    private Boolean informativnaPosta;
    private Boolean realizirano;

    private List<Long> arhivaId;
    //Naum
//    private Long arhivaId;
    //isto ko gore <Naum
//    private String arhivaNaziv;

    private String zabeleska;

    private StatusPredmet statusPredmet;
    private TipOdgovor tipOdgovor;

    public static DobienaPostaResponse from(Predmet predmet) {
        DobienaPostaResponse dto = new DobienaPostaResponse();

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
        dto.setVidPredmetId(predmet.getVidPredmet().stream().map(VidPredmet::getId).toList());
        dto.setSodrzina(predmet.getSodrzina());
        dto.setOdgovornoLiceId(predmet.getOdgovornoLice().stream().map(UserTable::getId).toList());
        dto.setInformativnaPosta(predmet.getInformativnaPosta());
        dto.setRealizirano(predmet.getRealizirano());
        dto.setArhivaId(predmet.getArhiva().stream().map(Arhiva::getId).toList());
        dto.setZabeleska(predmet.getZabeleska());
//        dto.setRoditelPredmetId(predmet.getRoditelPredmet() != null
//                ? predmet.getRoditelPredmet().getId() : null);
//        dto.setOrganizaciskaEdinicaId(predmet.getOrganizaciskaedinica() != null
//                ? predmet.getOrganizaciskaedinica().getId() : null);
//        dto.setStatusPredmet(predmet.getStatusPredmet());

        return dto;
    }
}