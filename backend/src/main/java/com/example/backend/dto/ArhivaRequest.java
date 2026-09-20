package com.example.backend.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class ArhivaRequest {
    private String naziv;
    private UUID organizaciskaEdinicaId;

}
