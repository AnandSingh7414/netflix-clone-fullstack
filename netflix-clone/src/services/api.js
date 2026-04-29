import axios from "axios";

/**
 * 🔥 SMART URL LOGIC:
 * Agar aap apne computer par ho (Development), toh ye 8081 use karega.
 * Agar aap Vercel par live ho (Production), toh ye .env wali Railway link use karega.
 */
const BASE_URL = import.meta.env.MODE === 'development' 
  ? "http://localhost:8081" 
  : import.meta.env.VITE_API_BASE_URL;

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
export const signUp = (userData) => api.post("/api/auth/signup", userData); 

// Movies API
export const getMovies = () => api.get("/api/movies");
export const getMovieById = (id) => api.get(`/api/movies/${id}`);
export const addMovie = (movie) => api.post("/api/movies", movie);
export const deleteMovie = (id) => api.delete(`/api/movies/${id}`);

// Search API
export const searchMovies = (query) => api.get(`/api/movies/search?query=${query}`);

/**
 * IMAGE HELPER
 */
export const getImage = (movie) => {
  // Database se 'thumbnail_url' (underscore) ya Context se 'thumbnailUrl' (camelCase)
  const imgUrl = movie?.thumbnail_url || movie?.thumbnailUrl;
  
  if (!imgUrl || imgUrl.includes("via.placeholder.com")) {
    return "https://placehold.jp/24/333333/ffffff/300x170.png?text=No%20Image";
  }
  
  return imgUrl;
};

export default api;