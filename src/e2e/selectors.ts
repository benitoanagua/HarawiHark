import { Page } from '@playwright/test';

export const SELECTORS = {
  // Form selection
  FORM_SELECTOR: '#poetry-form-selector',
  FORM_OPTIONS: {
    HAIKU: 'haiku',
    TANKA: 'tanka',
    CINQUAIN: 'cinquain',
    LIMERICK: 'limerick',
    REDONDILLA: 'redondilla',
    LANTERNE: 'lanterne',
    DIAMANTE: 'diamante',
    FIBONACCI: 'fibonacci',
  },

  // Editor
  EDITOR: {
    CONTAINER: 'app-poem-editor',
    LINE_INPUT: (index: number) => `#poem-editor-line-${index}`,
    SYLLABLE_COUNTER: (index: number) => `[data-syllable-counter="${index}"]`,
  },

  // Buttons
  BUTTONS: {
    ANALYZE: 'button:has-text("analyze")',
    LOAD_EXAMPLE: 'button:has-text("example")',
    CLEAR: 'button:has-text("clear")',
    COPY: 'button:has-text("copy")',
  },

  // Results and Analysis
  RESULTS: {
    CONTAINER: 'app-poem-results',
    WORD_TOKENS: '.word-token',
    CLICKABLE_WORDS: '.word-clickable',
    WORD_DETAILS: '.word-details',
    METER_ANALYSIS: 'app-meter-analysis-section',
    QUALITY_METRICS: 'app-poem-quality',
    QUALITY_SCORE: '.quality-score',
  },

  // Suggestions
  SUGGESTIONS: {
    CONTAINER: 'app-word-suggestions',
    ALTERNATIVES: '.alternative-item',
  },

  // Analysis Tabs
  ANALYSIS_TABS: {
    STRUCTURE: 'structure',
    RHYTHM: 'rhythm',
    QUALITY: 'quality',
    STATS: 'stats',
  },

  // Toast notifications
  TOAST: {
    SUCCESS: '.metro-toast-success',
    ERROR: '.metro-toast-error',
    INFO: '.metro-toast-info',
    WARNING: '.metro-toast-warning',
  },

  // Quick navigation
  QUICK_NAV: {
    EDITOR: '.nav-pill:has-text("editor")',
    RESULTS: '.nav-pill:has-text("results")',
  },
};

export const TEST_POEMS = {
  HAIKU: ['An old silent pond', 'A frog jumps into the pond', 'Splash! Silence again.'],
  HAIKU_SPANISH: ['El viejo estanque', 'Una rana salta al agua', 'Sonido callado.'],
  TANKA: [
    'Winter seclusion',
    'Listening to the quiet rain',
    'On the roof at night',
    'Memories of summer days',
    'Warm sun and gentle breezes',
  ],
  CINQUAIN: [
    'Moon',
    'Silver light',
    'Casting shadows long',
    'Illuminating the dark night',
    'Peace',
  ],
};

export interface TestCase {
  text: string;
  expectedPattern: RegExp;
}

export interface PoetryTestData {
  form: string;
  lines: string[];
  expectedSyllables: number[];
}

export class TestHelpers {
  static async selectPoetryForm(page: Page, form: string): Promise<void> {
    const formSelector = page.locator(SELECTORS.FORM_SELECTOR);
    await formSelector.selectOption(form);
    await page.waitForTimeout(500);
  }

  static async loadExample(page: Page): Promise<void> {
    const exampleButton = page.locator(SELECTORS.BUTTONS.LOAD_EXAMPLE);
    await exampleButton.click();
    await page.waitForTimeout(1000);
  }

  static async clearEditor(page: Page): Promise<void> {
    const clearButton = page.locator(SELECTORS.BUTTONS.CLEAR);
    await clearButton.click();

    // Handle confirmation dialog if it appears
    try {
      page.once('dialog', (dialog: { accept: () => Promise<void> }) => dialog.accept());
    } catch {
      // Dialog might not appear, continue anyway
    }

    await page.waitForTimeout(500);
  }

  static async fillPoemLines(page: Page, lines: string[]): Promise<void> {
    for (let i = 0; i < lines.length; i++) {
      const lineInput = page.locator(SELECTORS.EDITOR.LINE_INPUT(i));
      await lineInput.fill(lines[i]);
      await page.waitForTimeout(200);
    }
  }

  static async getSyllableCount(page: Page, lineIndex: number): Promise<number> {
    const counter = page.locator(SELECTORS.EDITOR.SYLLABLE_COUNTER(lineIndex));
    const text = await counter.textContent();
    const match = text?.match(/(\d+)\/\d+/);
    return match ? parseInt(match[1], 10) : 0;
  }

  static async waitForAnalysis(page: Page, timeout = 5000): Promise<void> {
    const analyzeButton = page.locator(SELECTORS.BUTTONS.ANALYZE);
    await analyzeButton.click();

    // Wait for results to appear
    await page.waitForSelector(SELECTORS.RESULTS.CONTAINER, { timeout }).catch(() => {
      console.log('Analysis results might not have appeared within timeout');
    });
  }

  static async verifyToastVisibility(page: Page, toastType: string): Promise<boolean> {
    const toastSelector = SELECTORS.TOAST[toastType as keyof typeof SELECTORS.TOAST];
    if (!toastSelector) return false;

    try {
      const toast = page.locator(toastSelector);
      return await toast.isVisible({ timeout: 3000 });
    } catch {
      return false;
    }
  }

  static async navigateToSection(page: Page, section: 'editor' | 'results'): Promise<void> {
    const navButton = page.locator(
      section === 'editor' ? SELECTORS.QUICK_NAV.EDITOR : SELECTORS.QUICK_NAV.RESULTS
    );

    if (await navButton.isVisible()) {
      await navButton.click();
      await page.waitForTimeout(500);
    }
  }

  static async getCurrentFormValue(page: Page): Promise<string | null> {
    const formSelector = page.locator(SELECTORS.FORM_SELECTOR);
    return await formSelector.inputValue();
  }

  static async isAnalysisReady(page: Page): Promise<boolean> {
    const analyzeButton = page.locator(SELECTORS.BUTTONS.ANALYZE);
    return await analyzeButton.isEnabled();
  }
}
