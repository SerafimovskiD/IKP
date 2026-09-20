package com.example.backend.dto;

import java.util.UUID;

import com.example.backend.model.OrganizaciskaEdinica;
import lombok.Data;

import java.util.List;

@Data
public class OrgEdinicaResponse {
    private UUID id;
    private String naziv;
    private String code;

    public static OrgEdinicaResponse from(OrganizaciskaEdinica organizaciskaEdinica){
        OrgEdinicaResponse response = new OrgEdinicaResponse();
        response.setId(organizaciskaEdinica.getId());
        response.setNaziv(organizaciskaEdinica.getNaziv());
        response.setCode(organizaciskaEdinica.getCode());
        return response;
    }
    public static List<OrgEdinicaResponse> from (List<OrganizaciskaEdinica> organizaciska){
        return organizaciska.stream().map(OrgEdinicaResponse::from).toList();
    }
}
