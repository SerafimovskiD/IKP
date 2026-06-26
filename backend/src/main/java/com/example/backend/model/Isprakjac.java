package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity

public class Isprakjac{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String naziv;
    public Isprakjac(){
    }
    public Isprakjac(String naziv){
        this.naziv = naziv;
    }
    public Long getId() {
        return id;
    }
    public String getNaziv() {
        return naziv;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }
}