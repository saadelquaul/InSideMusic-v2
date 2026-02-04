package com.InSideMusic.backend.config;

import com.InSideMusic.backend.entity.Category;
import com.InSideMusic.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    private static final List<String> DEFAULT_CATEGORIES = Arrays.asList(
            "Pop", "Rock", "Rap", "Jazz", "Classical", "Electronic", "RnB", "Other");

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            log.info("Seeding default categories...");

            DEFAULT_CATEGORIES.forEach(categoryName -> {
                Category category = Category.builder()
                        .name(categoryName.toLowerCase())
                        .description(categoryName + " music")
                        .build();
                categoryRepository.save(category);
            });

            log.info("Seeded {} default categories", DEFAULT_CATEGORIES.size());
        }
    }
}
