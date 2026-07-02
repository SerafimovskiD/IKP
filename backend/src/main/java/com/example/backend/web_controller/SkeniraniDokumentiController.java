package com.example.backend.web_controller;

import com.example.backend.model.SkeniraniDokumenti;
import com.example.backend.service.nomenclature.SkeniraniDokumentiService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/skenirani-dokumenti")
public class SkeniraniDokumentiController {
    private final SkeniraniDokumentiService skeniraniDokumentiService;

    public SkeniraniDokumentiController(SkeniraniDokumentiService skeniraniDokumentiService) {
        this.skeniraniDokumentiService = skeniraniDokumentiService;
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> previewDokument(@PathVariable Long id){
        SkeniraniDokumenti dokument = this.skeniraniDokumentiService.getDokument(id);
        Resource resource = this.skeniraniDokumentiService.loadDokument(id);
        String contentType = this.skeniraniDokumentiService.getContentType(dokument.getPateka());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + dokument.getImeFile() + "\""
                )
                .body(resource);
    }
}
