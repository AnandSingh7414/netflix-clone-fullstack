import axios from "axios";

const BASE_URL = "http://localhost:8081";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Connection Error:", error.message);
    return Promise.reject(error);
  }
);

/* ================= EXPORTS ================= */

// Auth API
export const signIn = (userData) => api.post("/api/auth/signin", userData);
export const signUp = (userData) => api.post("/api/auth/signup", userData); // 🔥 Naya SignUp export

// Movies API
export const getMovies = () => api.get("/movies");
export const getMovieById = (id) => api.get(`/movies/${id}`);
export const addMovie = (movie) => api.post("/movies", movie);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);
export const updateMovie = (id, movie) => api.put(`/movies/${id}`, movie);
export const searchMovies = (query) => api.get(`/movies/search?title=${query}`);
export const getMoviesByCategory = (category) => api.get(`/movies/category/${category}`);

/**
 * IMAGE HELPER
 */
export const getImage = (movie) => {
  if (!movie || !movie.thumbnailUrl) {
    return "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=500";
  }
  return movie.thumbnailUrl;
};

export default api;