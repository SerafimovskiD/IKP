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

    public Predmet() {}

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getBrAkt() {
        return brAkt;
    }

    public void setBrAkt(String brAkt) {
        this.brAkt = brAkt;
    }

    public Integer getRedenBroj() {
        return redenBroj;
    }

    public void setRedenBroj(Integer redenBroj) {
        this.redenBroj = redenBroj;
    }

    public Integer getPodBroj() {
        return podBroj;
    }

    public void setPodBroj(Integer podBroj) {
        this.podBroj = podBroj;
    }

    public LocalDate getDatumZaveduvanje() {
        return datumZaveduvanje;
    }

    public void setDatumZaveduvanje(LocalDate datumZaveduvanje) {
        this.datumZaveduvanje = datumZaveduvanje;
    }

    public Integer getGodina() {
        return godina;
    }

    public void setGodina(Integer godina) {
        this.godina = godina;
    }

    public TipPosta getTipPosta() {
        return tipPosta;
    }

    public void setTipPosta(TipPosta tipPosta) {
        this.tipPosta = tipPosta;
    }

    public Isprakjac getIsprakjac() {
        return isprakjac;
    }

    public void setIsprakjac(Isprakjac isprakjac) {
        this.isprakjac = isprakjac;
    }

    public Prioritet getPrioritet() {
        return prioritet;
    }

    public void setPrioritet(Prioritet prioritet) {
        this.prioritet = prioritet;
    }

    public String getBrAktNivni() {
        return brAktNivni;
    }

    public void setBrAktNivni(String brAktNivni) {
        this.brAktNivni = brAktNivni;
    }

    public LocalDate getDatumIsprakjanje() {
        return datumIsprakjanje;
    }

    public void setDatumIsprakjanje(LocalDate datumIsprakjanje) {
        this.datumIsprakjanje = datumIsprakjanje;
    }

    public String getBrAktArhivski() {
        return brAktArhivski;
    }

    public void setBrAktArhivski(String brAktArhivski) {
        this.brAktArhivski = brAktArhivski;
    }

    public String getSodrzina() {
        return sodrzina;
    }

    public void setSodrzina(String sodrzina) {
        this.sodrzina = sodrzina;
    }

    public VidPredmet getVidPredmet() {
        return vidPredmet;
    }

    public void setVidPredmet(VidPredmet vidPredmet) {
        this.vidPredmet = vidPredmet;
    }

    public Boolean getInformativnaPosta() {
        return informativnaPosta;
    }

    public void setInformativnaPosta(Boolean informativnaPosta) {
        this.informativnaPosta = informativnaPosta;
    }

    public UserTable getOdgovornoLice() {
        return odgovornoLice;
    }

    public void setOdgovornoLice(UserTable odgovornoLice) {
        this.odgovornoLice = odgovornoLice;
    }

    public Boolean getRealizirano() {
        return realizirano;
    }

    public void setRealizirano(Boolean realizirano) {
        this.realizirano = realizirano;
    }

    public Arhiva getArhiva() {
        return arhiva;
    }

    public void setArhiva(Arhiva arhiva) {
        this.arhiva = arhiva;
    }

    public String getZabeleska() {
        return zabeleska;
    }

    public void setZabeleska(String zabeleska) {
        this.zabeleska = zabeleska;
    }

    public Predmet getRoditelPredmet() {
        return roditelPredmet;
    }

    public void setRoditelPredmet(Predmet roditelPredmet) {
        this.roditelPredmet = roditelPredmet;
    }

    public IspratenDo getIspratenoDo() {
        return ispratenoDo;
    }

    public void setIspratenoDo(IspratenDo ispratenDo) {
        this.ispratenoDo = ispratenDo;
    }

    public TipOdgovor getTipOdgovor() {
        return tipOdgovor;
    }

    public void setTipOdgovor(TipOdgovor tipOdgovor) {
        this.tipOdgovor = tipOdgovor;
    }

    public OrganizaciskaEdinica getOrganizaciskaedinica() {
        return organizaciskaedinica;
    }

    public void setOrganizaciskaedinica(OrganizaciskaEdinica organizaciskaedinica) {
        this.organizaciskaedinica = organizaciskaedinica;
    }

    public StatusPredmet getStatusPredmet() {
        return statusPredmet;
    }

    public void setStatusPredmet(StatusPredmet statusPredmet) {
        this.statusPredmet = statusPredmet;
    }
}
