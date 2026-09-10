package com.example.backend.model;

import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class OrganizaciskaEdinica {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String naziv;
    @Column(unique = true, nullable = false)
    private String code;
}
