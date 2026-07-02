package com.example.backend.web_controller;

import com.example.backend.dto.ArhivaRequest;
import com.example.backend.model.Arhiva;
import com.example.backend.service.nomenclature.ArhivaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/arhivi")
public class ArhivaController {
    private final ArhivaService arhivaService;

    public ArhivaController(ArhivaService arhivaService) {
        this.arhivaService = arhivaService;
    }

    @GetMapping
    public List<Arhiva> getArhiva(){
        return this.arhivaService.getAllArhivi();
    }
    @GetMapping("/{id}")
    public Arhiva getArhivaById(@PathVariable Long id){
        return this.arhivaService.getArhivaById(id);
    }
    @PostMapping
    public Arhiva createArhiva(@RequestBody ArhivaRequest arhivaRequest){
        return this.arhivaService.createArhiva(arhivaRequest);
    }
    @PutMapping("/{id}")
    public Arhiva updateArhiva(@PathVariable Long id,@RequestBody ArhivaRequest arhivaRequest){
        return this.arhivaService.updateArhiva(id,arhivaRequest);
    }
    @DeleteMapping("/{id}")
    public void deleteArhiva(@PathVariable Long id){
        this.arhivaService.deleteArhiva(id);
    }
}
