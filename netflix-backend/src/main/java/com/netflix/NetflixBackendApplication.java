package com.netflix.backend;

import com.netflix.backend.model.Movie;
import com.netflix.backend.repository.MovieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@SpringBootApplication
@ComponentScan(basePackages = {"com.netflix.backend"})
@EnableJpaRepositories(basePackages = {"com.netflix.backend.repository"})
@EntityScan(basePackages = {"com.netflix.backend.model"})
public class NetflixBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(NetflixBackendApplication.class, args);
	}

	// 🔥 GLOBAL CORS CONFIG: Ye blank screen aur credential errors ko hamesha ke liye khatam kar dega
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOriginPatterns("http://localhost:5173")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*")
						.allowCredentials(true)
						.maxAge(3600);
			}
		};
	}

	@Bean
	CommandLineRunner init(MovieRepository repo) {
		return args -> {
			if (repo.count() == 0) {
				repo.saveAll(List.of(
						new Movie(null, "Inception", "Sci-Fi",
								"https://image.tmdb.org/t/p/w500/edvSCZvWj09upQsy2Y6IwDhK8bt.jpg",
								"https://www.youtube.com/watch?v=YoHD9XEInc0",
								"A thief who steals corporate secrets through dream-sharing technology.",
								8.8, 2010),

						new Movie(null, "Interstellar", "Sci-Fi",
								"https://image.tmdb.org/t/p/w500/rAiYTfKqGdCRIIoo664sY9XZIv0.jpg",
								"https://www.youtube.com/watch?v=zSWdZVtXT7E",
								"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
								8.6, 2014)
				));
				System.out.println("🔥 Movies seeded in database!");
			}
		};
	}
}