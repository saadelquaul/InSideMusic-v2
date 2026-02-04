package com.InSideMusic.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
@Builder
public class TrackResponseDTO {
    private UUID id;
    private String title;
    private String artist;
    private String description;
    private Integer duration;
    private UUID categoryId;
    private String categoryName;
    private String audioUrl;
    private String coverUrl;
    private LocalDateTime dateAdded;
    private LocalDateTime updatedAt;
}
