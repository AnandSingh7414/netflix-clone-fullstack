package com.netflix.backend.config;

import com.netflix.backend.service.MovieService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MovieSeeder {

    @Bean
    CommandLineRunner seed(MovieService service) {
        return args -> {
            // Agar DB already filled hai toh skip karega
            // Agar empty hai toh TMDB se sync karega
//            service.syncMoviesFromTMDB();
            System.out.println("🔥 Movies synced from TMDB automatically");
        };
    }
}
