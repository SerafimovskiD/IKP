package com.example.backend.dto;

import java.util.UUID;

import com.example.backend.model.*;
import com.example.backend.model.enums.StatusPredmet;
import com.example.backend.model.enums.TipPosta;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@JsonPropertyOrder({
        "id", "brAkt", "redenBroj", "podBroj", "godina",
        "datumZaveduvanje", "tipPosta", "ispratenoDoId",
        "datumIsprakjanje", "brAktArhivski", "vidPredmetId",
        "sodrzina", "odgovornoLiceId", "informativnaPosta",
        "realizirano", "arhivaId", "zabeleska",
        "statusPredmet"
})
public class IspratenaPostaResponse {
    private UUID id;

    private String brAkt;
    private Integer redenBroj;
    private Integer podBroj;
    private Integer godina;
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

    public static IspratenaPostaResponse from(Predmet predmet) {
        IspratenaPostaResponse dto = new IspratenaPostaResponse();

        dto.setId(predmet.getId());
        dto.setBrAkt(predmet.getBrAkt());
        dto.setRedenBroj(predmet.getRedenBroj());
        dto.setPodBroj(predmet.getPodBroj());
        dto.setGodina(predmet.getGodina());
        dto.setDatumZaveduvanje(predmet.getDatumZaveduvanje());
        dto.setTipPosta(predmet.getTipPosta());
        dto.setVidPredmetIspratenaId(predmet.getVidPredmetIspratena().stream().map(VidPredmetIspratena::getId).toList());
        dto.setSodrzina(predmet.getSodrzina());
        dto.setOdgovornoLiceId(predmet.getOdgovornoLice().stream().map(UserTable::getId).toList());
        dto.setInformativnaPosta(predmet.getInformativnaPosta());
        dto.setRealizirano(predmet.getRealizirano());
        dto.setArhivaId(predmet.getArhiva().stream().map(Arhiva::getId).toList());
        dto.setZabeleska(predmet.getZabeleska());
        dto.setStatusPredmet(predmet.getStatusPredmet());

        return dto;
    }
}
