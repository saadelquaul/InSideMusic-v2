package com.InSideMusic.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

@Data
public class CategoryDTO {
    private UUID id;

    @NotBlank(message = "Category name is required")
    private String name;
    private String description;
}
