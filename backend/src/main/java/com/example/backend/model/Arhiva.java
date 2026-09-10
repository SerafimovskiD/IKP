package com.example.backend.model;

import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Arhiva {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String naziv;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizaciskaedinica_id")
    private OrganizaciskaEdinica organizaciskaedinica;
}
