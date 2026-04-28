import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies, getImage } from '../services/api';
import { useMovies } from '../context/MoviesContext';
import Modal from '../components/Modal';
import styles from './SearchPage.module.css';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { dispatch } = useMovies();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Backend call using api.js function
    searchMovies(query)
      .then(res => {
        setResults(res.data || []);
      })
      .catch((err) => {
        console.error("Search API Error:", err);
        setError('Search failed. Backend is not responding.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  const handleClick = (movie) => {
    dispatch({ type: 'OPEN_MODAL', payload: movie });
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h2 className={styles.heading}>
          {query ? `Results for "${query}"` : 'Search for movies & shows'}
        </h2>

        {loading && (
          <div className={styles.grid}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={styles.skelCard} />
            ))}
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {!loading && results.length === 0 && query && !error && (
          <p className={styles.noResults}>No movies found for "{query}"</p>
        )}

        {!loading && results.length > 0 && (
          <div className={styles.grid}>
            {results.map(movie => {
              const img = getImage(movie); // Using image helper
              const title = movie.title || "No Title";

              return (
                <div 
                  key={movie.id} 
                  className={styles.card} 
                  onClick={() => handleClick(movie)}
                >
                  <img 
                    src={img} 
                    alt={title} 
                    className={styles.poster} 
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x170";
                    }}
                  />
                  <div className={styles.cardOverlay}>
                    <p className={styles.cardTitle}>{title}</p>
                    <div className={styles.cardMeta}>
                      <span>⭐ {movie.rating || "N/A"}</span>
                      <span>{movie.releaseYear || "Unknown"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal />
    </div>
  );
}
