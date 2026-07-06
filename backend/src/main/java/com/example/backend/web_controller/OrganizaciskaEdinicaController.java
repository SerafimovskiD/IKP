package com.example.backend.web_controller;

import com.example.backend.dto.OrgEdinicaRequest;
import com.example.backend.dto.OrgEdinicaResponse;
import com.example.backend.service.nomenclature.OrganizaciskaEdinicaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orgEdinica")
public class OrganizaciskaEdinicaController {

    private final OrganizaciskaEdinicaService organizaciskaEdinicaService;

    public OrganizaciskaEdinicaController(OrganizaciskaEdinicaService organizaciskaEdinicaService) {
        this.organizaciskaEdinicaService = organizaciskaEdinicaService;
    }

    //    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping
    public ResponseEntity<List<OrgEdinicaResponse>> getAll() {
        return ResponseEntity.ok(organizaciskaEdinicaService.findAll());
    }

//    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<OrgEdinicaResponse> getById(@PathVariable Long id){
        return ResponseEntity.ok(organizaciskaEdinicaService.findById(id));
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<OrgEdinicaResponse> create(@RequestBody OrgEdinicaRequest orgEdinicaRequest){
        return ResponseEntity.ok(organizaciskaEdinicaService.create(orgEdinicaRequest));
    }
//
//    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<OrgEdinicaResponse> update(@PathVariable Long id,@RequestBody OrgEdinicaRequest orgEdinicaRequest){
        return ResponseEntity.ok(organizaciskaEdinicaService.update(id,orgEdinicaRequest));
    }
//
//    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        organizaciskaEdinicaService.delete(id);
    }
}
