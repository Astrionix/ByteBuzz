import { useMemo } from 'react'
import styles from './LeaderboardPage.module.css'
import { feedbackDishes } from '../../data/feedbackDishes'
import { useFeedbackStore } from '../../store/useFeedbackStore'

const MAX_STARS = 5

function LeaderboardPage() {
  const ratings = useFeedbackStore((state) => state.ratings)

  const leaderboard = useMemo(() => {
    return feedbackDishes
      .map((dish) => ({
        id: dish.id,
        name: dish.name,
        description: dish.description,
        rating: ratings[dish.id] ?? 0,
      }))
      .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))
  }, [ratings])

  const hasAnyRatings = leaderboard.some((entry) => entry.rating > 0)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Flavor Leaderboard</h1>
        <p>
          Star counts from live feedback determine which dishes are reigning supreme. Keep rating to shuffle the
          ranks.
        </p>
      </header>

      <section className={styles.board}>
        {leaderboard.map((entry, index) => (
          <article
            key={entry.id}
            className={`${styles.row} ${entry.rating === 0 ? styles.rowPending : ''}`.trim()}
          >
            <div className={styles.rank}>{index + 1}</div>
            <div className={styles.details}>
              <h2>{entry.name}</h2>
              <p>{entry.description}</p>
            </div>
            <div className={styles.score} aria-label={`${entry.rating} out of ${MAX_STARS} stars`}>
              {entry.rating > 0 ? (
                <>
                  <span className={styles.scoreStars}>{'★'.repeat(entry.rating)}</span>
                  <span className={styles.scoreTotal}>{`${entry.rating}/${MAX_STARS}`}</span>
                </>
              ) : (
                <span className={styles.scoreEmpty}>Awaiting feedback</span>
              )}
            </div>
          </article>
        ))}
        {!hasAnyRatings ? (
          <p className={styles.empty}>No feedback yet — rate a dish to start the leaderboard.</p>
        ) : null}
      </section>
    </div>
  )
}

export default LeaderboardPage
