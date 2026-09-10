package com.example.backend.dto;

import java.util.UUID;
import java.time.LocalDate;
import java.util.List;

import com.example.backend.model.Prioritet;
import com.example.backend.model.StatusPredmet;
import com.example.backend.model.TipPosta;
import lombok.Data;

@Data
public class IspratenaPostaRequest {
    private LocalDate datumZaveduvanje;
    private TipPosta tipPosta;
//    private Prioritet prioritet;
//    private String brAktNivni;
//    private LocalDate datumIsprakjanje;
//    private String brAktArhivski;
    // ^ Ne se potrebni vo ispratena posta <-Naum
    private UUID ispratenoDoId;
    private List<UUID> vidPredmetIspratenaId;
    private String sodrzina;
    private List<UUID> odgovornoLiceId;
    private Boolean informativnaPosta;
    private Boolean realizirano;
    private List<UUID> arhivaId;
    private String zabeleska;
//    private UUID roditelPredmetId;
//    private UUID organizaciskaEdinicaId;
    private StatusPredmet statusPredmet;

}
