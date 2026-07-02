package com.example.backend.web_controller;

import com.example.backend.dto.DobienaPostaRequest;
import com.example.backend.dto.DobienaPostaResponse;
import com.example.backend.dto.IspratenaPostaRequest;
import com.example.backend.model.Predmet;
import com.example.backend.service.nomenclature.PredmetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.StatusPredmetRequest;
import org.springframework.security.core.Authentication;

import java.security.Principal;

@RestController
@RequestMapping("/api/predmet")
public class PredmetController {
    private final PredmetService predmetService;

    public PredmetController(PredmetService predmetService) {
        this.predmetService = predmetService;
    }

//    @PostMapping
//    public Predmet createDobienaPosta(@RequestBody DobienaPostaRequest request) {
//        return this.predmetService.createDobienaPosta(request);
//    }
    @PostMapping
    public ResponseEntity<DobienaPostaResponse> createDobienaPosta(@RequestBody DobienaPostaRequest dobienaPostaRequest, @AuthenticationPrincipal UserDetails userDetails) {
        String email =userDetails.getUsername();
        return ResponseEntity.ok(predmetService.createDobienaPosta(dobienaPostaRequest,email));
    }


    @PutMapping("/{id}/status")
    public Predmet updateStatusPredmet(@PathVariable Long id, @RequestBody StatusPredmetRequest request, Authentication authentication) {
        return this.predmetService.updateStatusPredmet(id, request, authentication.getName());
    }
    @PostMapping("/ispratena")
    public Predmet createIspratenaPosta(@RequestBody IspratenaPostaRequest request) {
        return this.predmetService.createIspratenaPosta(request);
    }
}
