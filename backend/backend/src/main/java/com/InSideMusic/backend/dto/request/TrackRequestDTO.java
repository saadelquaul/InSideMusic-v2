package com.InSideMusic.backend.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

@Data
public class TrackRequestDTO {
    @NotBlank(message = "Title is required")
    @Size(max = 50, message = "Title must not exceed 50 characters")
    private String title;

    @NotBlank(message = "Artist is required")
    private String artist;

    @Size(max = 200, message = "Description must not exceed 200 characters")
    private String description;

    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    @NotNull(message = "Audio file is required")
    private MultipartFile audioFile;

    private MultipartFile coverImage;
}
