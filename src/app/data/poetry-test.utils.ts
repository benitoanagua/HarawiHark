import { POETRY_FORMS, POETRY_EXAMPLES } from './poetry-forms.data';

export interface PoetryFormTestData {
  lines: number;
  pattern: number[];
}

export type MockPoetryData = Record<string, string[]>;

export const getPoetryFormTestData = (): Record<string, PoetryFormTestData> => {
  return Object.entries(POETRY_FORMS).reduce((acc, [id, form]) => {
    acc[id] = {
      lines: form.lines,
      pattern: form.pattern,
    };
    return acc;
  }, {} as Record<string, PoetryFormTestData>);
};

export const getMockPoetryData = (): MockPoetryData => {
  const mockData: MockPoetryData = { ...POETRY_EXAMPLES };

  mockData['haikuWithErrors'] = [
    'A very old silent pond in the forest',
    'A small green frog jumps',
    'Big splash sound and then quiet',
  ];

  return mockData;
};

export const getPoetryFormsForTests = () => {
  return Object.values(POETRY_FORMS).map((form) => ({
    id: form.id,
    name: form.name,
    pattern: form.pattern.join('-'),
  }));
};

export const TEST_EXAMPLES = {
  HAIKU_WITH_ERRORS: [
    'A very old silent pond in the forest',
    'A small green frog jumps',
    'Big splash sound and then quiet',
  ] as string[],
};
