import React, { useEffect, useState } from "react";
import { 
  getMovies, 
  addMovie as apiAddMovie, 
  deleteMovie as apiDeleteMovie, 
  getImage 
} from "../services/api";
import axios from "axios"; // Sync function ke liye

function Admin() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [form, setForm] = useState({ 
    title: "", 
    category: "", 
    thumbnailUrl: "", 
    videoUrl: "", 
    description: "", 
    rating: "", 
    releaseYear: "" 
  });

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await getMovies();
      setMovies(res.data || []);
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post("http://localhost:8081/movies/sync-tmdb");
      alert("🔥 Database synced with TMDB successfully!");
      fetchMovies();
    } catch (err) {
      alert("Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await apiAddMovie(form);
      setForm({ title: "", category: "", thumbnailUrl: "", videoUrl: "", description: "", rating: "", releaseYear: "" });
      fetchMovies();
      alert("✅ Movie added!");
    } catch (err) {
      alert("Error adding movie.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await apiDeleteMovie(id);
        fetchMovies(); // Delete hone ke baad list turant refresh hogi
      } catch(err) {
        alert("Error deleting movie.");
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar / Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>NETFLIX <span style={styles.badge}>ADMIN</span></h1>
          <p style={styles.subtitle}>Manage your movie library and database</p>
        </div>
        <button 
          onClick={handleSync} 
          disabled={syncing}
          style={{...styles.syncBtn, opacity: syncing ? 0.6 : 1}}
        >
          {syncing ? "Syncing..." : "🔄 Sync with TMDB"}
        </button>
      </div>

      <div style={styles.contentLayout}>
        {/* Left: Form Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Upload New Content</h3>
          <form onSubmit={handleAddMovie} style={styles.form}>
            <input style={styles.input} placeholder="Movie Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <div style={styles.row}>
              <input style={styles.input} placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
              <input style={styles.input} type="number" placeholder="Year" value={form.releaseYear} onChange={e => setForm({...form, releaseYear: e.target.value})} />
            </div>
            <textarea style={{...styles.input, minHeight: "80px"}} placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <input style={styles.input} placeholder="Thumbnail Image URL" value={form.thumbnailUrl} onChange={e => setForm({...form, thumbnailUrl: e.target.value})} required />
            <input style={styles.input} placeholder="Video URL (YouTube/MP4)" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} required />
            <button type="submit" style={styles.submitBtn}>Publish Movie</button>
          </form>
        </div>

        {/* Right: Statistics/Stats */}
        <div style={styles.statsRow}>
             <div style={styles.statCard}><h3>{movies.length}</h3><p>Total Movies</p></div>
             <div style={styles.statCard}><h3>{Array.from(new Set(movies.map(m => m.category))).length}</h3><p>Categories</p></div>
        </div>
      </div>

      {/* Bottom: Movie Table/Grid */}
      <div style={{...styles.card, marginTop: "30px"}}>
        <h3 style={styles.cardTitle}>Library Manager</h3>
        {loading ? <div style={styles.loader}>Loading Movies...</div> : (
          <div style={styles.grid}>
            {movies.map(movie => (
              <div key={movie.id} style={styles.movieItem}>
                <div style={styles.imageWrapper}>
                  <img src={getImage(movie)} alt={movie.title} style={styles.movieThumb} />
                  
                  {/* Fixed Delete Button Position */}
                  <div style={styles.deleteButtonContainer}>
                    <button onClick={() => handleDelete(movie.id)} style={styles.deleteIcon} title="Delete Movie">
                      🗑️
                    </button>
                  </div>

                </div>
                <div style={styles.movieInfo}>
                  <h4 style={styles.movieTitle}>{movie.title}</h4>
                  <p style={styles.movieCat}>{movie.category} • {movie.releaseYear || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- STYLES OBJECT ---
const styles = {
  container: {
    padding: "100px 5% 50px",
    background: "#000",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    borderLeft: "5px solid #e50914",
    paddingLeft: "20px"
  },
  title: { fontSize: "2rem", margin: 0, fontWeight: "900", letterSpacing: "1px" },
  badge: { background: "#e50914", padding: "2px 8px", fontSize: "0.8rem", borderRadius: "4px", verticalAlign: "middle" },
  subtitle: { color: "#aaa", margin: "5px 0 0 0" },
  syncBtn: {
    background: "transparent",
    color: "#fff",
    border: "1px solid #444",
    padding: "10px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s"
  },
  contentLayout: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px" },
  card: {
    background: "#181818",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  },
  cardTitle: { marginTop: 0, marginBottom: "20px", fontSize: "1.2rem", color: "#efefef" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "12px",
    background: "#252525",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: "6px",
    outline: "none"
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  submitBtn: {
    padding: "14px",
    background: "#e50914",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem"
  },
  statsRow: { display: "flex", flexDirection: "column", gap: "20px" },
  statCard: {
    background: "linear-gradient(145deg, #1e1e1e, #141414)",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #222"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "20px"
  },
  movieItem: {
    background: "#222",
    borderRadius: "8px",
    overflow: "hidden",
    position: "relative",
  },
  imageWrapper: { position: "relative", height: "120px" },
  movieThumb: { width: "100%", height: "100%", objectFit: "cover" },
  
  /* FIXED STYLES FOR DELETE BUTTON */
  deleteButtonContainer: {
    position: "absolute",
    top: "8px",
    right: "8px",
    zIndex: 10
  },
  deleteIcon: { 
    background: "rgba(229, 9, 20, 0.9)", // Netflix red with slight transparency
    border: "1px solid white", 
    padding: "6px 8px", 
    borderRadius: "6px", 
    cursor: "pointer",
    fontSize: "1rem",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.6)"
  },
  
  movieInfo: { padding: "10px" },
  movieTitle: { margin: "0 0 5px 0", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  movieCat: { margin: 0, fontSize: "0.75rem", color: "#888" },
  loader: { height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }
};

export default Admin;