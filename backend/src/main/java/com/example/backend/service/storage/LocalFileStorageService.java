package com.example.backend.service.storage;

import com.example.backend.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public String upload(MultipartFile file, UUID predmetId) {
        try {
            if (file == null || file.isEmpty()) {
                throw new BadRequestException("Фајлот е задолжителен");
            }

            String originalFilename = file.getOriginalFilename();

            if (originalFilename == null || originalFilename.isBlank()) {
                originalFilename = "document";
            }

            String safeFilename = sanitizeFilename(originalFilename);

            String fileName = UUID.randomUUID() + "-" + safeFilename;

            String folderName = predmetId + "-" + LocalDate.now().getYear();

            String relativePath = Paths.get(
                    "predmeti",
                    folderName,
                    fileName
            ).toString();

            Path targetPath = Paths.get(uploadDir)
                    .resolve(relativePath)
                    .normalize();

            Files.createDirectories(targetPath.getParent());

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return relativePath.replace("\\", "/");

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Грешка при зачувување на фајл: " + e.getMessage());
        }
    }

    @Override
    public Resource loadAsResource(String pateka) {
        try {
            Path basePath = Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();

            Path filePath = basePath
                    .resolve(pateka)
                    .normalize();

            if (!filePath.startsWith(basePath)) {
                throw new BadRequestException("Невалидна патека до фајл");
            }
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new BadRequestException("Фајлот не постои или не може да се прочита");
            }
            return resource;
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Грешка при вчитување на фајл: " + e.getMessage());

        }
    }
    @Override

    public String getContentType(String pateka) {
        try{
            Path basePath = Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();

            Path filePath = basePath
                    .resolve(pateka)
                    .normalize();

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                return "application/octet-stream";
            }
            return contentType;
        } catch (Exception e){
            return "application/octet-stream";
        }
    }

    private String sanitizeFilename(String filename) {
        String normalized = Normalizer.normalize(filename, Normalizer.Form.NFD);

        return normalized
                .replaceAll("[^a-zA-Z0-9._-]", "_")
                .replaceAll("_+", "_");
    }
}