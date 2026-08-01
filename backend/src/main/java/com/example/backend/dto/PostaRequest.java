package com.example.backend.dto;

import com.example.backend.model.Prioritet;
import com.example.backend.model.StatusPredmet;
import com.example.backend.model.TipPosta;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PostaRequest {
    // Заеднички полиња
    private LocalDate datumZaveduvanje;
    private TipPosta tipPosta;
    private String sodrzina;
    private List<Long> odgovornoLiceId;
    private Boolean informativnaPosta;
    private Boolean realizirano;
    private List<Long> arhivaId;
    private String zabeleska;
    private StatusPredmet statusPredmet;
    private Long isprakjacId;
    private Boolean isActive;
    // Samo dobiena
    private Prioritet prioritet;
    private String brAktNivni;
    private LocalDate datumIsprakjanje;
    private String brAktArhivski;
    private List<Long> vidPredmetDobienaId;

    // Samo ISpratena
    private List<Long> vidPredmetIspratenaId;
}