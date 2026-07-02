package com.example.backend.web_controller;

import com.example.backend.dto.VidPredmetRequest;
import com.example.backend.model.VidPredmet;
import com.example.backend.service.nomenclature.VidPredmetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vidovi-predmet")
public class VidPredmetController {
    private final VidPredmetService vidPredmetService;

    public VidPredmetController(VidPredmetService vidPredmetService) {
        this.vidPredmetService = vidPredmetService;
    }
    @GetMapping
    public List<VidPredmet> getAllVidPredmet() {
        return this.vidPredmetService.getAllVidPredmet();
    }
    @GetMapping("/{id}")
    public VidPredmet getVidPredmetById(@PathVariable Long id) {
        return this.vidPredmetService.getVidPredmetById(id);
    }
    @PostMapping
    public VidPredmet createVidPredmet(@RequestBody VidPredmetRequest request) {
        return this.vidPredmetService.createVidPredmet(request);
    }
    @PutMapping("/{id}")
    public VidPredmet updateVidPredmet(@PathVariable Long id, @RequestBody VidPredmetRequest request) {
        return this.vidPredmetService.updateVidPredmet(id, request);
    }
    @DeleteMapping("/{id}")
    public void deleteVidPredmet(@PathVariable Long id) {
        this.vidPredmetService.deleteVidPredmetById(id);
    }
}
