import { createContext, useContext, useReducer, useEffect } from "react";
import api from "../services/api";

const MoviesContext = createContext();

// Fallback image function
const getValidImageUrl = (url) => {
  if (!url || url.includes("via.placeholder.com")) {
    return "https://placehold.jp/24/333333/ffffff/300x170.png?text=No%20Image";
  }
  return url;
};

const initialState = {
  featured: null,
  categories: [],
  selectedMovie: null,
  modalOpen: false,
  loading: true,
  error: null,
  myList: JSON.parse(localStorage.getItem("nf_mylist") || "[]"),
  searchQuery: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, ...action.payload, loading: false, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "OPEN_MODAL":
      return { ...state, selectedMovie: action.payload, modalOpen: true };
    case "CLOSE_MODAL":
      return { ...state, selectedMovie: null, modalOpen: false };
    case "ADD_TO_LIST": {
      const exists = state.myList.some((m) => m.id === action.payload.id);
      if (exists) return state;
      const updated = [...state.myList, action.payload];
      localStorage.setItem("nf_mylist", JSON.stringify(updated));
      return { ...state, myList: updated };
    }
    case "REMOVE_FROM_LIST": {
      const updated = state.myList.filter((m) => m.id !== action.payload);
      localStorage.setItem("nf_mylist", JSON.stringify(updated));
      return { ...state, myList: updated };
    }
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

export function MoviesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchMovies = async () => {
    try {
      const res = await api.get("/api/movies");
      const data = Array.isArray(res.data) ? res.data : [];

      if (data.length === 0) {
        dispatch({ type: "SET_ERROR", payload: "No movies found in database" });
        return;
      }

      // 🔥 FIXED: Database se 'thumbnail_url' ya 'thumbnailUrl' dono check kar raha hai
      const cleanData = data
        .filter(m => m?.title)
        .map(movie => {
          const rawImg = movie.thumbnail_url || movie.thumbnailUrl;
          return {
            ...movie,
            thumbnailUrl: getValidImageUrl(rawImg),
            videoUrl: movie.video_url || movie.videoUrl || ""
          };
        })
        .slice(0, 50); 

      const featured = cleanData[0] || null;

      const grouped = cleanData.reduce((acc, movie) => {
        const key = movie?.category?.trim() || "Trending Now";
        if (!acc[key]) acc[key] = [];
        acc[key].push(movie);
        return acc;
      }, {});

      const categories = Object.keys(grouped).map((key) => ({
        id: key.toLowerCase().replace(/\s+/g, '-'),
        title: key,
        movies: grouped[key],
      }));

      dispatch({
        type: "SET_DATA",
        payload: { featured, categories },
      });

    } catch (err) {
      console.error("API Error:", err);
      dispatch({ type: "SET_ERROR", payload: "Backend is offline or database error" });
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      fetchMovies();
    } else {
      dispatch({ type: "SET_DATA", payload: { loading: false } });
    }
  }, []);

  return (
    <MoviesContext.Provider value={{ state, dispatch, refreshData: fetchMovies }}>
      {children}
    </MoviesContext.Provider>
  );
}

export const useMovies = () => useContext(MoviesContext);