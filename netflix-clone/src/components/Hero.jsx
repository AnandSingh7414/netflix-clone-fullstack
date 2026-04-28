import { useEffect } from "react";
import { useMovies } from "../context/MoviesContext";
import styles from "./Hero.module.css";

export default function Hero() {
  const { state, dispatch } = useMovies();
  const { featured } = state;

  useEffect(() => {
    // fallback featured auto set (if null)
    if (!featured && state.movies?.length > 0) {
      dispatch({
        type: "SET_FEATURED",
        payload: state.movies[0],
      });
    }
  }, [featured, state.movies, dispatch]);

  if (!featured) return null;

  const title = featured.title || featured.name;
  const backdrop =
    featured.thumbnailUrl ||
    "https://image.tmdb.org/t/p/original/9PK4x8H2RkE6Q0rZ8cQzQxQ0Q.jpg";

  const handlePlay = () => {
    dispatch({
      type: "OPEN_MODAL",
      payload: featured,
    });
  };

  const handleInfo = () => {
    dispatch({
      type: "OPEN_MODAL",
      payload: featured,
    });
  };

  return (
    <div
      className={styles.hero}
      style={{
        backgroundImage: `url(${backdrop})`,
      }}
    >
      <div
        className={styles.overlay}
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.7), #111)",
        }}
      />

      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>

        <p className={styles.description}>
          {featured.overview || "No description available."}
        </p>

        <div className={styles.buttons}>
          <button className={styles.playBtn} onClick={handlePlay}>
            ▶ Play
          </button>

          <button className={styles.infoBtn} onClick={handleInfo}>
            ⓘ More Info
          </button>
        </div>
      </div>
    </div>
  );
}