import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './CeremonyBowlPage.module.css'
import type { BuildCategory } from '../../features/ceremonyBuilder/builderData'
import {
  buildCategories,
  buildOptions,
  builderBlueprint,
  pairingHighlights,
  getSelectedOptions,
  getTotalBuildTime,
  getPairingSuggestions,
} from '../../features/ceremonyBuilder/builderData'

const initialSelections: Record<BuildCategory, string | null> = {
  base: null,
  protein: null,
  flavor: null,
  finish: null,
}

function CeremonyBowlPage() {
  const [selections, setSelections] = useState(initialSelections)

  const selectedOptions = useMemo(() => getSelectedOptions(selections), [selections])
  const totalTime = useMemo(() => getTotalBuildTime(selectedOptions), [selectedOptions])
  const pairings = useMemo(() => getPairingSuggestions(selectedOptions), [selectedOptions])
  const completedCount = selectedOptions.length
  const isComplete = completedCount === buildCategories.length

  const handleSelect = (category: BuildCategory, optionId: string) => {
    setSelections((current) => ({
      ...current,
      [category]: current[category] === optionId ? null : optionId,
    }))
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.heroBadge}>Food Genie workshop</span>
        <h1 className={styles.heroTitle}>Build Your Own Ceremony Bowl</h1>
        <p className={styles.heroSubtitle}>{builderBlueprint.intro}</p>
      </section>

      <div className={styles.grid}>
        {buildCategories.map((category) => (
          <div key={category} className={styles.column}>
            <h2 className={styles.columnTitle}>
              {category === 'base'
                ? 'Base foundation'
                : category === 'protein'
                  ? 'Protein spotlight'
                  : category === 'flavor'
                    ? 'Flavor boost'
                    : 'Finish shimmer'}
            </h2>
            <div className={styles.options}>
              {buildOptions[category].map((option) => {
                const isActive = selections[category] === option.id
                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    className={isActive ? `${styles.optionButton} ${styles.optionActive}` : styles.optionButton}
                    whileHover={{ translateY: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(category, option.id)}
                  >
                    <span className={styles.optionLabel}>{option.label}</span>
                    <span className={styles.optionDescription}>{option.description}</span>
                    <span className={styles.optionMeta}>⏱️ {option.cookTime} min · {option.pairing}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <section className={styles.summary}>
        <div>
          <h3>Current build</h3>
          {selectedOptions.length > 0 ? (
            <ul className={styles.selectionList}>
              {selectedOptions.map((option) => (
                <li key={option.id}>{option.label}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.tip}>Select one element from each pillar to begin crafting your bowl.</p>
          )}
        </div>
        <div className={styles.summaryMeta}>
          <span className={styles.summaryChip}>Progress: {completedCount}/{buildCategories.length}</span>
          <span className={styles.summaryChip}>Total time: {selectedOptions.length > 0 ? `${totalTime} min` : '—'}</span>
          {pairings.length > 0 ? (
            <span className={styles.summaryChip}>{pairings.join(' | ')}</span>
          ) : null}
          {isComplete ? <span className={styles.summaryChip}>✨ Ready to serve</span> : null}
        </div>
        <p className={styles.tip}>{builderBlueprint.outro}</p>
      </section>

      <section>
        <h2 className={styles.columnTitle}>Wine & Beverage Pairing Guide</h2>
        <div className={styles.pairingGuide}>
          {pairingHighlights.map((highlight) => (
            <div key={highlight.title} className={styles.pairingCard}>
              <h4>{highlight.title}</h4>
              <p className={styles.pairingBeverage}>{highlight.beverage}</p>
              <ul className={styles.pairingList}>
                {highlight.matches.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={styles.pairingNote}>{highlight.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default CeremonyBowlPage
