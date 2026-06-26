package com.example.backend.model;

import jakarta.persistence.*;

@Entity
public class Arhiva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String naziv;
    @ManyToOne()
    @JoinColumn(name = "organizaciskaedinica_id")
    private Organizaciskaedinica organizaciskaedinica;
    public Arhiva() {}
    public Arhiva(String naziv, Organizaciskaedinica organizaciskaedinica){
        this.naziv = naziv;
        this.organizaciskaedinica = organizaciskaedinica;
    }
    public String getNaziv() {
        return naziv;
    }
    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public Organizaciskaedinica getOrganizaciskaedinica() {
        return organizaciskaedinica;
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
}
