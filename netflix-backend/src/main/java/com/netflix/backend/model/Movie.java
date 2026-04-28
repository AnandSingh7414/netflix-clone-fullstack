package com.netflix.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private String thumbnailUrl;
    private String videoUrl;

    // --- NAYE FIELDS JO HUMNE ADD KIYE HAIN ---
    @Column(length = 1000)
    private String description;

    private Double rating;
    private Integer releaseYear;

    public Movie() {}

    // Updated Constructor
    public Movie(Long id, String title, String category, String thumbnailUrl, String videoUrl, String description, Double rating, Integer releaseYear) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.thumbnailUrl = thumbnailUrl;
        this.videoUrl = videoUrl;
        this.description = description;
        this.rating = rating;
        this.releaseYear = releaseYear;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    // --- NAYE GETTERS AND SETTERS ---
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }
}