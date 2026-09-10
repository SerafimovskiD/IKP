package com.example.backend.web_controller;

import java.util.UUID;

import com.example.backend.dto.SkeniraniDokumentiResponse;
import com.example.backend.model.Predmet;
import com.example.backend.model.SkeniraniDokumenti;
import com.example.backend.repository.PredmetRepository;
import com.example.backend.repository.SkeniraniDokumentiRepository;
import com.example.backend.service.nomenclature.SkeniraniDokumentiService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/skenirani-dokumenti")
public class SkeniraniDokumentiController {
//    private final SkeniraniDokumentiService skeniraniDokumentiService;
//
//    public SkeniraniDokumentiController(SkeniraniDokumentiService skeniraniDokumentiService) {
//        this.skeniraniDokumentiService = skeniraniDokumentiService;
//    }
//
//    @GetMapping("/{id}/preview")
//    public ResponseEntity<Resource> previewDokument(@PathVariable UUID id){
//        SkeniraniDokumenti dokument = this.skeniraniDokumentiService.getDokument(id);
//        Resource resource = this.skeniraniDokumentiService.loadDokument(id);
//        String contentType = this.skeniraniDokumentiService.getContentType(dokument.getPateka());
//
//        return ResponseEntity.ok()
//                .contentType(MediaType.parseMediaType(contentType))
//                .header(
//                        HttpHeaders.CONTENT_DISPOSITION,
//                        "inline; filename=\"" + dokument.getImeFile() + "\""
//                )
//                .body(resource);
//    }
    private final PredmetRepository predmetRepository;
    private final SkeniraniDokumentiRepository skeniraniDokumentiRepository;
    public SkeniraniDokumentiController(PredmetRepository predmetRepository, SkeniraniDokumentiRepository skeniraniDokumentiRepository) {
        this.predmetRepository = predmetRepository;
        this.skeniraniDokumentiRepository = skeniraniDokumentiRepository;
    }

    @PostMapping("/{id}/dokumenti")
    public ResponseEntity<Void> uploadDokument(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) throws IOException {

        SkeniraniDokumenti dok = new SkeniraniDokumenti();
        dok.setImeFile(file.getOriginalFilename());
        dok.setTipFile(file.getContentType());
        dok.setContent(file.getBytes());
        dok.setPredmet(predmetRepository.findById(id).orElseThrow());

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

    @GetMapping("/{id}/dokumenti")
    public ResponseEntity<List<SkeniraniDokumentiResponse>> getDokumenti(@PathVariable UUID id) {
        return ResponseEntity.ok(skeniraniDokumentiRepository.findAllByPredmetId(id)
                .stream()
                .map(SkeniraniDokumentiResponse::from)
                .collect(Collectors.toList()));
    }
}
