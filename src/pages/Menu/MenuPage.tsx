import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './MenuPage.module.css'
import { useDailyMenu } from '../../hooks/useDailyMenu'
import { feedbackDishes } from '../../data/feedbackDishes'

type DishCategory = 'veg' | 'non-veg' | 'drink'

type DishKnowMore = {
  calories: string
  ingredients: string[]
  funFacts: string[]
  cookingTime?: string
  winePairing?: string
  beveragePairing?: string
  servingSuggestion?: string
  pairingSuggestion?: string
}

type DishCard = {
  id: string
  name: string
  category: DishCategory
  spice: number
  description: string
  trivia: string
  available?: boolean
  image?: string
  calories?: number
  knowMore?: DishKnowMore
  cookTimeMinutes?: number
}

type BuildCategory = 'base' | 'protein' | 'flavor' | 'finish'

type BuildOption = {
  id: string
  label: string
  description: string
  cookTime: number
  pairing: string
}

const filters = [
  { id: 'all', label: 'All' },
]

const imageByDishId = feedbackDishes.reduce<Record<string, string>>((acc, dish) => {
  acc[dish.id] = dish.imageUrl
  return acc
}, {})

if (!imageByDishId['bitebuzz-mocktail'] && imageByDishId.mocktail) {
  imageByDishId['bitebuzz-mocktail'] = imageByDishId.mocktail
}

const knowMoreContent: Record<string, DishKnowMore> = {
  'cucumber-boats': {
    calories: '≈120 kcal per serving',
    ingredients: [
      'Fresh cucumber cups',
      'Boiled chickpeas',
      'Hung curd or Greek yogurt',
      'Mint leaves',
      'Lemon juice',
      'Chat masala & black salt',
      'Chili flakes (optional)',
    ],
    funFacts: [
      'Cucumbers are 95% water — perfect for hydration and cooling the body.',
      'This snack is zero-oil and gut-friendly.',
      '“Cucumber Boats” refers to the filling sailing inside the cucumber halves!',
    ],
    cookingTime: 'Prep time: 10 minutes',
    winePairing: 'Pairs beautifully with a chilled Sauvignon Blanc or citrus-forward mocktails.',
    pairingSuggestion: 'Serve alongside light white wines or sparkling cucumber water for the full spa-day vibe.',
  },
  'nachos-salad': {
    calories: '≈250 kcal per serving',
    ingredients: [
      'Baked nachos (corn chips)',
      'Red kidney beans or black beans',
      'Chopped lettuce, tomato, onion, bell peppers',
      'Sweet corn',
      'Salsa or pico de gallo',
      'Yogurt or sour cream dressing',
      'Optional: grated cheese, jalapeños',
    ],
    funFacts: [
      'Nachos were accidentally created in 1943 by Ignacio “Nacho” Anaya in Mexico.',
      'Our “smart salad” balances crunch, fiber, and protein.',
      'The AI twist optimizes dressing ratios for taste and color harmony.',
    ],
    cookingTime: 'Prep & toss: 15 minutes',
    winePairing: 'Great with a young Pinot Noir or a hoppy craft beer.',
    pairingSuggestion: 'Pairs with sparkling water infused with lime for a non-alcoholic option.',
  },
  mocktail: {
    calories: '≈90 kcal per serving',
    ingredients: [
      'Fresh mint leaves (10-12 leaves)',
      'Freshly squeezed lemon juice (30ml)',
      'Cucumber essence or fresh cucumber juice (20ml)',
      'Honey syrup or agave nectar (15ml)',
      'Sparkling soda or tonic water (100ml)',
      'Crushed ice',
      'Garnish: mint sprig, lemon wheel, cucumber ribbon',
      'Optional: A pinch of black salt for enhanced flavor',
    ],
    funFacts: [
      'Our signature mocktail is inspired by the classic "Mojito" but with a refreshing twist of cucumber and mint.',
      'The combination of mint and cucumber is scientifically proven to aid digestion and provide a cooling effect.',
      'We use locally sourced, organic ingredients to ensure the freshest taste in every sip.',
      'The drink is naturally sweetened with honey or agave, making it a healthier alternative to sugar-laden mocktails.',
      'The effervescence from the sparkling water helps to cleanse the palate between bites.',
      'This mocktail is rich in vitamin C from the fresh lemon juice, boosting your immune system.',
    ],
    cookingTime: 'Build time: 5 minutes',
    beveragePairing: 'Enjoy as-is or pair with a light fruit plate.',
    servingSuggestion: 'Best served in a chilled highball glass with a sprig of mint and a cucumber ribbon for garnish.',
    pairingSuggestion: 'Pairs exceptionally well with spicy dishes, helping to cool the palate.',
  },
  'bhel-poori': {
    calories: '≈200 kcal per serving',
    ingredients: [
      'Puffed rice (murmura)',
      'Sev (crunchy chickpea noodles)',
      'Boiled potatoes, chopped onions & tomatoes',
      'Tamarind chutney & green mint chutney',
      'Coriander leaves & lemon juice',
      'Spices: chaat masala, salt, chili powder',
    ],
    funFacts: [
      'Bhel Poori is one of India’s oldest street snacks from Mumbai’s beaches.',
      'The name echoes the “bhel-bhel” sound of puffed rice vendors shaking tins.',
      'Our tech twist serves it with QR and taste score integration!',
    ],
    cookingTime: 'Assembly: 12 minutes',
    winePairing: 'Try with an off-dry Riesling to balance the tang and spice.',
    pairingSuggestion: 'Serve with chilled buttermilk or mango lassi for a nostalgic combo.',
  },
}

const fallbackDishes: DishCard[] = [
  {
    id: 'cucumber-boats',
    name: 'Cucumber Boats',
    category: 'veg',
    spice: 1,
    description: 'Chilled cucumber cups filled with spiced chickpeas, tangy yogurt, and mint drizzle.',
    trivia: 'A refreshing snack with low calories — hydrating and perfect for sunny events!',
    calories: 120,
    available: true,
    image: imageByDishId['cucumber-boats'],
    knowMore: knowMoreContent['cucumber-boats'],
    cookTimeMinutes: 10,
  },
  {
    id: 'nachos-salad',
    name: 'Nachos Salad',
    category: 'veg',
    spice: 2,
    description: 'Crispy nachos layered with beans, veggies, salsa, and a creamy AI-inspired dressing.',
    trivia: 'Nachos were first served accidentally — now reimagined with a healthy, data-driven twist.',
    calories: 250,
    available: true,
    image: imageByDishId['nachos-salad'],
    knowMore: knowMoreContent['nachos-salad'],
    cookTimeMinutes: 15,
  },
  {
    id: 'mocktail',
    name: 'BiteBuzz Mocktail',
    category: 'drink',
    spice: 0,
    description: 'A fizzy mix of mint, lemon, and cucumber essence — crafted for balance and buzz.',
    trivia: 'AI generated the flavor ratio to optimize sweetness, acidity, and refreshment!',
    calories: 90,
    available: true,
    image: imageByDishId.mocktail,
    knowMore: knowMoreContent.mocktail,
    cookTimeMinutes: 5,
  },
  {
    id: 'bhel-poori',
    name: 'Bhel Poori',
    category: 'veg',
    spice: 3,
    description: 'Crispy puffed rice, sev, onion, and tangy chutneys blended with a BiteBuzz twist.',
    trivia: 'A street food legend turned smart snack — now served with digital flair!',
    calories: 200,
    available: true,
    image: imageByDishId['bhel-poori'],
    knowMore: knowMoreContent['bhel-poori'],
    cookTimeMinutes: 12,
  },
]

function MenuPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const { dishes: liveDishes, loading, error } = useDailyMenu()

  const { dishes, isFallback } = useMemo(() => {
    if (liveDishes.length === 0) {
      return { dishes: fallbackDishes, isFallback: true }
    }
    const normalized = liveDishes.map((dish) => ({
      id: dish.id,
      name: dish.name,
      category: dish.category,
      spice: dish.spice,
      description: dish.description ?? 'Chef is still typing up the tasting notes…',
      trivia: dish.trivia ?? 'Ask the Food Genie for the latest gossip on this dish.',
      available: dish.available !== false,
      image: dish.image ?? imageByDishId[dish.id],
      knowMore: knowMoreContent[dish.id],
      cookTimeMinutes: (dish as { cookTimeMinutes?: number }).cookTimeMinutes,
    })) satisfies DishCard[]
    return { dishes: normalized, isFallback: false }
  }, [liveDishes])

  const filtered = useMemo(() => {
    let list = dishes
    if (activeFilter === 'fire') list = list.filter((dish) => dish.spice >= 4)
    else if (activeFilter !== 'all') list = list.filter((dish) => dish.category === activeFilter)
    return list.filter((dish) => dish.available !== false)
  }, [activeFilter, dishes])

  const toggleKnowMore = (id: string) => {
    setExpandedCard((current) => (current === id ? null : id))
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Menu</h1>
          <p>Swipe a card, inspect the ingredients, and see your future in the spice meter.</p>
        </div>
        <div className={styles.ctaCard}>
          <strong>Craving a custom experience?</strong>
          <span>Design your own Ceremony Bowl with live timing and pairing tips.</span>
          <Link className={styles.ctaButton} to="/ceremony-bowl">
            Build yours
          </Link>
        </div>
        <div className={styles.filters}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={activeFilter === filter.id ? `${styles.filter} ${styles.filterActive}` : styles.filter}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      <section className={styles.deck}>
        {loading && isFallback ? <p className={styles.loading}>Fetching today’s menu…</p> : null}
        {error ? <p className={styles.error}>Failed to load live menu. Showing signature staples.</p> : null}
        {filtered.map((dish, index) => {
          const isExpanded = expandedCard === dish.id
          const knowMoreId = `know-more-${dish.id}`
          const knowMoreData = dish.knowMore
          const hasKnowMore = Boolean(
            knowMoreData &&
              ((knowMoreData.ingredients && knowMoreData.ingredients.length > 0) ||
                (knowMoreData.funFacts && knowMoreData.funFacts.length > 0) ||
                knowMoreData.calories),
          )
          return (
            <motion.article
              key={dish.id}
              className={styles.card}
              whileHover={{ rotateY: 6, y: -6 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
            >
              {dish.image ? <img className={styles.cardImage} src={dish.image} alt={dish.name} /> : null}
              <div className={styles.cardHeader}>
                <h2>{dish.name}</h2>
              </div>
              <p className={styles.description}>{dish.description}</p>
              <div className={styles.trivia}>
                <span>Trivia</span>
                <p>{dish.trivia}</p>
              </div>
              {hasKnowMore ? (
                <div className={styles.knowMoreBlock}>
                  <button
                    type="button"
                    className={styles.knowMoreButton}
                    onClick={() => toggleKnowMore(dish.id)}
                    aria-expanded={isExpanded}
                    aria-controls={knowMoreId}
                  >
                    {isExpanded ? 'Hide details' : 'Know more'}
                  </button>
                  {isExpanded ? (
                    <div className={styles.knowMore} id={knowMoreId}>
                      <div className={styles.knowMoreHeader}>
                        <span className={styles.knowMoreLabel}>Know more</span>
                        {knowMoreData?.calories ? (
                          <span className={styles.knowMoreCalories}>{knowMoreData.calories}</span>
                        ) : null}
                      </div>
                      <div className={styles.knowMoreQuickFacts}>
                        {dish.cookTimeMinutes ? (
                          <span className={styles.quickFact}>
                            ⏱️ Ready in {dish.cookTimeMinutes} min
                          </span>
                        ) : null}
                        {knowMoreData?.cookingTime ? (
                          <span className={styles.quickFact}>{knowMoreData.cookingTime}</span>
                        ) : null}
                        {knowMoreData?.winePairing ? (
                          <span className={styles.quickFact}>🍷 {knowMoreData.winePairing}</span>
                        ) : null}
                        {knowMoreData?.beveragePairing ? (
                          <span className={styles.quickFact}>🥂 {knowMoreData.beveragePairing}</span>
                        ) : null}
                      </div>
                      {knowMoreData?.ingredients && knowMoreData.ingredients.length > 0 ? (
                        <div className={styles.knowMoreSection}>
                          <h4>Ingredients</h4>
                          <ul>
                            {knowMoreData.ingredients.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {knowMoreData?.funFacts && knowMoreData.funFacts.length > 0 ? (
                        <div className={styles.knowMoreSection}>
                          <h4>Fun facts</h4>
                          <ul>
                            {knowMoreData.funFacts.map((fact) => (
                              <li key={fact}>{fact}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {knowMoreData?.pairingSuggestion ? (
                        <div className={styles.knowMoreSection}>
                          <h4>Pairing tip</h4>
                          <p>{knowMoreData.pairingSuggestion}</p>
                        </div>
                      ) : null}
                      {knowMoreData?.servingSuggestion ? (
                        <div className={styles.knowMoreSection}>
                          <h4>Serving</h4>
                          <p>{knowMoreData.servingSuggestion}</p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </motion.article>
          )
        })}
      </section>
    </div>
  )
}

export default MenuPage
