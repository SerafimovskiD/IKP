package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class Predmet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
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
    private List<VidPredmetDobiena> vidPredmetDobiena;

    @ManyToMany
    private List<VidPredmetIspratena> vidPredmetIspratena;
    @Column(length = 2000)
    private String sodrzina;
    @ManyToMany
//    @JoinColumn(name = "odgovorno_lice_id")
    private List<UserTable> odgovornoLice;

    private Boolean informativnaPosta;
    private Boolean realizirano;

    @ManyToMany
//    @JoinColumn(name = "arhiva_id")
    private List<Arhiva> arhiva;

    @Column(length = 2000)
    private String zabeleska;

    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "roditel_predmet_id")
    private Predmet roditelPredmet;

    @Enumerated(EnumType.STRING)
    private TipOdgovor tipOdgovor;

    //mozda visak <-Naum
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizaciskaedinica_id")
    private OrganizaciskaEdinica organizaciskaedinica;

    @Enumerated(EnumType.STRING)
    private StatusPredmet statusPredmet;

}
