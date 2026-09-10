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
    //Neznam dali e tocno tuka ke napravam code od orgEdinica no mozebi
    // i da e drug vo dokumentot koj mi go prati mentorot pisuva broj
    // na organizaciska ednica no dali e istoto ne sum siguren <-Naum
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizaciska_edinica_id",
            referencedColumnName = "code")
    private OrganizaciskaEdinica organizaciskaEdinica;
    private String naziv;

}