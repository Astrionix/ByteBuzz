import type { DailyDish } from '../hooks/useDailyMenu'

export type BuzzMood = 'idle' | 'happy' | 'curious' | 'playful' | 'sassy' | 'warning'
export type GenieMood = 'idle' | 'delighted' | 'eyerolled' | 'warning' | 'sass'

export type BuzzMessage = {
  id: string
  role: 'user' | 'buzzbot'
  content: string
}

export async function chatWithGenie(
  history: GenieMessage[],
  dishes: DailyDish[],
  leaderboard: { name: string; dish: string; score: number }[]
): Promise<GenieChatResponse> {
  const buzzHistory: BuzzMessage[] = history.map((message) => ({
    id: message.id,
    role: message.role === 'genie' ? 'buzzbot' : 'user',
    content: message.content,
  }))

  const response = await chatWithBuzzBot(buzzHistory, dishes, leaderboard)

  return {
    reply: response.reply,
    mood: classifyGenieMood(response.reply),
    source: response.source,
  }
}

export type GenieMessage = {
  id: string
  role: 'user' | 'genie'
  content: string
}

export type BuzzChatResponse = {
  reply: string
  mood: BuzzMood
  source: 'openai' | 'fallback' | 'openrouter'
}

export type GenieChatResponse = {
  reply: string
  mood: GenieMood
  source: BuzzChatResponse['source']
}

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080'
const REQUEST_TIMEOUT_MS = Number.parseInt(import.meta.env.VITE_API_TIMEOUT_MS ?? '4000', 10)

// 🧩 Mood Classifier
const classifyBuzzMood = (text: string): BuzzMood => {
  const lower = text.toLowerCase()
  if (lower.includes('yum') || lower.includes('great') || lower.includes('delicious')) return 'happy'
  if (lower.includes('hmm') || lower.includes('why')) return 'curious'
  if (lower.includes('ha!') || lower.includes('fun') || lower.includes('buzz')) return 'playful'
  if (lower.includes('spice') || lower.includes('fire')) return 'sassy'
  if (lower.includes('careful') || lower.includes('note')) return 'warning'
  return 'idle'
}

const classifyGenieMood = (text: string): GenieMood => {
  const lower = text.toLowerCase()
  if (lower.includes('ha!') || lower.includes('told you') || lower.includes('cheeky')) return 'sass'
  if (lower.includes('brave') || lower.includes('challenge') || lower.includes('bold')) return 'delighted'
  if (lower.includes('spice') || lower.includes('fire') || lower.includes('burn')) return 'eyerolled'
  if (lower.includes('careful') || lower.includes('warning') || lower.includes('note')) return 'warning'
  return 'idle'
}

// 🧠 Fallback (Offline Mode)
const buildFallbackReply = (prompt: string, dishes: DailyDish[]) => {
  const lower = prompt.toLowerCase()

  if (lower.includes('menu') || lower.includes('snacks') || lower.includes('list')) {
    const lineup = dishes.map((dish) => `• ${dish.name}`).join('\n') || 'No snacks ready yet!'
    return `Today's BiteBuzz lineup:\n${lineup}\nScan, taste, and let your sensors decide! ⚡`
  }

  if (lower.includes('recommend')) {
    const pick = dishes.find((dish) => dish.available !== false) ?? dishes[0]
    return pick
      ? `I'd recommend the ${pick.name} — ${pick.description}`
      : `No dishes available right now. Even BuzzBot needs a snack break.`
  }

  if (lower.includes('calorie') || lower.includes('health')) {
    return 'All our snacks are under 300 calories — BiteBuzz keeps taste high and guilt low! 🍃'
  }

  if (lower.includes('mocktail')) {
    return 'The BiteBuzz Mocktail? Mint, lemon, cucumber — all fizz and no fuss. Perfect balance of sweet and cool. 🍹'
  }

  if (lower.includes('bhel')) {
    return 'Our Bhel Poori crackles with puffed rice, chutneys, and fun. Smart street food at its best. 😋'
  }

  if (lower.includes('nachos')) {
    return 'Nachos Salad — crunch meets color! A data-approved balance of spice, protein, and joy 🥗'
  }

  if (lower.includes('cucumber')) {
    return 'Cucumber Bites: light, hydrating, and refreshingly geeky. Who knew health could taste this fun? 🥒'
  }

  return "Ask me about our snacks, calories, or the BuzzMeter scores. I’m always hungry for questions. 🤖"
}

// 🧾 Summaries
const fetchWithTimeout = async (input: RequestInfo | URL, init?: RequestInit) => {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

// 💬 Main Chat Handler
export async function chatWithBuzzBot(
  history: BuzzMessage[],
  dishes: DailyDish[],
  leaderboard: { name: string; dish: string; score: number }[]
): Promise<BuzzChatResponse> {
  const latestUser = [...history].reverse().find((msg) => msg.role === 'user')
  const fallback = buildFallbackReply(latestUser?.content ?? '', dishes)

  try {
    const response = await fetchWithTimeout(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, dishes, leaderboard }),
    })

    if (!response.ok) {
      throw new Error(`Chat service error (${response.status})`)
    }

    const payload: Partial<BuzzChatResponse> & { reply?: string } = await response.json()
    const reply = payload.reply?.trim()

    if (!reply) {
      throw new Error('Empty reply from chat service')
    }

    const mood = payload.mood ?? classifyBuzzMood(reply)
    const source = payload.source ?? 'fallback'

    return { reply, mood, source }
  } catch (error) {
    console.error('BuzzBot chat failed', error)
    return { reply: fallback, mood: classifyBuzzMood(fallback), source: 'fallback' }
  }
}
