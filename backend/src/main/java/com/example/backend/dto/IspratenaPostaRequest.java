package com.example.backend.dto;

import java.util.UUID;
import java.time.LocalDate;
import java.util.List;

import com.example.backend.model.enums.StatusPredmet;
import com.example.backend.model.enums.TipPosta;
import lombok.Data;

@Data
public class IspratenaPostaRequest {
    private LocalDate datumZaveduvanje;
    private TipPosta tipPosta;

    private UUID ispratenoDoId;
    private List<UUID> vidPredmetIspratenaId;
    private String sodrzina;
    private List<UUID> odgovornoLiceId;
    private Boolean informativnaPosta;
    private Boolean realizirano;
    private List<UUID> arhivaId;
    private String zabeleska;

    private StatusPredmet statusPredmet;

}
