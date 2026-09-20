package com.example.backend.dto;

import java.util.UUID;

import com.example.backend.model.SkeniraniDokumenti;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SkeniraniDokumentiResponse {
    private UUID id;
    private UUID predmetId;
    private String imeFile;
    private String tipFile;
    private Long golemina;
    private LocalDateTime datumUpload;
    private UUID userId;
    private String uploadedBy;

    public static SkeniraniDokumentiResponse from(SkeniraniDokumenti d) {
        SkeniraniDokumentiResponse dto = new SkeniraniDokumentiResponse();
        dto.setId(d.getId());
        dto.setPredmetId(d.getPredmet().getId());
        dto.setImeFile(d.getImeFile());
        dto.setTipFile(d.getTipFile());
        dto.setGolemina(d.getGolemina());
        dto.setDatumUpload(d.getDatumUpload());
        if (d.getUser() != null) {
            dto.setUserId(d.getUser().getId());
            dto.setUploadedBy(d.getUser().getIme() + " " + d.getUser().getPrezime());
        }
        return dto;
    }
}