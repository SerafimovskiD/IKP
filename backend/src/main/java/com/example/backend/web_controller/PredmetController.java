package com.example.backend.web_controller;

import java.util.UUID;

import com.example.backend.dto.*;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.PredmetRepository;
import com.example.backend.repository.SkeniraniDokumentiRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.nomenclature.SkeniraniDokumentiService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import com.example.backend.service.nomenclature.PredmetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/predmet")
public class PredmetController {
    private final PredmetService predmetService;
    private final PredmetRepository predmetRepository;
    private final SkeniraniDokumentiRepository skeniraniDokumentiRepository;
    private final UserRepository userRepository;
    public PredmetController(PredmetService predmetService, SkeniraniDokumentiService skeniraniDokumentiService, PredmetRepository predmetRepository, SkeniraniDokumentiRepository skeniraniDokumentiRepository, UserRepository userRepository) {
        this.predmetService = predmetService;
        this.predmetRepository = predmetRepository;
        this.skeniraniDokumentiRepository = skeniraniDokumentiRepository;
        this.userRepository = userRepository;
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
            @RequestParam(required = false) String roditelBrAkt,
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
                        roditelBrAkt,
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
//    public Predmet updateStatusPredmet(@PathVariable UUID id, @RequestBody StatusPredmetRequest request, Authentication authentication) {
//        return this.predmetService.updateStatusPredmet(id, request, authentication.getName());
//    }

//    @PreAuthorize("hasAnyRole('POMOSNIK','NACALNIK','ADMIN')")
//    @PostMapping("/ispratena")
//    public ResponseEntity<IspratenaPostaResponse> createIspratenaPosta(@RequestBody IspratenaPostaRequest request, @AuthenticationPrincipal UserDetails userDetails) {
//        String email =userDetails.getUsername();
//        return ResponseEntity.ok(predmetService.createIspratenaPosta(request,email));
//    }
//    @PostMapping("/{predmetId}/skenirani-dokumenti/upload")
//    public SkeniraniDokumentiResponse uploadSkeniraniDokumenti(@PathVariable UUID predmetId,
//                                                       @RequestParam("file") MultipartFile file,
//                                                       Authentication authentication) {
//        return this.skeniraniDokumentiService.uploadDokument(
//                predmetId,
//                file,
//                authentication.getName()
//        );
//    }
    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping
    public ResponseEntity<Page<PredmetListResponse>> getAllPredmeti(
            @ParameterObject
            @PageableDefault(size = 50,sort = "datumZaveduvanje",direction = Sort.Direction.DESC)Pageable pageable,
            @RequestParam(required = false) Integer godina,
            @RequestParam(required = false) String redenBroj,
            @RequestParam(required = false) String isprakjacIme,
            @RequestParam(required = false) UUID odgovornoLiceId,
            @RequestParam(required = false) UUID dodelenoNaId,
            @RequestParam(required = false) UUID vidPredmetDobienaId,
            @RequestParam(required = false) UUID vidPredmetIspratenaId,
            @RequestParam(required = false) Boolean realizirano,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TipDelovnik tipDelovnik,
            @RequestParam(required = false) TipPosta tipPosta,
            @RequestParam(required = false) StatusPredmet statusPredmet,
            @RequestParam(required = false) UUID arhivaId,
            @RequestParam(required = false) String datumZaveduvanje,
            @RequestParam(required = false) String brAktNivni,
            @RequestParam(required = false) String sodrzina,
            @RequestParam(required = false) String zabeleska,
            @RequestParam(required = false) String brAktArhivski,
            @RequestParam(required = false) String promenilKorisnik,
            @RequestParam(required = false) String imeDokument,
            @AuthenticationPrincipal UserDetails userDetails
    ){
        return ResponseEntity.ok(predmetService.getAllPredmeti(pageable, godina, redenBroj, isprakjacIme, odgovornoLiceId, dodelenoNaId,
                vidPredmetDobienaId, vidPredmetIspratenaId, realizirano, search,
                tipDelovnik, tipPosta, statusPredmet,arhivaId,datumZaveduvanje,brAktNivni,sodrzina,zabeleska,
                brAktArhivski,promenilKorisnik,
                orgCodeForFiltering(userDetails), imeDokument));
    }
    @GetMapping("/next-reden-broj")
    public ResponseEntity<Integer> getNextRedenBroj(@AuthenticationPrincipal UserDetails userDetails) {
        Integer godina = LocalDate.now().getYear();
        UserTable user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String brAkt = user.getOrganizaciskaEdinica() != null
                ? user.getOrganizaciskaEdinica().getCode() : null;
        Integer next = predmetRepository.findMaxRedenBrojByBrAktAndGodina(brAkt, godina) + 1;
        return ResponseEntity.ok(next);
    }

    // brAkt (code на орг. единицата) по кој се филтрира листата предмети.
    // null за ADMIN - тие гледаат сѐ.
    private String orgCodeForFiltering(UserDetails principal) {
        UserTable user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getUloga() == Role.ADMIN) return null;
        return user.getOrganizaciskaEdinica() != null
                ? user.getOrganizaciskaEdinica().getCode() : null;
    }
    @GetMapping("/getPostaByID")
    public ResponseEntity<PostaResponse> findById(@RequestParam UUID id){
        return ResponseEntity.ok(predmetService.getPosta(id));
    }

    @GetMapping("/prethodni")
    public ResponseEntity<List<PredmetListResponse>> getAllPredmeti(
            @RequestParam String brAkt,
            @RequestParam Integer redenBroj,
            @RequestParam Integer godina){
        return ResponseEntity.ok(predmetService.getPrethodniPredmeti(brAkt,redenBroj,godina));
    }


    @PostMapping("/{id}/dokumenti")
    public ResponseEntity<Void> uploadDokument(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        Predmet predmet = predmetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Predmet", id));

        UserTable user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SkeniraniDokumenti dok = new SkeniraniDokumenti();
        dok.setPredmet(predmet);
        dok.setImeFile(file.getOriginalFilename());
        dok.setTipFile(file.getContentType());
        dok.setGolemina(file.getSize());
        dok.setContent(file.getBytes());
        dok.setDatumUpload(LocalDateTime.now());
        dok.setUser(user);

        skeniraniDokumentiRepository.save(dok);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/dokumenti/{dokId}")
    public ResponseEntity<byte[]> downloadDokument(@PathVariable UUID dokId) {
        SkeniraniDokumenti dok = skeniraniDokumentiRepository.findById(dokId).orElseThrow();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + dok.getImeFile() + "\"")
                .contentType(MediaType.parseMediaType(dok.getTipFile()))
                .body(dok.getContent());
    }

    @DeleteMapping("/dokumenti/{dokId}")
    public ResponseEntity<Void> deleteDokument(@PathVariable UUID dokId) {
        if (!skeniraniDokumentiRepository.existsById(dokId)) {
            throw new ResourceNotFoundException("SkeniraniDokumenti", dokId);
        }
        skeniraniDokumentiRepository.deleteById(dokId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/dokumenti")
    public ResponseEntity<List<SkeniraniDokumentiResponse>> getDokumenti(@PathVariable UUID id) {
        return ResponseEntity.ok(skeniraniDokumentiRepository.findAllByPredmetId(id)
                .stream()
                .map(SkeniraniDokumentiResponse::from)
                .collect(Collectors.toList()));
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<PostaResponse> editPosta(
            @RequestBody PostaRequest request,
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam TipDelovnik tipDelovnik

    ) {
        return ResponseEntity.ok(
                predmetService.editPosta(request,
                        id,
                        userDetails.getUsername(),
                        tipDelovnik
                )
        );
    }
}
