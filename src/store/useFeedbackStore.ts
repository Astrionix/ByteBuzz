import { create } from 'zustand'

export type FeedbackRatings = Record<string, number>

type LeaderboardEntry = {
  id: string
  averageRating: number
  ratingCount: number
}

type FeedbackState = {
  ratings: FeedbackRatings
  loading: boolean
  error: string | null
  fetchLeaderboard: () => Promise<void>
  submitRating: (dishId: string, value: number, userId?: string) => Promise<void>
  startLeaderboardStream: () => void
}

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080'
const REQUEST_TIMEOUT_MS = Number.parseInt(import.meta.env.VITE_API_TIMEOUT_MS ?? '4000', 10)

const mockLeaderboard: FeedbackRatings = {
  'cucumber-boats': 4,
  'nachos-salad': 5,
  mocktail: 5,
  'bhel-poori': 4,
}

const fetchWithTimeout = async (input: RequestInfo | URL, init?: RequestInit) => {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  ratings: {},
  loading: false,
  error: null,
  fetchLeaderboard: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetchWithTimeout(`${API_BASE}/leaderboard`)
      if (!response.ok) {
        throw new Error(`Failed to load leaderboard (${response.status})`)
      }
      const json: { leaderboard: LeaderboardEntry[] } = await response.json()
      const ratings = json.leaderboard.reduce<FeedbackRatings>((acc, entry) => {
        acc[entry.id] = Math.round(entry.averageRating)
        return acc
      }, {})
      set({ ratings, loading: false })
    } catch (error) {
      set({ ratings: mockLeaderboard, loading: false, error: error instanceof Error ? error.message : 'Unable to reach rating service' })
    }
  },
  startLeaderboardStream: () => {
    try {
      const source = new EventSource(`${API_BASE}/leaderboard/stream`)
      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as { leaderboard?: LeaderboardEntry[] }
          const rows = data.leaderboard ?? []
          const ratings = rows.reduce<FeedbackRatings>((acc, entry) => {
            acc[entry.id] = Math.round(entry.averageRating)
            return acc
          }, {})
          set({ ratings })
        } catch {}
      }
      source.onerror = () => {
        try { source.close() } catch {}
      }
    } catch {}
  },
  submitRating: async (dishId, value, userId) => {
    const state = get()
    const previous = state.ratings[dishId]
    const optimistic = {
      ...state.ratings,
      [dishId]: previous === value ? 0 : value,
    }
    set({ ratings: optimistic })

    try {
      const response = await fetchWithTimeout(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishId, rating: value, userId }),
      })
      if (!response.ok) {
        throw new Error(`Failed to submit feedback (${response.status})`)
      }
      await get().fetchLeaderboard()
    } catch (error) {
      set((current) => ({
        ratings: {
          ...current.ratings,
          [dishId]: previous ?? 0,
        },
        error: error instanceof Error ? error.message : 'Unable to reach rating service',
      }))
    }
  },
}))
