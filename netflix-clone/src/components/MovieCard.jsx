import { memo, useState, useRef } from "react";
import { useMovies } from "../context/MoviesContext";
import styles from "./MovieCard.module.css";

const MovieCard = memo(function MovieCard({ movie }) {
  const { dispatch } = useMovies();
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);

  // Fallback Image Constant
  const FALLBACK_IMAGE = "https://placehold.jp/24/333333/ffffff/300x170.png?text=No%20Image";

  // Title support
  const title = movie?.title || movie?.name || movie?.original_name || "No Title";

  /**
   * 🔥 FIXED IMAGE LOGIC:
   * 1. Check 'thumbnail_url' (Database column name)
   * 2. Check 'thumbnailUrl' (Frontend backup)
   * 3. Check 'poster_path' (TMDB backup)
   */
  let imgUrl = FALLBACK_IMAGE;
  
  // Database se aane wala asli path 'thumbnail_url' hota hai
  const dbImage = movie?.thumbnail_url || movie?.thumbnailUrl;

  if (dbImage && !dbImage.includes("via.placeholder.com")) {
    imgUrl = dbImage;
  } else if (movie?.poster_path) {
    imgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  }

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setHovered(true), 200);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setHovered(false);
  };

  const handleClick = () => {
    dispatch({
      type: "OPEN_MODAL",
      payload: movie,
    });
  };

  const handleAddToList = (e) => {
    e.stopPropagation();
    dispatch({
      type: "ADD_TO_LIST",
      payload: movie,
    });
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
              <button
                className={styles.actionBtn}
                onClick={handleAddToList}
              >
                ＋
              </button>
              <button className={styles.actionBtn}>👍</button>
              <button className={styles.expandBtn} onClick={handleClick}>
                ⌄
              </button>
            </div>

            <p className={styles.overlayTitle}>{title}</p>
            {movie?.releaseYear && (
              <p className={styles.overlayInfo}>Year: {movie.releaseYear}</p>
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