import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import MovieRow from '../components/MovieRow'
import Modal from '../components/Modal'
import styles from './CategoryPage.module.css'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE = 'https://api.themoviedb.org/3'

const fetchTV = (path, params = {}) => {
  // Agar API Key nahi hai, toh API call mat karo, sidha error do
  if (!API_KEY) return Promise.reject(new Error("API_KEY_MISSING"));
  return axios.get(`${BASE}${path}`, { params: { api_key: API_KEY, ...params } });
}

// 🔥 Naya function jo TMDB data ko tumhare app ke layak banayega
const formatData = (results) => {
  if (!results) return [];
  return results.map(item => ({
    ...item,
    // TV shows me 'title' ki jagah 'name' aata hai TMDB se, use theek kiya
    title: item.name || item.title, 
    // Agar TMDB se video url na mile, toh player crash hone se bachane ke liye default YouTube link daal diya
    videoUrl: "https://www.youtube.com/watch?v=GV3HUDMQ-F8", 
    thumbnailUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`
  }));
}

export default function TVShowsPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null) // Blank screen se bachne ke liye naya state

  useEffect(() => {
    // Check if key is completely missing
    if (!API_KEY) {
      setErrorMsg("TMDB API Key is missing in your .env file!");
      setLoading(false);
      return;
    }

    Promise.all([
      fetchTV('/tv/popular'),
      fetchTV('/tv/top_rated'),
      fetchTV('/tv/airing_today'),
      fetchTV('/discover/tv', { with_genres: 18 }),  // Drama
      fetchTV('/discover/tv', { with_genres: 35 }),  // Comedy
    ]).then(([popular, topRated, airing, drama, comedy]) => {
      setCategories([
        { id: 'popular', title: 'Popular TV Shows', movies: formatData(popular.data.results) },
        { id: 'toprated', title: 'Top Rated Series', movies: formatData(topRated.data.results) },
        { id: 'airing', title: 'Airing Today', movies: formatData(airing.data.results) },
        { id: 'drama', title: 'Drama Series', movies: formatData(drama.data.results) },
        { id: 'comedy', title: 'Comedy Shows', movies: formatData(comedy.data.results) },
      ])
      setLoading(false)
    }).catch((err) => {
      console.error(err);
      setErrorMsg("Failed to load TV Shows. Please check your internet or TMDB API Key.");
      setLoading(false)
    })
  }, [])

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>TV Shows</h1>
        
        {/* 🔥 Agar error hai toh ab Blank Screen nahi dikhegi, message aayega */}
        {errorMsg ? (
          <div style={{ textAlign: "center", marginTop: "100px", color: "white" }}>
            <h2 style={{ fontSize: "2rem", color: "#e50914" }}>Oops! ⚠️</h2>
            <p style={{ color: "#aaa", fontSize: "1.2rem", marginTop: "15px" }}>{errorMsg}</p>
          </div>
        ) : loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={`skeleton ${styles.skelTitle}`} />
              <div className={styles.skelCards}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className={`skeleton ${styles.skelCard}`} />
                ))}
              </div>
            </div>
          ))
        ) : (
          categories.map(cat => <MovieRow key={cat.id} category={cat} />)
        )}
      </div>
      <Modal />
    </div>
  )
}