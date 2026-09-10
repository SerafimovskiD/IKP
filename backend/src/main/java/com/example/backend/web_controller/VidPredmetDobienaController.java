package com.example.backend.web_controller;

import java.util.UUID;

import com.example.backend.dto.VidPredmetRequest;
import com.example.backend.model.VidPredmetDobiena;
import com.example.backend.service.nomenclature.VidPredmetDobienaService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vid-predmet-dobiena")
public class VidPredmetDobienaController {
    private final VidPredmetDobienaService vidPredmetService;

    public VidPredmetDobienaController(VidPredmetDobienaService vidPredmetService) {
        this.vidPredmetService = vidPredmetService;
    }

//    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping
    public List<VidPredmetDobiena> getAllVidPredmet() {
        return this.vidPredmetService.getAllVidPredmet();
    }

//    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping("/{id}")
    public VidPredmetDobiena getVidPredmetById(@PathVariable UUID id) {
        return this.vidPredmetService.getVidPredmetById(id);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public VidPredmetDobiena createVidPredmet(@RequestBody VidPredmetRequest request) {
        return this.vidPredmetService.createVidPredmet(request);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public VidPredmetDobiena updateVidPredmet(@PathVariable UUID id, @RequestBody VidPredmetRequest request) {
        return this.vidPredmetService.updateVidPredmet(id, request);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteVidPredmet(@PathVariable UUID id) {
        this.vidPredmetService.deleteVidPredmetById(id);
    }
}
