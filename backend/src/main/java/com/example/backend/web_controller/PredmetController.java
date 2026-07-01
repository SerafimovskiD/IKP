package com.example.backend.web_controller;

import com.example.backend.dto.DobienaPostaRequest;
import com.example.backend.model.Predmet;
import com.example.backend.service.nomenclature.PredmetService;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.StatusPredmetRequest;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/predmet")
public class PredmetController {
    private final PredmetService predmetService;

    public PredmetController(PredmetService predmetService) {
        this.predmetService = predmetService;
    }

    @PostMapping
    public Predmet createDobienaPosta(@RequestBody DobienaPostaRequest request) {
        return this.predmetService.createDobienaPosta(request);
    }

    @PutMapping("/{id}/status")
    public Predmet updateStatusPredmet(@PathVariable Long id, @RequestBody StatusPredmetRequest request, Authentication authentication) {
        return this.predmetService.updateStatusPredmet(id, request, authentication.getName());
    }
}
