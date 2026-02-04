package com.InSideMusic.backend.repository;

import com.InSideMusic.backend.entity.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrackRepository extends JpaRepository<Track, UUID> {

    List<Track> findByCategoryId(UUID categoryId);

    List<Track> findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCase(String title, String artist);

    List<Track> findAllByOrderByDateAddedDesc();
}
