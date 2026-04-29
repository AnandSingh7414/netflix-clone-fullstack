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

// Movies API - Agar /api/movies nahi chal raha toh sirf /movies try kar rahe hain
export const getMovies = () => api.get("/api/movies").catch(() => api.get("/movies"));
export const getMovieById = (id) => api.get(`/api/movies/${id}`).catch(() => api.get(`/movies/${id}`));
export const addMovie = (movie) => api.post("/api/movies", movie);
export const deleteMovie = (id) => api.delete(`/api/movies/${id}`);

/**
 * IMAGE HELPER
 */
export const getImage = (movie) => {
  // Check for both underscore and camelCase formats to be safe
  const imgUrl = movie.thumbnailUrl || movie.thumbnail_url;
  if (!imgUrl) {
    return "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=500";
  }
  return imgUrl;
};

export default api;