import { useEffect, useState } from "react";
import { useMovies } from "../context/MoviesContext";
import { getImage } from "../services/api";
import styles from "./Modal.module.css";

export default function Modal() {
  const { state, dispatch } = useMovies();
  const { selectedMovie, modalOpen, myList } = state;
  
  // 🎥 Video play karne ke liye state
  const [isPlaying, setIsPlaying] = useState(false);

  const isInList = myList?.some((m) => m.id === selectedMovie?.id);

  // Modal band hone par video stop karne ke liye
  useEffect(() => {
    if (!modalOpen) setIsPlaying(false);
  }, [modalOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") dispatch({ type: "CLOSE_MODAL" });
    };

    if (modalOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [modalOpen, dispatch]);

  if (!modalOpen || !selectedMovie) return null;

  // 🛠️ UPDATED: Powerful Regex to extract YouTube ID accurately
  const getEmbedUrl = (url) => {
    if (!url) return "";
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (!videoId) return "";
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&mute=0`;
  };

  const handleMyList = () => {
    if (isInList) {
      dispatch({ type: "REMOVE_FROM_LIST", payload: selectedMovie.id });
    } else {
      dispatch({ type: "ADD_TO_LIST", payload: selectedMovie });
    }
  };

  return (
    <div className={styles.overlay} onClick={() => dispatch({ type: "CLOSE_MODAL" })}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={() => dispatch({ type: "CLOSE_MODAL" })}>
          ✕
        </button>

        <div className={styles.mediaTop}>
          {isPlaying ? (
            // 📺 Updated YouTube Player with more permissions
            <iframe
              className={styles.videoPlayer}
              src={getEmbedUrl(selectedMovie.videoUrl)}
              title={selectedMovie.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            // 🖼️ Poster (Default)
            <>
              <img
                src={getImage(selectedMovie)}
                alt={selectedMovie.title}
                className={styles.backdropImg}
              />
              <div className={styles.mediaGradient} />
            </>
          )}

          <div className={styles.mediaTitle}>
            {!isPlaying && <h2>{selectedMovie.title}</h2>}
            <div className={styles.metaRow}>
              <button 
                className={styles.playBtn} 
                onClick={() => setIsPlaying(true)}
              >
                {isPlaying ? "🔄 Replay" : "▶ Play"}
              </button>
              <button
                className={`${styles.addBtn} ${isInList ? styles.inList : ""}`}
                onClick={handleMyList}
              >
                {isInList ? "✓ In My List" : "＋ My List"}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.grid}>
            <div className={styles.left}>
              <div className={styles.tags}>
                <span className={styles.match}>⭐ {selectedMovie.rating || "N/A"} Rating</span>
                {selectedMovie.releaseYear && (
                  <span className={styles.tag}>{selectedMovie.releaseYear}</span>
                )}
                {selectedMovie.category && (
                  <span className={styles.tag}>{selectedMovie.category}</span>
                )}
                <span className={styles.tag}>4K Ultra HD</span>
              </div>
              
              <p className={styles.overview}>
                {selectedMovie.description}
              </p>
            </div>

            <div className={styles.right}>
              <p className={styles.meta}>
                <span>Category:</span> {selectedMovie.category}
              </p>
              <p className={styles.meta}>
                <span>Audio:</span> Hindi, English, Spanish
              </p>
              <p className={styles.meta}>
                <span>Subtitles:</span> English, Hindi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}