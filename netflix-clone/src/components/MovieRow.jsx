import { useRef, useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import styles from "./MovieRow.module.css";

export default function MovieRow({ category }) {
  const { title, movies = [] } = category;
  const rowRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const scroll = (direction) => {
    const row = rowRef.current;
    if (!row) return;
    const amount = row.offsetWidth * 0.8;
    row.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const row = rowRef.current;
    if (!row) return;
    setShowLeft(row.scrollLeft > 5);
    setShowRight(row.scrollLeft < (row.scrollWidth - row.clientWidth - 5));
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [movies]);

  if (!movies.length) return null;

  return (
    <div className={styles.row}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.carouselWrap}>
        {showLeft && (
          <button className={`${styles.arrow} ${styles.left}`} onClick={() => scroll("left")}>
            ‹
          </button>
        )}
        <div className={styles.cards} ref={rowRef} onScroll={handleScroll}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {showRight && (
          <button className={`${styles.arrow} ${styles.right}`} onClick={() => scroll("right")}>
            ›
          </button>
        )}
      </div>
    </div>
  );
}