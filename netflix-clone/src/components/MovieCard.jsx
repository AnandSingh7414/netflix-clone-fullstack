import { memo, useState, useRef } from "react";
import { useMovies } from "../context/MoviesContext";
import styles from "./MovieCard.module.css";

const MovieCard = memo(function MovieCard({ movie }) {
  const { dispatch } = useMovies();
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);

  // Safe Fallback Image
  const FALLBACK_IMAGE = "https://placehold.jp/24/333333/ffffff/300x170.png?text=No%20Image";

  // Title Logic
  const title = movie?.title || movie?.name || "No Title";

  /**
   * 🔥 IMAGE LOGIC FIX:
   * Database mein 'thumbnail_url' hai, Context 'thumbnailUrl' bana raha hai.
   * Hum dono ko check karenge + TMDB fallback.
   */
  const getImgUrl = () => {
    const rawUrl = movie?.thumbnail_url || movie?.thumbnailUrl;

    if (rawUrl && rawUrl.startsWith('http') && !rawUrl.includes("via.placeholder.com")) {
      return rawUrl;
    }
    
    if (movie?.poster_path) {
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }

    return FALLBACK_IMAGE;
  };

  const imgUrl = getImgUrl();

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setHovered(true), 200);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setHovered(false);
  };

  const handleClick = () => {
    dispatch({ type: "OPEN_MODAL", payload: movie });
  };

  const handleAddToList = (e) => {
    e.stopPropagation();
    dispatch({ type: "ADD_TO_LIST", payload: movie });
  };

  return (
    <div
      className={styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <img
        src={imgUrl}
        alt={title}
        loading="lazy"
        className={styles.poster}
        onError={(e) => {
          if (e.target.src !== FALLBACK_IMAGE) {
            e.target.src = FALLBACK_IMAGE;
          }
        }}
      />

      {hovered && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <div className={styles.overlayActions}>
              <button className={styles.playBtn}>▶</button>
              <button className={styles.actionBtn} onClick={handleAddToList}>＋</button>
              <button className={styles.actionBtn}>👍</button>
              <button className={styles.expandBtn} onClick={handleClick}>⌄</button>
            </div>

            <p className={styles.overlayTitle}>{title}</p>
            {(movie?.releaseYear || movie?.release_year) && (
              <p className={styles.overlayInfo}>Year: {movie.releaseYear || movie.release_year}</p>
            )}
            {movie?.rating && (
              <p className={styles.overlayInfo}>⭐ {movie.rating}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default MovieCard;