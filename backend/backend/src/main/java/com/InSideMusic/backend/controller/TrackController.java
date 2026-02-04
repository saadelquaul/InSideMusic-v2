package com.InSideMusic.backend.controller;

import com.InSideMusic.backend.dto.request.TrackRequestDTO;
import com.InSideMusic.backend.dto.response.TrackResponseDTO;
import com.InSideMusic.backend.entity.Track;
import com.InSideMusic.backend.exception.ResourceNotFoundException;
import com.InSideMusic.backend.repository.TrackRepository;
import com.InSideMusic.backend.service.FileStorageService;
import com.InSideMusic.backend.service.TrackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackService trackService;
    private final TrackRepository trackRepository;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<TrackResponseDTO>> getAllTracks(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String search) {

        List<TrackResponseDTO> tracks;

        if (search != null && !search.isEmpty()) {
            tracks = trackService.searchTracks(search);
        } else if (categoryId != null) {
            tracks = trackService.getTracksByCategory(categoryId);
        } else {
            tracks = trackService.getAllTracks();
        }

        return ResponseEntity.ok(tracks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrackResponseDTO> getTrackById(@PathVariable UUID id) {
        return ResponseEntity.ok(trackService.getTrackById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TrackResponseDTO> createTrack(@Valid @ModelAttribute TrackRequestDTO request) {
        TrackResponseDTO created = trackService.createTrack(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TrackResponseDTO> updateTrack(
            @PathVariable UUID id,
            @Valid @ModelAttribute TrackRequestDTO request) {
        return ResponseEntity.ok(trackService.updateTrack(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrack(@PathVariable UUID id) {
        trackService.deleteTrack(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/audio")
    public ResponseEntity<Resource> getTrackAudio(@PathVariable UUID id) {
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track", "id", id));

        String audioFileName = track.getAudioFileName();
        if (audioFileName == null || audioFileName.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = fileStorageService.loadAudioFile(audioFileName);

        String contentType = "audio/mpeg";
        if (audioFileName.endsWith(".wav")) {
            contentType = "audio/wav";
        } else if (audioFileName.endsWith(".ogg")) {
            contentType = "audio/ogg";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + audioFileName + "\"")
                .body(resource);
    }
}
