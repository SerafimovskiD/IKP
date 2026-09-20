package com.example.backend.model;

import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.BatchSize;

@Entity
@Data
public class Isprakjac{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizaciska_edinica_id",
            referencedColumnName = "code")
    private OrganizaciskaEdinica organizaciskaEdinica;
    private String naziv;

}