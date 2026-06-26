package com.example.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class SkeniraniDokumenti {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "predmet_id")
    private Predmet predmet;
    private String imeFile;
    private String pateka;
    private LocalDateTime datumUpload;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserTable user;

    public SkeniraniDokumenti() {}

    public SkeniraniDokumenti(Predmet predmet, String imeFile, String pateka, LocalDateTime datumUpload, UserTable user) {
        this.predmet = predmet;
        this.imeFile = imeFile;
        this.pateka = pateka;
        this.datumUpload = datumUpload;
        this.user = user;
    }
    public Predmet getPredmet() {
        return predmet;
    }
    public void setPredmet(Predmet predmet) {
        this.predmet = predmet;
    }
    public String getImeFile() {
        return imeFile;
    }
    public void setImeFile(String imeFile) {
        this.imeFile = imeFile;
    }
    public String getPateka() {
        return pateka;
    }
    public void setPateka(String pateka) {
        this.pateka = pateka;
    }
    public LocalDateTime getDatumUpload() {
        return datumUpload;
    }
    public void setDatumUpload(LocalDateTime datumUpload) {
        this.datumUpload = datumUpload;
    }

    public UserTable getUser() {
        return user;
    }
    public void setUser(UserTable user) {
        this.user = user;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
