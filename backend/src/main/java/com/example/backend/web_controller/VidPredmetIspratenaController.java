package com.example.backend.web_controller;

import java.util.UUID;

import com.example.backend.dto.VidPredmetRequest;
import com.example.backend.model.VidPredmetDobiena;
import com.example.backend.model.VidPredmetIspratena;
import com.example.backend.service.nomenclature.VidPredmetDobienaService;
import com.example.backend.service.nomenclature.VidPredmetIspratenaService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vid-predmet-ispratena")
public class VidPredmetIspratenaController {
    private final VidPredmetIspratenaService vidPredmetService;

    public VidPredmetIspratenaController(VidPredmetIspratenaService vidPredmetService) {
        this.vidPredmetService = vidPredmetService;
    }

    @GetMapping
    public List<VidPredmetIspratena> getAllVidPredmet() {
        return this.vidPredmetService.getAllVidPredmet();
    }

    @GetMapping("/{id}")
    public VidPredmetIspratena getVidPredmetById(@PathVariable UUID id) {
        return this.vidPredmetService.getVidPredmetById(id);
    }

    @PostMapping
    public VidPredmetIspratena createVidPredmet(@RequestBody VidPredmetRequest request) {
        return this.vidPredmetService.createVidPredmet(request);
    }

    @PutMapping("/{id}")
    public VidPredmetIspratena updateVidPredmet(@PathVariable UUID id, @RequestBody VidPredmetRequest request) {
        return this.vidPredmetService.updateVidPredmet(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteVidPredmet(@PathVariable UUID id) {
        this.vidPredmetService.deleteVidPredmetById(id);
    }
}
