package com.example.backend.model;

import jakarta.persistence.*;

@Entity
public class UserTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ime;
    private String prezime;
    private String password;
    private String email;
    private String uloga;

    @ManyToOne
    @JoinColumn(name = "organizaciskaedinica_id")
    private Organizaciskaedinica organizaciskaedinica;

    @ManyToOne
    @JoinColumn(name = "nacalnik_na_vrab_id")
    private UserTable nacalnikNaVrab;

    public UserTable() {}

    public UserTable(String ime, String prezime, String password, String email, String uloga,Organizaciskaedinica organizaciskaedinica,UserTable nacalnikNaVrab) {
        this.ime = ime;
        this.prezime = prezime;
        this.password = password;
        this.email = email;
        this.uloga = uloga;
        this.organizaciskaedinica = organizaciskaedinica;
        this.nacalnikNaVrab = nacalnikNaVrab;

    }
public String getIme() {
        return ime;
    }
    public void setIme(String ime) {
        this.ime = ime;
    }
    public String getPrezime() {
        return prezime;
    }
    public void setPrezime(String prezime) {
        this.prezime = prezime;

    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getUloga() {
        return uloga;
    }
    public Organizaciskaedinica getOrganizaciskaedinica() {
        return organizaciskaedinica;
    }
    public UserTable getNacalnikNaVrab() {
        return nacalnikNaVrab;
    }

    public void setUloga(String uloga) {
        this.uloga = uloga;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setOrganizaciskaedinica(Organizaciskaedinica organizaciskaedinica) {
        this.organizaciskaedinica = organizaciskaedinica;
    }
    public void setNacalnikNaVrab(UserTable nacalnikNaVrab) {
        this.nacalnikNaVrab = nacalnikNaVrab;
    }
}
