package com.example.backend.model;

import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.BatchSize;

@Entity
@Data
public class UserTable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String ime;
    private String prezime;
    private String password;
    private String email;
    private Role uloga;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizaciskaedinica_id")
    private OrganizaciskaEdinica organizaciskaEdinica;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nacalnik_na_vrab_id")
    private UserTable nacalnikNaVrab;
}
