import { memo, useState, useRef } from "react";
import { useMovies } from "../context/MoviesContext";
import styles from "./MovieCard.module.css";

const MovieCard = memo(function MovieCard({ movie }) {
  const { dispatch } = useMovies();
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);

  // Title support (Movies + TV Shows)
  const title = movie?.title || movie?.name || movie?.original_name || "No Title";

  // Image fallback (Backend + TMDB + placeholder)
  const imgUrl =
    movie?.thumbnailUrl?.trim() ||
    (movie?.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/300x170");

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
          e.target.src = "https://via.placeholder.com/300x170";
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
            {/* Extra info from backend */}
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
