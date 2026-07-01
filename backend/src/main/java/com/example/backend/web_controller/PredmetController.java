package com.example.backend.web_controller;

import com.example.backend.dto.DobienaPostaRequest;
import com.example.backend.model.Predmet;
import com.example.backend.service.nomenclature.PredmetService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/predmet")
public class PredmetController {
    private final PredmetService predmetService;

    public PredmetController(PredmetService predmetService) {
        this.predmetService = predmetService;
    }

    @PostMapping
    public Predmet createDobienaPosta(@RequestBody DobienaPostaRequest request){
        return this.predmetService.createDobienaPosta(request);
    }
}
