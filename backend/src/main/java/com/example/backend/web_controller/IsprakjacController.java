package com.example.backend.web_controller;

import com.example.backend.model.Isprakjac;
import com.example.backend.service.nomenclature.IsprakjacService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/isprakjaci")
public class IsprakjacController {
    private final IsprakjacService isprakjacService;

    public IsprakjacController(IsprakjacService isprakjacService) {
        this.isprakjacService = isprakjacService;
    }

    @GetMapping
    public List<Isprakjac> getAllIsprakjac() {
        return isprakjacService.getAllIsprakjaci();
    }
    @GetMapping("/{id}")
    public Isprakjac getIsprakjacById(@PathVariable Long id) {
        return isprakjacService.getIsprakjacById(id);
    }

    @PostMapping
    public Isprakjac createIsprakjac(@RequestBody Isprakjac isprakjac) {
        return isprakjacService.createIsprakjac(isprakjac);
    }
    @PutMapping("/{id}")
    public Isprakjac updateIsprakjac(@PathVariable Long id, @RequestBody Isprakjac isprakjac) {
        return this.isprakjacService.updateIsprakjac(id, isprakjac);
    }
    @DeleteMapping("/{id}")
    public void deleteIsprakjacById(@PathVariable Long id) {
        this.isprakjacService.deleteIsprakjacById(id);
    }
}
