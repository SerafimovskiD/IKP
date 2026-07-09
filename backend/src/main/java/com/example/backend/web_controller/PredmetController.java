package com.example.backend.web_controller;

import com.example.backend.dto.*;
import com.example.backend.service.nomenclature.SkeniraniDokumentiService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.multipart.MultipartFile;
import com.example.backend.model.Predmet;
import com.example.backend.service.nomenclature.PredmetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/predmet")
public class PredmetController {
    private final PredmetService predmetService;
    private final SkeniraniDokumentiService skeniraniDokumentiService;

    public PredmetController(PredmetService predmetService, SkeniraniDokumentiService skeniraniDokumentiService) {
        this.skeniraniDokumentiService = skeniraniDokumentiService;
        this.predmetService = predmetService;
    }

//    @PostMapping
//    public Predmet createDobienaPosta(@RequestBody DobienaPostaRequest request) {
//        return this.predmetService.createDobienaPosta(request);
//    }

    @PreAuthorize("hasAnyRole('POMOSNIK','NACALNIK','ADMIN')")
    @PostMapping("/dobiena")
    public ResponseEntity<DobienaPostaResponse> createDobienaPosta(@RequestBody DobienaPostaRequest dobienaPostaRequest, @AuthenticationPrincipal UserDetails userDetails) {
        String email =userDetails.getUsername();
        return ResponseEntity.ok(predmetService.createDobienaPosta(dobienaPostaRequest,email));
    }

    @PreAuthorize("hasAnyRole('POMOSNIK','NACALNIK','ADMIN')")
    @PutMapping("/odgovorDobienaPosta")
    public ResponseEntity<DobienaPostaResponse> odgovorDobienaPosta(@RequestBody DobienaPostaRequest dobienaPostaRequest, @AuthenticationPrincipal UserDetails userDetails,@RequestParam Integer predmetSoRedBr,@RequestParam Integer godina) {
        String email =userDetails.getUsername();
        return ResponseEntity.ok(predmetService.odgovorDobienaPosta(dobienaPostaRequest,email,predmetSoRedBr,godina));
    }


    @PreAuthorize("hasAnyRole('OSL','NACALNIK','ADMIN')")
    @PutMapping("/{id}/status")
    public Predmet updateStatusPredmet(@PathVariable Long id, @RequestBody StatusPredmetRequest request, Authentication authentication) {
        return this.predmetService.updateStatusPredmet(id, request, authentication.getName());
    }

    @PreAuthorize("hasAnyRole('POMOSNIK','NACALNIK','ADMIN')")
    @PostMapping("/ispratena")
    public Predmet createIspratenaPosta(@RequestBody IspratenaPostaRequest request) {
        return this.predmetService.createIspratenaPosta(request);
    }
    @PostMapping("/{predmetId}/skenirani-dokumenti/upload")
    public SkeniraniDokumentiResponse uploadSkeniraniDokumenti(@PathVariable Long predmetId,
                                                       @RequestParam("file") MultipartFile file,
                                                       Authentication authentication) {
        return this.skeniraniDokumentiService.uploadDokument(
                predmetId,
                file,
                authentication.getName()
        );
    }
    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping
    public ResponseEntity<Page<PredmetListResponse>> getAllPredmeti(
            @ParameterObject
            @PageableDefault(size = 20,sort = "datumZaveduvanje",direction = Sort.Direction.DESC)Pageable pageable) {
        return ResponseEntity.ok(predmetService.getAllPredmeti(pageable));
    }
}
