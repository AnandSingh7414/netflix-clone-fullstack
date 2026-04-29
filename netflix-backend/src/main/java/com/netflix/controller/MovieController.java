package com.netflix.backend.controller;

import com.netflix.backend.model.Movie;
import com.netflix.backend.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
// 🔥 Yahan se purana @CrossOrigin hata diya hai kyunki Global Config ab handle karega
public class MovieController {

    private final MovieService service;

    public MovieController(MovieService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(service.getAllMovies());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMovies(@RequestParam String title) {
        return ResponseEntity.ok(service.searchMovies(title));
    }

    @GetMapping("/category/{name}")
    public ResponseEntity<List<Movie>> getByCategory(@PathVariable String name) {
        return ResponseEntity.ok(service.getMoviesByCategory(name));
    }

    @PostMapping
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie) {
        return ResponseEntity.ok(service.addMovie(movie));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        service.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie movie) {
        return ResponseEntity.ok(service.updateMovie(id, movie));
    }

    @PostMapping("/sync-tmdb")
    public ResponseEntity<String> syncMoviesFromTMDB() {
        service.syncMoviesFromTMDB();
        return ResponseEntity.ok("Movies synced successfully from TMDB!");
    }

    @GetMapping("/tmdb")
    public ResponseEntity<List<Movie>> fetchMoviesFromTMDB() {
        return ResponseEntity.ok(service.fetchMoviesFromTMDB());
    }
}