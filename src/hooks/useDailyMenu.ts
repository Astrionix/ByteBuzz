import { useEffect, useState } from 'react'
import { subscribeToTodaysMenu } from '../services/firebase'

export type DailyDish = {
  id: string
  name: string
  category: 'veg' | 'non-veg'
  spice: number
  price?: number
  description?: string
  available: boolean
  image?: string
  trivia?: string
}

const fallbackMenu: DailyDish[] = [
  {
    id: 'cucumber-boats',
    name: 'Cucumber Boats',
    category: 'veg',
    spice: 2,
    description: 'Hydrating cucumber cups with spice-kissed chickpeas and minty yogurt.',
    available: true,
    trivia: 'Best chilled. The Genie pretends it dislikes mild snacks, but keeps refilling its plate.',
  },
  {
    id: 'nachos-salad',
    name: 'Nachos Salad',
    category: 'veg',
    spice: 4,
    description: 'Crunchy nachos layered with beans, veggies, and AI-tuned dressing.',
    available: true,
    trivia: 'Pairs perfectly with the BiteBuzz Mocktail when you need both crunch and cool.',
  },
  {
    id: 'bitebuzz-mocktail',
    name: 'BiteBuzz Mocktail',
    category: 'veg',
    spice: 1,
    description: 'Sparkling mint, lemon, and cucumber essence engineered for balance.',
    available: true,
    trivia: 'Fizzes at exactly 3.1415 bubbles per second. Don’t ask how we measured.',
  },
  {
    id: 'bhel-poori',
    name: 'Bhel Poori',
    category: 'veg',
    spice: 3,
    description: 'Classic puffed rice chaos with chutneys, crunch, and digital swagger.',
    available: true,
    trivia: 'ByteBuzz folklore says the Genie gained its temper from this chutney.',
  },
]

export function useDailyMenu() {
  const [dishes, setDishes] = useState<DailyDish[]>(fallbackMenu)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToTodaysMenu(
      (items) => {
        const nextDishes = (items as DailyDish[]) ?? []
        setDishes(nextDishes.length > 0 ? nextDishes : fallbackMenu)
        setLoading(false)
      },
      (err) => {
        setError(err as Error)
        setDishes(fallbackMenu)
        setLoading(false)
      },
    )
    return () => unsubscribe()
  }, [])

  return { dishes, loading, error }
}
