package com.example.backend.web_controller;

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

//    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping
    public List<VidPredmetIspratena> getAllVidPredmet() {
        return this.vidPredmetService.getAllVidPredmet();
    }

//    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping("/{id}")
    public VidPredmetIspratena getVidPredmetById(@PathVariable Long id) {
        return this.vidPredmetService.getVidPredmetById(id);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public VidPredmetIspratena createVidPredmet(@RequestBody VidPredmetRequest request) {
        return this.vidPredmetService.createVidPredmet(request);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public VidPredmetIspratena updateVidPredmet(@PathVariable Long id, @RequestBody VidPredmetRequest request) {
        return this.vidPredmetService.updateVidPredmet(id, request);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteVidPredmet(@PathVariable Long id) {
        this.vidPredmetService.deleteVidPredmetById(id);
    }
}
