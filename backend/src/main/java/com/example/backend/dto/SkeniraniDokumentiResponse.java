package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SkeniraniDokumentiResponse {
    private Long id;
    private Long predmetId;
    private String imeFile;
    private String pateka;
    private LocalDateTime datumUpload;
    private Long userId;
    private String uploadedBy;
}
