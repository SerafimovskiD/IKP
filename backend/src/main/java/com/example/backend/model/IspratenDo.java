package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class IspratenDo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String naziv;

    public IspratenDo() {}
    public IspratenDo(String naziv) {
        this.naziv = naziv;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }
    public String getNaziv() {
        return naziv;
    }
}
