package com.example.backend.model;

import java.util.UUID;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.BatchSize;


import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Table(name = "predmet", indexes = {
        @Index(name = "idx_predmet_datum_zaveduvanje", columnList = "datum_zaveduvanje"),
        @Index(name = "idx_predmet_godina", columnList = "godina"),
        @Index(name = "idx_predmet_isprakjac", columnList = "isprakjac_id"),
        @Index(name = "idx_predmet_status", columnList = "status_predmet"),
        @Index(name = "idx_predmet_realizirano", columnList = "realizirano"),
        @Index(name = "idx_predmet_tip_delovnik", columnList = "tip_delovnik"),
        @Index(name = "idx_predmet_godina_reden_pod", columnList = "godina, reden_broj, pod_broj"),
})
@BatchSize(size = 50)
public class Predmet {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String brAkt;
    private Integer redenBroj;
    private Integer podBroj;
    private Integer godina;
    private LocalDate datumZaveduvanje;
    @Enumerated(EnumType.STRING)
    private TipPosta tipPosta;
    @Enumerated(EnumType.STRING)
    private Prioritet prioritet;

    //mislam 1 bese isprakjac nemoze pojke da se <-Naum
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "isprakjac_id")
    private Isprakjac isprakjac;
    private String brAktNivni;
    private LocalDate datumIsprakjanje;
    private String brAktArhivski;


    @ManyToMany
//    @JoinTable(
//            name = "vid_predmet",
//            joinColumns = @JoinColumn(name = "vid_predmet_id"),
//            inverseJoinColumns = @JoinColumn(name = "vid_predmet_id")
//    )
//    @JoinColumn(name = "vid_predmet_id")
    private Set<VidPredmetDobiena> vidPredmetDobiena = new HashSet<>();

    @ManyToMany
    private Set<VidPredmetIspratena> vidPredmetIspratena = new HashSet<>();
    @Column(length = 2000)
    private String sodrzina;
    @ManyToMany
//    @JoinColumn(name = "odgovorno_lice_id")
    private Set<UserTable> odgovornoLice = new HashSet<>();

    @ManyToMany
    private Set<UserTable> dodelenoNa = new HashSet<>();
    private Boolean informativnaPosta;
    private Boolean realizirano;

    @ManyToMany
//    @JoinColumn(name = "arhiva_id")
    private Set<Arhiva> arhiva = new HashSet<>();

    @Column(length = 2000)
    private String zabeleska;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "roditel_predmet_id")
//    private Predmet roditelPredmet;

    @Enumerated(EnumType.STRING)
    private TipDelovnik tipDelovnik;
    @Enumerated(EnumType.STRING)
    private TipOdgovor tipOdgovor;

    //mozda visak <-Naum
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "organizaciskaedinica_id")
//    private OrganizaciskaEdinica organizaciskaedinica;

    @Enumerated(EnumType.STRING)
    private StatusPredmet statusPredmet;

    @Column(nullable = false)
    private boolean isActive;

    private String isprakjacIme;

    @ManyToOne
    private UserTable promenil;
}
