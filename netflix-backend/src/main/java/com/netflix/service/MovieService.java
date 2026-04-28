package com.netflix.backend.service;

import com.netflix.backend.model.Movie;
import com.netflix.backend.repository.MovieRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository repository;
    private final RestTemplate restTemplate;

    public MovieService(MovieRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    private static final String TMDB_URL =
            "https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY&language=en-US&page=1";

    public List<Movie> getAllMovies() {
        // 🔥 FIX: Ab poora database uthane ke bajaye sirf top 100 movies aayengi
        return repository.findTop100By();
    }

    public Movie addMovie(Movie movie) {
        return repository.save(movie);
    }

    public void deleteMovie(Long id) {
        repository.deleteById(id);
    }

    public Movie updateMovie(Long id, Movie movie) {
        movie.setId(id);
        return repository.save(movie);
    }

    public List<Movie> searchMovies(String title) {
        return repository.findByTitleContainingIgnoreCase(title);
    }

    public List<Movie> getMoviesByCategory(String category) {
        return repository.findByCategoryIgnoreCase(category);
    }

    public List<Movie> fetchMoviesFromTMDB() {
        Map<String, Object> response = restTemplate.getForObject(TMDB_URL, Map.class);
        List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");

        return results.stream().map(r -> {
            Movie m = new Movie();
            m.setTitle((String) r.get("title"));
            m.setDescription((String) r.get("overview"));
            String releaseDate = (String) r.get("release_date");
            if (releaseDate != null && releaseDate.length() >= 4) {
                m.setReleaseYear(Integer.parseInt(releaseDate.substring(0, 4)));
            }
            m.setThumbnailUrl("https://image.tmdb.org/t/p/w500" + r.get("poster_path"));
            m.setRating(((Number) r.get("vote_average")).doubleValue());
            m.setCategory("Trending Now");
            return m;
        }).collect(Collectors.toList());
    }

    public void syncMoviesFromTMDB() {
        List<Movie> movies = fetchMoviesFromTMDB();
        repository.saveAll(movies);
    }
}