package com.example.backend.web_controller;

import com.example.backend.dto.*;
import com.example.backend.repository.PredmetRepository;
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

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/predmet")
public class PredmetController {
    private final PredmetService predmetService;
    private final SkeniraniDokumentiService skeniraniDokumentiService;
    private final PredmetRepository predmetRepository;
    public PredmetController(PredmetService predmetService, SkeniraniDokumentiService skeniraniDokumentiService, PredmetRepository predmetRepository) {
        this.skeniraniDokumentiService = skeniraniDokumentiService;
        this.predmetService = predmetService;
        this.predmetRepository = predmetRepository;
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


//    @PreAuthorize("hasAnyRole('OSL','NACALNIK','ADMIN')")
//    @PutMapping("/{id}/status")
//    public Predmet updateStatusPredmet(@PathVariable Long id, @RequestBody StatusPredmetRequest request, Authentication authentication) {
//        return this.predmetService.updateStatusPredmet(id, request, authentication.getName());
//    }

    @PreAuthorize("hasAnyRole('POMOSNIK','NACALNIK','ADMIN')")
    @PostMapping("/ispratena")
    public ResponseEntity<IspratenaPostaResponse> createIspratenaPosta(@RequestBody IspratenaPostaRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        String email =userDetails.getUsername();
        return ResponseEntity.ok(predmetService.createIspratenaPosta(request,email));
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
            @PageableDefault(size = 20,sort = "datumZaveduvanje",direction = Sort.Direction.DESC)Pageable pageable,
            @RequestParam(required = false) Integer godina,
            @RequestParam(required = false) Integer redenBroj,
            @RequestParam(required = false) Long isprakjacId,
            @RequestParam(required = false) Long odgovornoLiceId,
            @RequestParam(required = false) Long vidPredmetDobienaId,
            @RequestParam(required = false) Long vidPredmetIspratenaId,
            @RequestParam(required = false) Boolean realizirano,
            @RequestParam(required = false) String search
    ){
        return ResponseEntity.ok(predmetService.getAllPredmeti(pageable,godina,redenBroj,isprakjacId,odgovornoLiceId,vidPredmetDobienaId,vidPredmetIspratenaId,realizirano,search));
    }
    @GetMapping("/next-reden-broj")
    public ResponseEntity<Integer> getNextRedenBroj() {
        Integer godina = LocalDate.now().getYear();
        Integer next = predmetRepository.findMaxRedenBroj(godina) + 1;
        return ResponseEntity.ok(next);
    }
}
