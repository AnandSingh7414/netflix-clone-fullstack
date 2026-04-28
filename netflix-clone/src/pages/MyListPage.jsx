import { useMovies } from '../context/MoviesContext'
import { getImage } from '../services/api' 
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import styles from './MyListPage.module.css'

export default function MyListPage() {
  const { state, dispatch } = useMovies()
  const { myList } = state

  const handleClick = (movie) => {
    dispatch({
      type: 'OPEN_MODAL',
      payload: movie
    })
  }

  const handleRemove = (e, id) => {
    e.stopPropagation()
    dispatch({ type: 'REMOVE_FROM_LIST', payload: id })
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.heading}>My List</h1>

        {myList.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>🎬</p>
            <p className={styles.emptyText}>Your list is empty</p>
            <p className={styles.emptySubtext}>Add movies and shows by clicking "＋ My List" on any title</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {myList.map(movie => {
              const img = getImage(movie)
              const title = movie.title || "No Title"

              return (
                <div key={movie.id} className={styles.card} onClick={() => handleClick(movie)}>
                  <img 
                    src={img} 
                    alt={title} 
                    className={styles.poster} 
                    loading="lazy" 
                  />
                  
                  <div className={styles.overlay}>
                    <div className={styles.cardDetails}>
                      <p className={styles.cardTitle}>{title}</p>
                      <div className={styles.meta}>
                        <span className={styles.rating}>⭐ {movie.rating}</span>
                        <span className={styles.year}>{movie.releaseYear}</span>
                      </div>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={e => handleRemove(e, movie.id)}
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <Modal />
    </div>
  )
}