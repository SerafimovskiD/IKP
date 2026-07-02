package com.example.backend.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String upload(MultipartFile file,Long predmetId);
}
