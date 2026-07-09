package com.example.backend.dto;

import com.example.backend.model.Predmet;
import com.example.backend.model.Prioritet;
import com.example.backend.model.StatusPredmet;
import com.example.backend.model.TipPosta;

import java.time.LocalDate;

public record PredmetListResponse(
        Long id,
        String brAkt,
        Integer redenBroj,
        Integer podBroj,
        Integer godina,
        LocalDate datumZaveduvanje,
        TipPosta tipPosta,
        Prioritet prioritet,
        String sodrzina,
        Boolean realizirano,
        StatusPredmet statusPredmet
) {
    public static PredmetListResponse from(Predmet p) {
        return new PredmetListResponse(
                p.getId(),p.getBrAkt(),p.getRedenBroj(),p.getPodBroj(),
                p.getGodina(),p.getDatumZaveduvanje(),p.getTipPosta(),
                p.getPrioritet(),p.getSodrzina(),p.getRealizirano(),
                p.getStatusPredmet()
        );
    }
}
