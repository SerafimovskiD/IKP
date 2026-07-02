package com.example.backend.service.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String upload(MultipartFile file,Long predmetId);
    Resource loadAsResource(String pateka);
    String getContentType(String pateka);
}
