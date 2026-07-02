package com.example.backend.web_controller;

import com.example.backend.dto.ArhivaRequest;
import com.example.backend.model.Arhiva;
import com.example.backend.service.nomenclature.ArhivaService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/arhivi")
public class ArhivaController {
    private final ArhivaService arhivaService;

    public ArhivaController(ArhivaService arhivaService) {
        this.arhivaService = arhivaService;
    }

    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping
    public List<Arhiva> getArhiva(){
        return this.arhivaService.getAllArhivi();
    }

    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping("/{id}")
    public Arhiva getArhivaById(@PathVariable Long id){
        return this.arhivaService.getArhivaById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Arhiva createArhiva(@RequestBody ArhivaRequest arhivaRequest){
        return this.arhivaService.createArhiva(arhivaRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Arhiva updateArhiva(@PathVariable Long id,@RequestBody ArhivaRequest arhivaRequest){
        return this.arhivaService.updateArhiva(id,arhivaRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteArhiva(@PathVariable Long id){
        this.arhivaService.deleteArhiva(id);
    }
}
