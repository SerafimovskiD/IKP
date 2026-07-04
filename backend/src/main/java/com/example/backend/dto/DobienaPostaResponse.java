package com.example.backend.dto;

import com.example.backend.model.*;
import lombok.Data;

import java.time.LocalDate;

@Data
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

    private Long vidPredmetId;
    private String vidPredmetNaziv;

    private String sodrzina;

    private Long odgovornoLiceId;
    private String odgovornoLiceIme;
    private String odgovornoLicePrezime;
    private String odgovornoLiceEmail;

    private Boolean informativnaPosta;
    private Boolean realizirano;

    private Long arhivaId;
    private String arhivaNaziv;

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

        if (predmet.getIsprakjac() != null) {
            dto.setIsprakjacId(predmet.getIsprakjac().getId());
            dto.setIsprakjacNaziv(predmet.getIsprakjac().getNaziv());
        }

        dto.setBrAktNivni(predmet.getBrAktNivni());
        dto.setDatumIsprakjanje(predmet.getDatumIsprakjanje());
        dto.setBrAktArhivski(predmet.getBrAktArhivski());

        if (predmet.getVidPredmet() != null) {
            dto.setVidPredmetId(predmet.getVidPredmet().getId());
            dto.setVidPredmetNaziv(predmet.getVidPredmet().getNaziv());
        }

        dto.setSodrzina(predmet.getSodrzina());

        if (predmet.getOdgovornoLice() != null) {
            dto.setOdgovornoLiceId(predmet.getOdgovornoLice().getId());
            dto.setOdgovornoLiceIme(predmet.getOdgovornoLice().getIme());
            dto.setOdgovornoLicePrezime(predmet.getOdgovornoLice().getPrezime());
            dto.setOdgovornoLiceEmail(predmet.getOdgovornoLice().getEmail());
        }

        dto.setInformativnaPosta(predmet.getInformativnaPosta());
        dto.setRealizirano(predmet.getRealizirano());

        if (predmet.getArhiva() != null) {
            dto.setArhivaId(predmet.getArhiva().getId());
            dto.setArhivaNaziv(predmet.getArhiva().getNaziv());
        }

        dto.setZabeleska(predmet.getZabeleska());

        dto.setStatusPredmet(predmet.getStatusPredmet());
        dto.setTipOdgovor(predmet.getTipOdgovor());

        return dto;
    }
}