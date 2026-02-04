package com.InSideMusic.backend.dto;

import lombok.Data;
import java.util.UUID;
import java.util.List;

@Data
public class AlbumDTO {
    private UUID id;
    private String title;
    private String artist;
    private String coverUrl;
    private List<UUID> trackIds;
}
