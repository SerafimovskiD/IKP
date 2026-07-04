package com.example.backend.dto;

import com.example.backend.model.Prioritet;
import com.example.backend.model.StatusPredmet;
import com.example.backend.model.TipPosta;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class DobienaPostaRequest {
//    private String brAkt;
//    private Integer redenBroj;
//    private Integer podBroj;
//    private Integer godina;
    private LocalDate datumZaveduvanje;

    private TipPosta tipPosta;
    private Prioritet prioritet;
    private Long isprakjacId;

    private String brAktNivni;
    private LocalDate datumIsprakjanje;
    private String brAktArhivski;

    private List<Long> vidPredmetId;
    private String sodrzina;
    private List<Long> odgovornoLiceId;

    private Boolean informativnaPosta;
    private Boolean realizirano;

    private List<Long> arhivaId;
    private String zabeleska;
//    private Long roditelPredmetId;
//    private Long organizaciskaEdinicaId;
    private StatusPredmet statusPredmet;
}
