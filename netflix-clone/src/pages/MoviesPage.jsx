import { useEffect, useState } from "react";
import { getMovies } from "../services/api";
import Navbar from "../components/Navbar";
import MovieRow from "../components/MovieRow";
import Modal from "../components/Modal";
import styles from "./CategoryPage.module.css";

export default function MoviesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getMovies();
        const data = Array.isArray(res.data) ? res.data : [];

        // Clean movies: only those with required fields
        const clean = data.filter(
          (m) => m?.title && m?.thumbnailUrl && m?.videoUrl
        );

        // Group by category
        const grouped = clean.reduce((acc, movie) => {
          const key = movie?.category?.trim() || "Other";
          if (!acc[key]) acc[key] = [];
          acc[key].push(movie);
          return acc;
        }, {});

        // Format for MovieRow
        const formatted = Object.keys(grouped).map((key) => ({
          id: key.toLowerCase(),
          title: key + " Movies",
          movies: grouped[key],
        }));

        setCategories(formatted);
      } catch (err) {
        console.error("Error loading movies:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.content}>
        <h1 className={styles.pageTitle}>Movies</h1>

        {loading ? (
          <h3 style={{ color: "#fff" }}>Loading...</h3>
        ) : categories.length === 0 ? (
          <h3 style={{ color: "#fff" }}>No Movies Found</h3>
        ) : (
          categories.map((cat) => (
            <MovieRow key={cat.id} category={cat} />
          ))
        )}
      </div>

      <Modal />
    </div>
  );
}
