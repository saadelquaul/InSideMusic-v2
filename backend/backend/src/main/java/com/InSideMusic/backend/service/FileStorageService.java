package com.InSideMusic.backend.service;

import com.InSideMusic.backend.exception.FileStorageException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.file.audio-dir:./uploads/audio}")
    private String audioDir;

    private Path audioStoragePath;

    private static final List<String> ALLOWED_AUDIO_TYPES = Arrays.asList(
            "audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/x-wav");

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    @PostConstruct
    public void init() {
        try {
            audioStoragePath = Paths.get(audioDir).toAbsolutePath().normalize();
            Files.createDirectories(audioStoragePath);
        } catch (IOException e) {
            throw new FileStorageException("Could not create upload directories", e);
        }
    }

    public String storeAudioFile(MultipartFile file) {
        validateAudioFile(file);
        return storeFile(file, audioStoragePath);
    }

    public Resource loadAudioFile(String fileName) {
        return loadFile(fileName, audioStoragePath);
    }

    public void deleteAudioFile(String fileName) {
        deleteFile(fileName, audioStoragePath);
    }

    private void validateAudioFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileStorageException("Cannot store empty file");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileStorageException("File size exceeds maximum limit of 10MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_AUDIO_TYPES.contains(contentType.toLowerCase())) {
            throw new FileStorageException("Invalid file type. Allowed types: MP3, WAV, OGG");
        }
    }

    private String storeFile(MultipartFile file, Path storagePath) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename);
        String newFileName = UUID.randomUUID().toString() + extension;

        try {
            if (newFileName.contains("..")) {
                throw new FileStorageException("Invalid file path: " + newFileName);
            }

            Path targetLocation = storagePath.resolve(newFileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            return newFileName;
        } catch (IOException e) {
            throw new FileStorageException("Failed to store file: " + originalFilename, e);
        }
    }

    private Resource loadFile(String fileName, Path storagePath) {
        try {
            Path filePath = storagePath.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new FileStorageException("File not found: " + fileName);
            }
        } catch (MalformedURLException e) {
            throw new FileStorageException("File not found: " + fileName, e);
        }
    }

    private void deleteFile(String fileName, Path storagePath) {
        if (fileName == null || fileName.isEmpty()) {
            return;
        }

        try {
            Path filePath = storagePath.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Failed to delete file: " + fileName, e);
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
}
