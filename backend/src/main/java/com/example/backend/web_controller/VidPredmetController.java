package com.example.backend.web_controller;

import com.example.backend.dto.VidPredmetRequest;
import com.example.backend.model.VidPredmet;
import com.example.backend.service.nomenclature.VidPredmetService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vidovi-predmet")
public class VidPredmetController {
    private final VidPredmetService vidPredmetService;

    public VidPredmetController(VidPredmetService vidPredmetService) {
        this.vidPredmetService = vidPredmetService;
    }

    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping
    public List<VidPredmet> getAllVidPredmet() {
        return this.vidPredmetService.getAllVidPredmet();
    }

    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping("/{id}")
    public VidPredmet getVidPredmetById(@PathVariable Long id) {
        return this.vidPredmetService.getVidPredmetById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public VidPredmet createVidPredmet(@RequestBody VidPredmetRequest request) {
        return this.vidPredmetService.createVidPredmet(request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public VidPredmet updateVidPredmet(@PathVariable Long id, @RequestBody VidPredmetRequest request) {
        return this.vidPredmetService.updateVidPredmet(id, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteVidPredmet(@PathVariable Long id) {
        this.vidPredmetService.deleteVidPredmetById(id);
    }
}
