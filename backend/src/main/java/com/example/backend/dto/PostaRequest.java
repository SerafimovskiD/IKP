package com.example.backend.dto;

import java.util.UUID;

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
    private List<UUID> odgovornoLiceId;
    private Boolean informativnaPosta;
    private Boolean realizirano;
    private List<UUID> arhivaId;
    private String zabeleska;
    private StatusPredmet statusPredmet;
    private UUID isprakjacId;
    private Boolean isActive;
    private String isprakjacIme;
    private List<UUID> dodelenoNaId;
    // Samo dobiena
    private Prioritet prioritet;
    private String brAktNivni;
    private LocalDate datumIsprakjanje;
    private String brAktArhivski;
    private List<UUID> vidPredmetDobienaId;

    // Samo ISpratena
    private List<UUID> vidPredmetIspratenaId;
}