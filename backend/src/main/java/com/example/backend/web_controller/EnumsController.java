package com.example.backend.web_controller;

import com.example.backend.model.Prioritet;
import com.example.backend.model.StatusPredmet;
import com.example.backend.model.TipOdgovor;
import com.example.backend.model.TipPosta;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/enum")
public class EnumsController {
    @GetMapping("/prioritet")
    public List<Prioritet> prioritets() {
        return List.of(Prioritet.values());
    }
    @GetMapping("/tip-posta")
    public List<TipPosta> tipPostas() {
        return List.of(TipPosta.values());
    }
    @GetMapping("/tip-odgovor")
    public List<TipOdgovor> tipOdgovor() {
        return List.of(TipOdgovor.values());
    }
    @GetMapping("/status-predmet")
    public List<StatusPredmet> statusPredmet() {
        return List.of(StatusPredmet.values());
    }
}
