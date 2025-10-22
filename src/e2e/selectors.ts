export const SELECTORS = {
  EDITOR_SECTION: '[data-section="editor"]',
  RESULTS_SECTION: '[data-section="results"]',
  QUICK_NAV: {
    EDITOR: '.nav-pill:has-text("editor")',
    RESULTS: '.nav-pill:has-text("results")',
  },

  FORM_SELECTOR: '#poetry-form-selector',
  FORM_OPTIONS: {
    HAIKU: 'haiku',
    TANKA: 'tanka',
    CINQUAIN: 'cinquain',
    LIMERICK: 'limerick',
    DIAMANTE: 'diamante',
    FIBONACCI: 'fibonacci',
    REDONDILLA: 'redondilla',
    LANTERNE: 'lanterne',
  },

  EDITOR: {
    CONTAINER: '#poem-editor',
    LINE_INPUT: (index: number) => `#poem-editor-line-${index}`,
    LINE_INPUTS: '#poem-editor input.line-input',
    SYLLABLE_COUNTER: (index: number) => `#poem-editor .syllable-count:nth-child(${index + 1})`,
    SYLLABLE_COUNTERS: '#poem-editor .syllable-count',
  },

  BUTTONS: {
    ANALYZE: 'button:has-text("analyze")',
    EXAMPLE: 'button:has-text("example")',
    CLEAR: 'button:has-text("clear")',
    COPY: 'button:has-text("copy")',
  },

  STATS: {
    LINES: 'text=lines',
    SYLLABLES: 'text=syllables',
    COMPLETION: 'text=complete',
  },

  ANALYSIS: {
    CONTAINER: 'app-poem-results',
    TABS: {
      STRUCTURE: 'app-pivot [role="tab"]:has-text("structure")',
      RHYTHM: 'app-pivot [role="tab"]:has-text("rhythm")',
      QUALITY: 'app-pivot [role="tab"]:has-text("quality")',
      STATS: 'app-pivot [role="tab"]:has-text("stats")',
    },
    QUALITY_SCORE: '.score-number',
    QUALITY_GRADE: '.grade-badge',
    RHYME_SCHEME: '.rhyme-value',
    METER_TYPE: '.meter-type',
    SUGGESTIONS: '.suggestion-item',
    WORD_ALTERNATIVES: 'app-word-suggestions',
  },

  TOAST: {
    SUCCESS: '.metro-toast-success',
    ERROR: '.metro-toast-error',
    INFO: '.metro-toast-info',
    WARNING: '.metro-toast-warning',
  },
};

export const TEST_POEMS = {
  HAIKU: ['An old silent pond', 'A frog jumps into the pond', 'Splash! Silence again'],
  HAIKU_SPANISH: ['Luz de luna brilla', 'Sobre el estanque tranquilo', 'Noche de quietud'],
  TANKA: [
    'The falling flower',
    'I saw drift back to the branch',
    'Was a butterfly',
    'Dancing in the gentle breeze',
    "Nature's art in motion",
  ],
  LIMERICK: [
    'There once was a poet so bright',
    'Who worked on his verses each night',
    'With syllables counted',
    'And rhymes all accounted',
    'His poems were pure delight',
  ],
  ERROR_EXAMPLES: {
    HAIKU_TOO_LONG: [
      'A very old silent pond in the deep dark forest',
      'A small green frog jumps quickly and suddenly',
      'Big splash sound and then complete silence everywhere',
    ],
    HAIKU_TOO_SHORT: ['Old pond', 'Frog jumps', 'Splash'],
  },
};

export const TestHelpers = {
  async selectPoetryForm(page: any, form: string) {
    await page.selectOption(SELECTORS.FORM_SELECTOR, form);
    await page.waitForTimeout(500);
  },

  async fillPoemLines(page: any, lines: string[]) {
    for (let i = 0; i < lines.length; i++) {
      await page.locator(SELECTORS.EDITOR.LINE_INPUT(i)).fill(lines[i]);
      await page.waitForTimeout(100);
    }
  },

  async clearEditor(page: any) {
    const clearButton = page.locator(SELECTORS.BUTTONS.CLEAR);
    if (await clearButton.isEnabled()) {
      await clearButton.click();

      try {
        await page.waitForTimeout(500);
        const dialog = await page.waitForEvent('dialog', { timeout: 1000 });
        await dialog.accept();
      } catch {}
    }
  },

  async loadExample(page: any) {
    await page.locator(SELECTORS.BUTTONS.EXAMPLE).click();
    await page.waitForTimeout(1000);
  },

  async analyzePoem(page: any) {
    await page.locator(SELECTORS.BUTTONS.ANALYZE).click();
    await page.waitForTimeout(2000);
  },

  async navigateToResults(page: any) {
    await page.locator(SELECTORS.QUICK_NAV.RESULTS).click();
    await page.waitForTimeout(1000);
  },

  async navigateToEditor(page: any) {
    await page.locator(SELECTORS.QUICK_NAV.EDITOR).click();
    await page.waitForTimeout(1000);
  },

  async getSyllableCounts(page: any): Promise<string[]> {
    const counters = page.locator(SELECTORS.EDITOR.SYLLABLE_COUNTERS);
    const count = await counters.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      texts.push(await counters.nth(i).textContent());
    }
    return texts;
  },

  async waitForAnalysisComplete(page: any, timeout = 10000) {
    try {
      await page.waitForSelector(SELECTORS.ANALYSIS.CONTAINER, { timeout });
    } catch {
      const analysisIndicator = page
        .locator('text=Analyzing')
        .or(page.locator(SELECTORS.TOAST.INFO));
      await analysisIndicator.waitFor({ state: 'hidden', timeout });
    }
  },
};
