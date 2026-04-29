import axios from "axios";

const BASE_URL = "https://netflix-clone-fullstack-production.up.railway.app";

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
  const imgUrl = movie?.thumbnailUrl || movie?.thumbnail_url;
  
  // 🔥 Logic: Agar image missing hai YA via.placeholder hai, toh stable image load karo
  if (!imgUrl || imgUrl.includes("via.placeholder.com")) {
    return "https://placehold.jp/24/333333/ffffff/300x170.png?text=No%20Image";
  }
  
  return imgUrl;
};

export default api;