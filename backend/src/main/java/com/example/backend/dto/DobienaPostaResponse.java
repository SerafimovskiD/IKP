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
    private Isprakjac isprakjac;

    private String brAktNivni;
    private LocalDate datumIsprakjanje;
    private String brAktArhivski;

    private VidPredmet vidPredmet;
    private String sodrzina;
    private UserTable odgovornoLice;

    private Boolean informativnaPosta;
    private Boolean realizirano;

    private Arhiva arhiva;
    private String zabeleska;
//    private Long roditelPredmetId;
//    private Long organizaciskaEdinicaId;
//    private StatusPredmet statusPredmet;


    //Na pocetok ke prakjame site podatoci za da
    // znaeme so e kako e posle moze samo toa sto ke ni treba
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
        dto.setIsprakjac(predmet.getIsprakjac());
        dto.setBrAktNivni(predmet.getBrAktNivni());
        dto.setDatumIsprakjanje(predmet.getDatumIsprakjanje());
        dto.setBrAktArhivski(predmet.getBrAktArhivski());
        dto.setVidPredmet(predmet.getVidPredmet());
        dto.setSodrzina(predmet.getSodrzina());
        dto.setOdgovornoLice(predmet.getOdgovornoLice());
        dto.setInformativnaPosta(predmet.getInformativnaPosta());
        dto.setRealizirano(predmet.getRealizirano());
        dto.setArhiva(predmet.getArhiva());
        dto.setZabeleska(predmet.getZabeleska());
//        dto.setRoditelPredmetId(predmet.getRoditelPredmet() != null
//                ? predmet.getRoditelPredmet().getId() : null);
//        dto.setOrganizaciskaEdinicaId(predmet.getOrganizaciskaedinica() != null
//                ? predmet.getOrganizaciskaedinica().getId() : null);
//        dto.setStatusPredmet(predmet.getStatusPredmet());

        return dto;
    }
}