package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
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


}
