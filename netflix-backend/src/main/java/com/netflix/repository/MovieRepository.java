package com.netflix.backend.repository;

import com.netflix.backend.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    // 1. Title se movie search karne ke liye
    List<Movie> findByTitleContainingIgnoreCase(String title);

    // 2. Category se filter karne ke liye
    List<Movie> findByCategoryIgnoreCase(String category);

    // 3. Database se sirf top 100 movies laane ke liye (Taaki frontend freeze na ho)
    List<Movie> findTop100By();
}