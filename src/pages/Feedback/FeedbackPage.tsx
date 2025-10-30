import { useEffect, useMemo, useState } from 'react'
import styles from './FeedbackPage.module.css'
import { feedbackDishes } from '../../data/feedbackDishes'
import { useFeedbackStore } from '../../store/useFeedbackStore'

const MAX_STARS = 5

function FeedbackPage() {
  const ratings = useFeedbackStore((state) => state.ratings)
  const loading = useFeedbackStore((state) => state.loading)
  const error = useFeedbackStore((state) => state.error)
  const fetchLeaderboard = useFeedbackStore((state) => state.fetchLeaderboard)
  const startLeaderboardStream = useFeedbackStore((state) => state.startLeaderboardStream)
  const stopLeaderboardStream = useFeedbackStore((state) => state.stopLeaderboardStream)
  const submitRating = useFeedbackStore((state) => state.submitRating)
  const [focusedDish, setFocusedDish] = useState<string | null>(null)

  const animatedDishes = useMemo(() => feedbackDishes, [])

  useEffect(() => {
    fetchLeaderboard().catch(() => {})
    startLeaderboardStream()

    return () => {
      stopLeaderboardStream()
    }
  }, [fetchLeaderboard, startLeaderboardStream, stopLeaderboardStream])

  const handleRate = (dishId: string, value: number) => {
    submitRating(dishId, value).catch(() => {})
    setFocusedDish(dishId)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Menu Feedback</h1>
        <p>
          Rate each signature dish and jot a note for the Food Genie. Your insights keep the menu buzzing.
        </p>
      </header>

      {loading ? <p className={styles.status}>Loading leaderboard…</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      <section className={styles.cards}>
        {animatedDishes.map((dish, index) => {
          const rating = ratings[dish.id] ?? 0
          return (
            <article
              key={dish.id}
              className={`${styles.card} ${focusedDish === dish.id ? styles.cardActive : ''}`.trim()}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <img className={styles.cardImage} src={dish.imageUrl} alt={dish.name} loading="lazy" />
              <div className={styles.cardBody}>
                <h2>{dish.name}</h2>
                <p>{dish.description}</p>
              </div>
              <div className={styles.stars}>
                {Array.from({ length: MAX_STARS }, (_, starIndex) => {
                  const starValue = starIndex + 1
                  const active = starValue <= rating
                  return (
                    <button
                      key={starValue}
                      type="button"
                      className={`${styles.starButton} ${active ? styles.starActive : ''}`.trim()}
                      onClick={() => handleRate(dish.id, starValue)}
                      aria-label={`Rate ${dish.name} ${starValue} out of ${MAX_STARS}`}
                    >
                      ★
                    </button>
                  )
                })}
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}

export default FeedbackPage
