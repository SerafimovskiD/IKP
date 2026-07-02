package com.example.backend.dto;
import java.time.LocalDate;

import com.example.backend.model.Prioritet;
import com.example.backend.model.StatusPredmet;
import com.example.backend.model.TipPosta;
import lombok.Data;

@Data
public class IspratenaPostaRequest {
    private LocalDate datumZaveduvanje;
    private TipPosta tipPosta;
    private Prioritet prioritet;
    private String brAktNivni;
    private LocalDate datumIsprakjanje;
    private String brAktArhivski;
    private Long vidPredmetId;
    private String sodrzina;
    private Long odgovornoLiceId;
    private Boolean informativnaPosta;
    private Boolean realizirano;
    private Long arhivaId;
    private Long ispratenoDoId;
    private String zabeleska;
    private Long roditelPredmetId;
    private Long organizaciskaEdinicaId;
    private StatusPredmet statusPredmet;

}
