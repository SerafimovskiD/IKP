package com.example.backend.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class RegisterRequest {
    private String ime;
    private String prezime;
    private String email;
    private String password;
    private String uloga;
    private UUID organizaciskaEdinicaId;
}
