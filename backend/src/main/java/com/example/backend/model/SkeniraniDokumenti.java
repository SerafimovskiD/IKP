package com.example.backend.model;

import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Entity
@Data
public class SkeniraniDokumenti {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "predmet_id")
    private Predmet predmet;

    private String imeFile;
    private String tipFile;
    private Long golemina;

//    @Lob
    @Column(columnDefinition = "bytea")
    private byte[] content;

    private LocalDateTime datumUpload;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserTable user;
}