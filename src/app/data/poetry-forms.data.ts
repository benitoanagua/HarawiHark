import { PoetryForm } from '../models/poetry.model';

export const POETRY_FORMS: Record<string, PoetryForm> = {
  haiku: {
    id: 'haiku',
    name: 'Haiku',
    pattern: [5, 7, 5],
    lines: 3,
    origin: 'Japanese',
    description: 'Traditional nature poem with 3 lines',
  },
  tanka: {
    id: 'tanka',
    name: 'Tanka',
    pattern: [5, 7, 5, 7, 7],
    lines: 5,
    origin: 'Japanese',
    description: 'Extended court poetry with 5 lines',
  },
  cinquain: {
    id: 'cinquain',
    name: 'Cinquain',
    pattern: [2, 4, 6, 8, 2],
    lines: 5,
    origin: 'American',
    description: 'Didactic poem with ascending/descending pattern',
  },
  limerick: {
    id: 'limerick',
    name: 'Limerick',
    pattern: [8, 8, 5, 5, 8],
    lines: 5,
    origin: 'English',
    description: 'Humorous poem with AABBA rhyme scheme',
  },

  redondilla: {
    id: 'redondilla',
    name: 'Redondilla',
    pattern: [8, 8, 8, 8],
    lines: 4,
    origin: 'Spanish',
    description: 'Quatrain with consonant rhyme',
  },
  lanterne: {
    id: 'lanterne',
    name: 'Lanterne',
    pattern: [1, 2, 3, 4, 1],
    lines: 5,
    origin: 'Japanese-inspired',
    description: 'Lantern-shaped syllabic poem',
  },
  diamante: {
    id: 'diamante',
    name: 'Diamante',
    pattern: [1, 2, 3, 4, 3, 2, 1],
    lines: 7,
    origin: 'Modern',
    description: 'Diamond-shaped contrast poem',
  },
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci',
    pattern: [1, 1, 2, 3, 5, 8],
    lines: 6,
    origin: 'Mathematical',
    description: 'Follows Fibonacci sequence',
  },
};

export const POETRY_FORM_OPTIONS = Object.values(POETRY_FORMS).map((form) => ({
  value: form.id,
  label: form.name,
  description: form.pattern.join('-'),
}));

export const POETRY_EXAMPLES: Record<string, string[]> = {
  haiku: ['an old silent pond', 'a frog jumps into the pond', 'splash! silence again'],
  tanka: [
    'the falling flower',
    'i saw drift back to the branch',
    'was a butterfly',
    'dancing in the gentle breeze',
    "nature's art in motion",
  ],
  cinquain: [
    'moon',
    'silent light',
    'casting silver shadows',
    'illuminating the dark night',
    'peace',
  ],
  limerick: [
    'there once was a coder so bright',
    'who worked on his app every night',
    'with angular and code',
    'he built a fine node',
    "and launched it to everyone's delight",
  ],
  redondilla: [
    'in fields of green and gold so bright',
    'where flowers dance in morning light',
    'the world awakens from the night',
    'and fills my heart with pure delight',
  ],
  lanterne: ['moon', 'bright glow', 'silver light', 'shining through night', 'peace'],
  diamante: [
    'day',
    'bright warm',
    'shining glowing heating',
    'sunrise sunset twilight darkness',
    'cooling dimming fading',
    'cold dark',
    'night',
  ],
  fibonacci: ['I', 'am', 'writing', 'syllables', 'in fibonacci', 'a mathematical poetry sequence'],
};
