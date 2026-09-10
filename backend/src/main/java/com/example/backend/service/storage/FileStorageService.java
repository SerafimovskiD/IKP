package com.example.backend.service.storage;

import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String upload(MultipartFile file,UUID predmetId);
    Resource loadAsResource(String pateka);
    String getContentType(String pateka);
}
