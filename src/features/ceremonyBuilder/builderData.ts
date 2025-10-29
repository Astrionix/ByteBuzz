export type BuildCategory = 'base' | 'protein' | 'flavor' | 'finish'

export type BuildOption = {
  id: string
  label: string
  description: string
  cookTime: number
  pairing: string
}

export const buildCategories: BuildCategory[] = ['base', 'protein', 'flavor', 'finish']

export const buildOptions: Record<BuildCategory, BuildOption[]> = {
  base: [
    {
      id: 'grain-bowl',
      label: 'Ancient Grain Bowl',
      description: 'Warm quinoa, millet, and barley with coriander butter.',
      cookTime: 12,
      pairing: 'Pairs with citrus-forward whites or cucumber coolers.',
    },
    {
      id: 'leafy-garden',
      label: 'Leafy Garden Crunch',
      description: 'Hydroponic lettuce, baby kale, shaved fennel, seed sprinkle.',
      cookTime: 6,
      pairing: 'Loves sparkling rosé or basil lemonade.',
    },
  ],
  protein: [
    {
      id: 'herbed-paneer',
      label: 'Charred Herbed Paneer',
      description: 'Paneer seared with smoked paprika and fenugreek.',
      cookTime: 8,
      pairing: 'Serve with semi-dry Riesling or mango spritz.',
    },
    {
      id: 'miso-tofu',
      label: 'Miso Glazed Tofu',
      description: 'Silken tofu lacquered with citrus miso glaze.',
      cookTime: 7,
      pairing: 'Great with chilled sake or ginger tonic.',
    },
  ],
  flavor: [
    {
      id: 'smoky-tamarind',
      label: 'Smoky Tamarind Burst',
      description: 'Tamarind, chipotle, and jaggery reduction drizzle.',
      cookTime: 5,
      pairing: 'Balances bold reds or hibiscus cooler.',
    },
    {
      id: 'green-goddess',
      label: 'Green Goddess Chill',
      description: 'Mint, cilantro, yogurt, lime zest, and cumin.',
      cookTime: 4,
      pairing: 'Try with crisp Sauvignon Blanc or mint spritz.',
    },
  ],
  finish: [
    {
      id: 'crisp-lotus',
      label: 'Crisp Lotus Crunch',
      description: 'Lotus root chips tossed in smoked chili salt.',
      cookTime: 3,
      pairing: 'Enjoy with wheat beer or salted lime soda.',
    },
    {
      id: 'seed-fur',
      label: 'Sesame Seed Furikake',
      description: 'Toasted sesame, nori flakes, and puffed amaranth.',
      cookTime: 2,
      pairing: 'Pairs with dry cider or yuzu spritzer.',
    },
  ],
}

export const pairingHighlights = [
  {
    title: 'Fresh & Crisp',
    beverage: 'Sauvignon Blanc / Citrus Spritz',
    matches: ['Cucumber Boats', 'Ancient Grain Bowl builds'],
    note: 'Bright acidity keeps herbs lively and cuts through creamy textures.',
  },
  {
    title: 'Bold & Smoky',
    beverage: 'Pinot Noir / Hibiscus Cooler',
    matches: ['Nachos Salad', 'Smoky Tamarind Burst builds'],
    note: 'Fruity spice mirrors chipotle heat while staying refreshing.',
  },
  {
    title: 'Cooling & Aromatic',
    beverage: 'Mint Mocktail / Riesling',
    matches: ['BiteBuzz Mocktail', 'Green Goddess Chill builds'],
    note: 'Sweet aromatics soothe spice and highlight citrus layers.',
  },
] as const

export const builderBlueprint = {
  intro: '✨ Build Your Own Ceremony Bowl: pick a Base, Protein, Flavor Boost, and Finish. The Genie tracks cook time and pairing tips for you!',
  categories: [
    {
      title: 'Base',
      options: [
        'Ancient Grain Bowl — quinoa, millet, barley (12 min). Pair with citrus spritz.',
        'Leafy Garden Crunch — hydroponic greens, fennel (6 min). Pair with sparkling rosé.',
      ],
    },
    {
      title: 'Protein',
      options: [
        'Charred Herbed Paneer — smoked paprika & fenugreek (8 min). Pair with semi-dry Riesling.',
        'Miso Glazed Tofu — citrus-miso lacquer (7 min). Pair with chilled sake or ginger tonic.',
      ],
    },
    {
      title: 'Flavor Boost',
      options: [
        'Smoky Tamarind Burst — tamarind, chipotle, jaggery (5 min). Pair with hibiscus cooler.',
        'Green Goddess Chill — mint, cilantro yogurt (4 min). Pair with mint spritz.',
      ],
    },
    {
      title: 'Finish',
      options: [
        'Crisp Lotus Crunch — lotus root chips (3 min). Pair with wheat beer or lime soda.',
        'Sesame Seed Furikake — toasted sesame & nori (2 min). Pair with dry cider.',
      ],
    },
  ],
  outro: 'Select one from each pillar in the Ceremony Bowl builder to see total time and suggested pours in real-time.',
} as const

export const getSelectedOptions = (
  selections: Partial<Record<BuildCategory, string | null>>,
): BuildOption[] => {
  return buildCategories
    .map((category) => {
      const id = selections[category]
      if (!id) return null
      return buildOptions[category].find((option) => option.id === id) ?? null
    })
    .filter((option): option is BuildOption => Boolean(option))
}

export const getTotalBuildTime = (options: BuildOption[]) =>
  options.reduce((acc, option) => acc + option.cookTime, 0)

export const getPairingSuggestions = (options: BuildOption[]) =>
  Array.from(new Set(options.map((option) => option.pairing)))
