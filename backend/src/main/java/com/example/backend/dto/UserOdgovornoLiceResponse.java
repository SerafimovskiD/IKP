package com.example.backend.dto;

import com.example.backend.model.Role;
import com.example.backend.model.UserTable;
import lombok.Data;

@Data
public class UserOdgovornoLiceResponse {
    private Long id;
    private String ime;
    private String prezime;
    private String email;
    private Role uloga;
    public static UserOdgovornoLiceResponse from(UserTable user) {
        UserOdgovornoLiceResponse dto = new UserOdgovornoLiceResponse();
        dto.setId(user.getId());
        dto.setIme(user.getIme());
        dto.setPrezime(user.getPrezime());
        dto.setEmail(user.getEmail());
        dto.setUloga(user.getUloga());
        return dto;
    }
}
