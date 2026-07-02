package com.example.backend.web_controller;

import com.example.backend.dto.IsprakjacRequest;
import com.example.backend.model.Isprakjac;
import com.example.backend.service.nomenclature.IsprakjacService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/isprakjaci")
public class IsprakjacController {
    private final IsprakjacService isprakjacService;

    public IsprakjacController(IsprakjacService isprakjacService) {
        this.isprakjacService = isprakjacService;
    }

    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping
    public List<Isprakjac> getAllIsprakjac() {
        return isprakjacService.getAllIsprakjaci();
    }

    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping("/{id}")
    public Isprakjac getIsprakjacById(@PathVariable Long id) {
        return isprakjacService.getIsprakjacById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Isprakjac createIsprakjac(@RequestBody IsprakjacRequest request) {
        return isprakjacService.createIsprakjac(request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Isprakjac updateIsprakjac(@PathVariable Long id, @RequestBody IsprakjacRequest request) {
        return this.isprakjacService.updateIsprakjac(id, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteIsprakjacById(@PathVariable Long id) {
        this.isprakjacService.deleteIsprakjacById(id);
    }
}
