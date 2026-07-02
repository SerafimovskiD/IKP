package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class UserTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ime;
    private String prezime;
    private String password;
    private String email;
    private String uloga;

    @ManyToOne
    @JoinColumn(name = "organizaciskaedinica_id")
    private OrganizaciskaEdinica organizaciskaEdinica;

    @ManyToOne
    @JoinColumn(name = "nacalnik_na_vrab_id")
    private UserTable nacalnikNaVrab;
}
