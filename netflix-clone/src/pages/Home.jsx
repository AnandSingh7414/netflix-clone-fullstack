import React, { useState, useEffect } from "react";
import { useMovies } from "../context/MoviesContext";
import Modal from "../components/Modal";
import { getImage } from "../services/api";
import styles from "./Home.module.css";

function Home() {
  const { state, dispatch } = useMovies();
  const { categories, loading, error } = state;
  
  const [activeSlide, setActiveSlide] = useState(0);

  const trendingCategory = categories.find(
    (cat) => cat.title === "Trending Now"
  );

  const bannerMovies = trendingCategory 
    ? trendingCategory.movies.slice(0, 6) 
    : (categories.length > 0 ? categories[0].movies.slice(0, 6) : []);

  useEffect(() => {
    if (bannerMovies.length === 0) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerMovies.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, [bannerMovies.length]);

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // ✅ PROFESSIONAL FULL-SCREEN ERROR UI
  if (error) {
    return (
      <div className={styles.fullScreenError}>
        <div className={styles.errorContent}>
          <h1 className={styles.errorTitle}>Lost your connection?</h1>
          <p className={styles.errorText}>
            Please Cheack your backend connection (Port 8081) looks Offline. <br />
            Please restart your server "Try Again" Ckick on.
          </p>
          <button className={styles.errorButton} onClick={() => window.location.reload()}>
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      {bannerMovies.length > 0 && (
        <div className={styles.bannerContainer}>
          <div 
            className={styles.bannerSlider}
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {bannerMovies.map((movie) => (
              <header 
                key={movie.id}
                className={styles.hero} 
                style={{ 
                  backgroundImage: `linear-gradient(to bottom, rgba(20,20,20,0) 30%, rgba(20,20,20,0.8) 80%, rgba(20,20,20,1) 100%), url(${getImage(movie)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 10%'
                }}
              >
                <div className={styles.heroContent}>
                  <h1 className={styles.heroTitle}>{movie.title}</h1>
                  <p className={styles.heroDescription}>{movie.description}</p>
                  <div className={styles.heroButtons}>
                    <button 
                      className={styles.playButton}
                      onClick={() => window.open(movie.videoUrl, "_blank")}
                    >
                      ▶ Play
                    </button>
                    <button 
                      className={styles.infoButton} 
                      onClick={() => dispatch({ type: "OPEN_MODAL", payload: movie })}
                    >
                      ⓘ More Info
                    </button>
                  </div>
                </div>
              </header>
            ))}
          </div>

          <div className={styles.bannerDots}>
            {bannerMovies.map((_, idx) => (
              <div 
                key={idx} 
                className={`${styles.dot} ${idx === activeSlide ? styles.activeDot : ""}`}
                onClick={() => setActiveSlide(idx)}
              ></div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.rowContainer}>
        {categories.map((cat) => (
          <div key={cat.id} className={styles.row}>
            <h2 className={styles.rowTitle}>{cat.title}</h2>
            <div className={styles.rowPosters}>
              {cat.movies.map((movie) => (
                <div 
                  key={movie.id} 
                  className={styles.card} 
                  onClick={() => dispatch({ type: "OPEN_MODAL", payload: movie })}
                >
                  <img 
                    src={getImage(movie)} 
                    alt={movie.title} 
                    className={styles.poster} 
                    loading="lazy" 
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Modal />
    </div>
  );
}

export default Home;