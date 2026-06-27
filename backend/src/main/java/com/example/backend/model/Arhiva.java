package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Arhiva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String naziv;
    @ManyToOne()
    @JoinColumn(name = "organizaciskaedinica_id")
    private OrganizaciskaEdinica organizaciskaedinica;
}
