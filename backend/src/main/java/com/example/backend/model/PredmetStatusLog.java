package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class PredmetStatusLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "predmet_id")
    private Predmet predmet;

    @Enumerated(EnumType.STRING)
    private StatusPredmet oldStatus;

    @Enumerated(EnumType.STRING)
    private StatusPredmet newStatus;
    @ManyToOne
    @JoinColumn(name = "changed_by_id")
    private UserTable changedBy;

    private LocalDateTime changedAt;

}
