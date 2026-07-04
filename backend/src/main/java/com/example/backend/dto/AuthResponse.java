package com.example.backend.dto;

import com.example.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;
    private String ime;
    private String prezime;
    private String email;
    private Role uloga;
    private Long organizaciskaEdinicaId;

}
