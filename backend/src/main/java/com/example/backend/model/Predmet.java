package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDate;

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

    @ManyToOne
    @JoinColumn(name = "isprakjac_id")
    private Isprakjac isprakjac;
    private String brAktNivni;
    private LocalDate datumIsprakjanje;
    private String brAktArhivski;

    @ManyToOne
    @JoinColumn(name = "vid_predmet_id")
    private VidPredmet vidPredmet;

    private String sodrzina;
    @ManyToOne
    @JoinColumn(name = "odgovorno_lice_id")
    private UserTable odgovornoLice;

    private Boolean informativnaPosta;
    private Boolean realizirano;

    @ManyToOne
    @JoinColumn(name = "arhiva_id")
    private Arhiva arhiva;

    private String zabeleska;

    @ManyToOne
    @JoinColumn(name = "roditel_predmet_id")
    private Predmet roditelPredmet;

    @ManyToOne
    @JoinColumn(name = "isprateno_do_id")
    private IspratenDo ispratenoDo;

    @Enumerated(EnumType.STRING)
    private TipOdgovor tipOdgovor;

    @ManyToOne
    @JoinColumn(name = "organizaciskaedinica_id")
    private OrganizaciskaEdinica organizaciskaedinica;

    @Enumerated(EnumType.STRING)
    private StatusPredmet statusPredmet;

}
