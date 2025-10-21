export const mockPoetryData = {
  haiku: ['An old silent pond', 'A frog jumps into the pond', 'Splash! Silence again'],

  tanka: [
    'The falling flower',
    'I saw drift back to the branch',
    'Was a butterfly',
    'Dancing in the gentle breeze',
    "Nature's art in motion",
  ],

  limerick: [
    'There once was a poet so bright',
    'Who worked on his verses each night',
    'With syllables counted',
    'And rhymes all accounted',
    'His poems were pure delight',
  ],

  cinquain: [
    'Moon',
    'Silver light',
    'Casting shadows long',
    'Illuminating the dark night',
    'Peace',
  ],

  // Poemas con errores para demostrar correcciones
  haikuWithErrors: [
    'A very old silent pond in the forest', // demasiadas sílabas
    'A small green frog jumps', // muy pocas sílabas
    'Big splash sound and then quiet', // incorrecto
  ],
};

export const poetryForms = [
  { id: 'haiku', name: 'Haiku', pattern: '5-7-5' },
  { id: 'tanka', name: 'Tanka', pattern: '5-7-5-7-7' },
  { id: 'limerick', name: 'Limerick', pattern: '8-8-5-5-8' },
  { id: 'cinquain', name: 'Cinquain', pattern: '2-4-6-8-2' },
  { id: 'redondilla', name: 'Redondilla', pattern: '8-8-8-8' },
  { id: 'lanterne', name: 'Lanterne', pattern: '1-2-3-4-1' },
  { id: 'diamante', name: 'Diamante', pattern: '1-2-3-4-3-2-1' },
  { id: 'fibonacci', name: 'Fibonacci', pattern: '1-1-2-3-5-8' },
];
