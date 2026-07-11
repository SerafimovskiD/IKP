package com.example.backend.dto;
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
    private Long ispratenoDoId;
    private List<Long> vidPredmetIspratenaId;
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
