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
import org.springframework.core.io.Resource;

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
}
