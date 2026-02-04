package com.InSideMusic.backend.service;

import com.InSideMusic.backend.dto.request.TrackRequestDTO;
import com.InSideMusic.backend.dto.response.TrackResponseDTO;
import com.InSideMusic.backend.entity.Category;
import com.InSideMusic.backend.entity.Track;
import com.InSideMusic.backend.exception.ResourceNotFoundException;
import com.InSideMusic.backend.repository.CategoryRepository;
import com.InSideMusic.backend.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackService {

    private final TrackRepository trackRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public List<TrackResponseDTO> getAllTracks() {
        return trackRepository.findAllByOrderByDateAddedDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TrackResponseDTO getTrackById(UUID id) {
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track", "id", id));
        return mapToDTO(track);
    }

    @Transactional(readOnly = true)
    public List<TrackResponseDTO> getTracksByCategory(UUID categoryId) {
        return trackRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TrackResponseDTO> searchTracks(String query) {
        return trackRepository.findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCase(query, query)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TrackResponseDTO createTrack(TrackRequestDTO request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        String audioFileName = fileStorageService.storeAudioFile(request.getAudioFile());

        Track track = Track.builder()
                .title(request.getTitle())
                .artist(request.getArtist())
                .description(request.getDescription())
                .duration(0) // Will be set by frontend or calculated
                .audioFileName(audioFileName)
                .category(category)
                .build();

        Track savedTrack = trackRepository.save(track);
        return mapToDTO(savedTrack);
    }

    @Transactional
    public TrackResponseDTO updateTrack(UUID id, TrackRequestDTO request) {
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track", "id", id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        track.setTitle(request.getTitle());
        track.setArtist(request.getArtist());
        track.setDescription(request.getDescription());
        track.setCategory(category);

        if (request.getAudioFile() != null && !request.getAudioFile().isEmpty()) {
            fileStorageService.deleteAudioFile(track.getAudioFileName());
            String newAudioFileName = fileStorageService.storeAudioFile(request.getAudioFile());
            track.setAudioFileName(newAudioFileName);
        }

        Track updatedTrack = trackRepository.save(track);
        return mapToDTO(updatedTrack);
    }

    @Transactional
    public void deleteTrack(UUID id) {
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track", "id", id));

        fileStorageService.deleteAudioFile(track.getAudioFileName());
        trackRepository.delete(track);
    }

    private TrackResponseDTO mapToDTO(Track track) {
        String audioUrl = track.getAudioFileName() != null
                ? ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/tracks/")
                        .path(track.getId().toString())
                        .path("/audio")
                        .toUriString()
                : null;

        return TrackResponseDTO.builder()
                .id(track.getId())
                .title(track.getTitle())
                .artist(track.getArtist())
                .description(track.getDescription())
                .duration(track.getDuration())
                .categoryId(track.getCategory().getId())
                .categoryName(track.getCategory().getName())
                .audioUrl(audioUrl)
                .dateAdded(track.getDateAdded())
                .updatedAt(track.getUpdatedAt())
                .build();
    }
}
