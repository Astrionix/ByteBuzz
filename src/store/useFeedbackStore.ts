import type { RealtimeChannel } from '@supabase/supabase-js'
import { create } from 'zustand'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export type FeedbackRatings = Record<string, number>

type LeaderboardEntry = {
  id: string
  averageRating: number
  ratingCount: number
}

type FeedbackRow = {
  dish_id: string
  rating: number
  user_id?: string
  created_at?: string
}

type FeedbackState = {
  ratings: FeedbackRatings
  loading: boolean
  error: string | null
  fetchLeaderboard: () => Promise<void>
  submitRating: (dishId: string, value: number, userId?: string) => Promise<void>
  startLeaderboardStream: () => void
  stopLeaderboardStream: () => void
}

const FEEDBACK_TABLE = 'feedback_votes'

const mockLeaderboard: FeedbackRatings = {
  'cucumber-boats': 4,
  'nachos-salad': 5,
  mocktail: 5,
  'bhel-poori': 4,
}

const aggregateRatings = (rows: FeedbackRow[]): FeedbackRatings => {
  if (!rows.length) {
    return {}
  }

  const totals = new Map<string, { sum: number; count: number }>()

  for (const row of rows) {
    if (!row.dish_id) continue
    if (!totals.has(row.dish_id)) {
      totals.set(row.dish_id, { sum: 0, count: 0 })
    }
    const record = totals.get(row.dish_id)!
    record.sum += row.rating
    record.count += 1
  }

  const ratings: FeedbackRatings = {}
  totals.forEach((value, key) => {
    if (value.count === 0) return
    const average = value.sum / value.count
    ratings[key] = Math.max(0, Math.min(5, Math.round(average)))
  })
  return ratings
}

let leaderboardChannel: RealtimeChannel | null = null
let channelSubscribers = 0

const ensureLeaderboardChannel = (fetch: () => Promise<void>) => {
  if (!isSupabaseConfigured || leaderboardChannel) {
    return
  }

  leaderboardChannel = supabase
    .channel('feedback-leaderboard')
    .on('postgres_changes', { event: '*', schema: 'public', table: FEEDBACK_TABLE }, () => {
      fetch().catch(() => {})
    })
    .subscribe()
}

const teardownLeaderboardChannel = async () => {
  if (!leaderboardChannel) {
    return
  }
  try {
    await supabase.removeChannel(leaderboardChannel)
  } catch {}
  leaderboardChannel = null
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  ratings: {},
  loading: false,
  error: null,
  fetchLeaderboard: async () => {
    if (!isSupabaseConfigured) {
      set({ ratings: mockLeaderboard, loading: false, error: 'Supabase is not configured. Using mock leaderboard.' })
      return
    }

    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.from(FEEDBACK_TABLE).select('dish_id, rating')
      if (error) {
        throw error
      }
      const rows = (data ?? []) as FeedbackRow[]
      const ratings = aggregateRatings(rows)
      set({ ratings, loading: false })
    } catch (error) {
      set({ ratings: mockLeaderboard, loading: false, error: error instanceof Error ? error.message : 'Unable to reach rating service' })
    }
  },
  startLeaderboardStream: () => {
    if (typeof window === 'undefined') {
      return
    }

    channelSubscribers += 1

    if (!isSupabaseConfigured) {
      return
    }

    ensureLeaderboardChannel(get().fetchLeaderboard)
  },
  stopLeaderboardStream: () => {
    if (channelSubscribers > 0) {
      channelSubscribers -= 1
    }

    if (channelSubscribers === 0) {
      void teardownLeaderboardChannel()
    }
  },
  submitRating: async (dishId, value, userId) => {
    const state = get()
    const previous = state.ratings[dishId]
    const optimistic = {
      ...state.ratings,
      [dishId]: value,
    }
    set({ ratings: optimistic })

    if (!isSupabaseConfigured) {
      set({ error: 'Supabase is not configured. Rating stored locally only.' })
      return
    }

    try {
      const { error } = await supabase.from(FEEDBACK_TABLE).insert({ dish_id: dishId, rating: value, user_id: userId })
      if (error) {
        throw error
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
