export type FeedbackDish = {
  id: string
  name: string
  description: string
  imageUrl: string
}

export const feedbackDishes: FeedbackDish[] = [
  {
    id: 'cucumber-boats',
    name: 'Cucumber Boats',
    description: 'Hydrating cucumber cups with spice-kissed chickpeas and minty yogurt.',
    imageUrl: 'https://blessmyfoodbypayal.com/wp-content/uploads/2025/08/IMG_2641.png',
  },
  {
    id: 'nachos-salad',
    name: 'Nachos Salad',
    description: 'Crunchy nachos layered with beans, veggies, and AI-tuned dressing.',
    imageUrl: 'https://png.pngtree.com/png-clipart/20250416/original/pngtree-bowl-of-colorful-mexican-nacho-salad-with-crispy-chips-png-image_20704008.png',
  },
  {
    id: 'mocktail',
    name: 'BiteBuzz Mocktail',
    description: 'Sparkling mint, lemon, and cucumber essence engineered for balance.',
    imageUrl: 'https://www.saveur.com/uploads/2007/02/SAVEUR_Mojito_1149-Edit-scaled.jpg?format=auto&optimize=high&width=1440',
  },
  {
    id: 'bhel-poori',
    name: 'Bhel Poori',
    description: 'Classic puffed rice chaos with chutneys, crunch, and digital swagger.',
    imageUrl: 'https://i.ytimg.com/vi/fMJQOsM87fM/maxresdefault.jpg',
  },
]
