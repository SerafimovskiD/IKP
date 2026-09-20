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

    @GetMapping
    public List<VidPredmetDobiena> getAllVidPredmet() {
        return this.vidPredmetService.getAllVidPredmet();
    }

    @GetMapping("/{id}")
    public VidPredmetDobiena getVidPredmetById(@PathVariable UUID id) {
        return this.vidPredmetService.getVidPredmetById(id);
    }

    @PostMapping
    public VidPredmetDobiena createVidPredmet(@RequestBody VidPredmetRequest request) {
        return this.vidPredmetService.createVidPredmet(request);
    }

    @PutMapping("/{id}")
    public VidPredmetDobiena updateVidPredmet(@PathVariable UUID id, @RequestBody VidPredmetRequest request) {
        return this.vidPredmetService.updateVidPredmet(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteVidPredmet(@PathVariable UUID id) {
        this.vidPredmetService.deleteVidPredmetById(id);
    }
}
