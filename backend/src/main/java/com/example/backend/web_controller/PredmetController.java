package com.example.backend.web_controller;

import com.example.backend.dto.*;
import com.example.backend.model.*;
import com.example.backend.repository.PredmetRepository;
import com.example.backend.service.nomenclature.SkeniraniDokumentiService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.multipart.MultipartFile;
import com.example.backend.service.nomenclature.PredmetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

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
    @PostMapping("/create")
    public ResponseEntity<PostaResponse> createPosta(
            @RequestBody PostaRequest request,
            @RequestParam TipDelovnik tipDelovnik,
            @RequestParam(required = false) TipOdgovor tipOdgovor,
            @RequestParam(required = false) Integer roditelRedenBroj,
            @RequestParam(required = false) Integer roditelGodina,
            @RequestParam(required = false) Integer oldPodbroj,
            @AuthenticationPrincipal UserDetails userDetails

    ) {
        return ResponseEntity.ok(
                predmetService.createPosta(request,
                        userDetails.getUsername(),
                        tipDelovnik,
                        tipOdgovor,
                        roditelRedenBroj,
                        roditelGodina,
                        oldPodbroj
                        )
        );
    }

//    @PreAuthorize("hasAnyRole('POMOSNIK','NACALNIK','ADMIN')")
//    @PostMapping("/odgovor")
//    public ResponseEntity<PostaResponse> odgovorPosta(
//            @RequestBody PostaRequest request,
//            @RequestParam Integer godina,
//            @RequestParam Integer redenBroj,
//            @RequestParam String brAkt,
//            @RequestParam Integer podBroj,
//            @RequestParam TipOdgovor tipOdgovor,
//            @AuthenticationPrincipal UserDetails userDetails) {
//        return ResponseEntity.ok(
//                predmetService.odgovorPosta(request,redenBroj,godina,podBroj,brAkt,tipOdgovor)
//        );
//    }

//    @PreAuthorize("hasAnyRole('POMOSNIK','NACALNIK','ADMIN')")
//    @PutMapping("/odgovorDobienaPosta")
//    public ResponseEntity<DobienaPostaResponse> odgovorDobienaPosta(@RequestBody DobienaPostaRequest dobienaPostaRequest, @AuthenticationPrincipal UserDetails userDetails,@RequestParam Integer predmetSoRedBr,@RequestParam Integer godina) {
//        String email =userDetails.getUsername();
//        return ResponseEntity.ok(predmetService.odgovorDobienaPosta(dobienaPostaRequest,email,predmetSoRedBr,godina));
//    }


//    @PreAuthorize("hasAnyRole('OSL','NACALNIK','ADMIN')")
//    @PutMapping("/{id}/status")
//    public Predmet updateStatusPredmet(@PathVariable Long id, @RequestBody StatusPredmetRequest request, Authentication authentication) {
//        return this.predmetService.updateStatusPredmet(id, request, authentication.getName());
//    }

//    @PreAuthorize("hasAnyRole('POMOSNIK','NACALNIK','ADMIN')")
//    @PostMapping("/ispratena")
//    public ResponseEntity<IspratenaPostaResponse> createIspratenaPosta(@RequestBody IspratenaPostaRequest request, @AuthenticationPrincipal UserDetails userDetails) {
//        String email =userDetails.getUsername();
//        return ResponseEntity.ok(predmetService.createIspratenaPosta(request,email));
//    }
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
            @PageableDefault(size = 50,sort = "datumZaveduvanje",direction = Sort.Direction.DESC)Pageable pageable,
            @RequestParam(required = false) Integer godina,
            @RequestParam(required = false) String redenBroj,
            @RequestParam(required = false) Long isprakjacId,
            @RequestParam(required = false) Long odgovornoLiceId,
            @RequestParam(required = false) Long vidPredmetDobienaId,
            @RequestParam(required = false) Long vidPredmetIspratenaId,
            @RequestParam(required = false) Boolean realizirano,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TipDelovnik tipDelovnik,
            @RequestParam(required = false) TipPosta tipPosta,
            @RequestParam(required = false) StatusPredmet statusPredmet,
            @RequestParam(required = false) Long arhivaId,
            @RequestParam(required = false) String datumZaveduvanje,
            @RequestParam(required = false) String brAktNivni,
            @RequestParam(required = false) String sodrzina,
            @RequestParam(required = false) String zabeleska
    ){
        return ResponseEntity.ok(predmetService.getAllPredmeti( pageable, godina, redenBroj, isprakjacId, odgovornoLiceId,
                vidPredmetDobienaId, vidPredmetIspratenaId, realizirano, search,
                tipDelovnik, tipPosta, statusPredmet,arhivaId,datumZaveduvanje,brAktNivni,sodrzina,zabeleska));
    }
    @GetMapping("/next-reden-broj")
    public ResponseEntity<Integer> getNextRedenBroj() {
        Integer godina = LocalDate.now().getYear();
        Integer next = predmetRepository.findMaxRedenBroj(godina) + 1;
        return ResponseEntity.ok(next);
    }
    @GetMapping("/getPostaByID")
    public ResponseEntity<PostaResponse> findById(@RequestParam Long id){
        return ResponseEntity.ok(predmetService.getPosta(id));
    }
}
