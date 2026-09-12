package com.example.backend.web_controller;

import com.example.backend.model.enums.Prioritet;
import com.example.backend.model.enums.StatusPredmet;
import com.example.backend.model.enums.TipDelovnik;
import com.example.backend.model.enums.TipPosta;
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
    public List<TipDelovnik> tipOdgovor() {
        return List.of(TipDelovnik.values());
    }
    @GetMapping("/status-predmet")
    public List<StatusPredmet> statusPredmet() {
        return List.of(StatusPredmet.values());
    }
}
