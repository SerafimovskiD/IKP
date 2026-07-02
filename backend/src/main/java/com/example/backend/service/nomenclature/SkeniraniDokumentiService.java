package com.example.backend.service.nomenclature;

import com.example.backend.exceptions.BadRequestException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.Predmet;
import com.example.backend.model.SkeniraniDokumenti;
import com.example.backend.model.UserTable;
import com.example.backend.repository.PredmetRepository;
import com.example.backend.repository.SkeniraniDokumentiRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.storage.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.example.backend.dto.SkeniraniDokumentiResponse;

import java.time.LocalDateTime;

@Service
public class SkeniraniDokumentiService {
    private final SkeniraniDokumentiRepository skeniraniDokumentiRepository;
    private final PredmetRepository predmetRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public SkeniraniDokumentiService(SkeniraniDokumentiRepository skeniraniDokumentiRepository, PredmetRepository predmetRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.skeniraniDokumentiRepository = skeniraniDokumentiRepository;
        this.predmetRepository = predmetRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public SkeniraniDokumentiResponse uploadDokument(Long predmetId, MultipartFile file, String username){
        Predmet predmet = this.predmetRepository.findById(predmetId)
                .orElseThrow(() -> new ResourceNotFoundException("Предмет",predmetId));
        UserTable user = this.userRepository.findByEmail(username)
                .orElseThrow(() -> new BadRequestException("Најавениот корисник не е пронајден"));
        String pateka = this.fileStorageService.upload(file,predmetId);
        SkeniraniDokumenti dokument = new SkeniraniDokumenti();
        dokument.setPredmet(predmet);
        dokument.setImeFile(file.getOriginalFilename());
        dokument.setPateka(pateka);
        dokument.setDatumUpload(LocalDateTime.now());
        dokument.setUser(user);

        SkeniraniDokumenti savedDokument = this.skeniraniDokumentiRepository.save(dokument);
        SkeniraniDokumentiResponse response = new SkeniraniDokumentiResponse();
        response.setId(savedDokument.getId());
        response.setPredmetId(savedDokument.getPredmet().getId());
        response.setImeFile(savedDokument.getImeFile());
        response.setPateka(savedDokument.getPateka());
        response.setDatumUpload(savedDokument.getDatumUpload());
        response.setUserId(savedDokument.getUser().getId());
        response.setUploadedBy(savedDokument.getUser().getEmail());
        return response;
    }
}
