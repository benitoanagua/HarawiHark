import { Page, expect } from '@playwright/test';

export const SELECTORS = {
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

  BUTTONS: {
    ANALYZE: '.editor-actions button:has-text("analyze")',
    CLEAR: '.editor-actions button:has-text("clear")',
    LOAD_EXAMPLE: '.editor-actions button:has-text("example")',
    COPY: '.editor-actions button:has-text("copy")',

    APP_BAR: {
      ANALYZE: '.metro-command-button:has-text("analyze")',
      CLEAR: '.metro-command-button:has-text("clear")',
      EXAMPLE: '.metro-command-button:has-text("example")',
      COPY: '.metro-command-button:has-text("copy")',
    },
  },

  EDITOR: {
    CONTAINER: 'app-poem-editor',
    LINE_INPUT: (index: number) => `#poem-editor-line-${index}`,
    SYLLABLE_COUNTER: (index: number) => `.line-row:nth-child(${index + 1}) .syllable-count`,
    MULTILINE_INPUT: 'app-multiline-input',
  },

  RESULTS: {
    CONTAINER: 'app-poem-results',
    QUALITY_SECTION: 'app-poem-quality',
    METER_SECTION: 'app-meter-analysis-section',
    WORD_DETAILS: '.word-details',
    SUGGESTIONS: 'app-word-suggestions',
    ANALYSIS_TABS: '.metro-pivot-item',
  },

  NAVIGATION: {
    QUICK_NAV: '.nav-pill',
    PANORAMA_SECTIONS: '[data-section]',
  },

  STATE: {
    LOADING: '[class*="loading"], [class*="progress"]',
    TOAST: {
      SUCCESS: '.metro-toast-success',
      ERROR: '.metro-toast-error',
      INFO: '.metro-toast-info',
      WARNING: '.metro-toast-warning',
    },
  },
};

export const TEST_POEMS = {
  HAIKU: ['An old silent pond', 'A frog jumps into the pond', 'Splash! Silence again'],
  HAIKU_SPANISH: ['Un estanque silencioso', 'Una rana salta al agua', '¡Chap! Silencio otra vez'],
  TANKA: [
    'The falling flower',
    'I saw drift back to the branch',
    'Was a butterfly',
    'Dancing in the gentle breeze',
    "Nature's art in motion",
  ],
  CINQUAIN: [
    'Moon',
    'Silent light',
    'Casting silver shadows',
    'Illuminating the dark night',
    'Peace',
  ],
};

export class TestHelpers {
  /**
   * Selecciona una forma poética en el dropdown
   */
  static async selectPoetryForm(page: Page, formValue: string): Promise<void> {
    const formSelector = page.locator(SELECTORS.FORM_SELECTOR);

    await formSelector.waitFor({ state: 'visible', timeout: 5000 });

    const currentValue = await formSelector.inputValue();
    if (currentValue === formValue) {
      console.log(`Form already set to ${formValue}`);
      return;
    }

    await formSelector.selectOption(formValue);

    await page.waitForTimeout(1000);

    await expect(formSelector).toHaveValue(formValue, { timeout: 3000 });
  }

  /**
   * Carga un ejemplo en el editor
   */
  static async loadExample(page: Page): Promise<void> {
    const exampleButton = page.locator(SELECTORS.BUTTONS.LOAD_EXAMPLE);
    await exampleButton.first().click();

    await page.waitForTimeout(1500);

    const firstLine = page.locator(SELECTORS.EDITOR.LINE_INPUT(0));
    const lineContent = await firstLine.inputValue();

    if (!lineContent.trim()) {
      console.log('No content loaded, retrying...');
      await page.waitForTimeout(1000);
      await exampleButton.first().click();
      await page.waitForTimeout(1500);
    }
  }

  /**
   * Limpia el editor
   */
  static async clearEditor(page: Page): Promise<void> {
    const clearButton = page.locator(SELECTORS.BUTTONS.CLEAR);
    await clearButton.first().click();

    try {
      await page.waitForSelector(
        'button:has-text("OK"), button:has-text("Confirm"), button:has-text("Yes")',
        {
          timeout: 2000,
        }
      );
      await page.click('button:has-text("OK"), button:has-text("Confirm"), button:has-text("Yes")');
      await page.waitForTimeout(500);
    } catch {
      //Nothing
    }

    await page.waitForTimeout(500);

    const firstLine = page.locator(SELECTORS.EDITOR.LINE_INPUT(0));
    const lineContent = await firstLine.inputValue();

    if (lineContent.trim()) {
      console.log('Editor not cleared, retrying...');
      await clearButton.first().click();
      await page.waitForTimeout(1000);
    }
  }

  /**
   * Llena las líneas del poema en el editor
   */
  static async fillPoemLines(page: Page, lines: string[]): Promise<void> {
    for (let i = 0; i < lines.length; i++) {
      const lineInput = page.locator(SELECTORS.EDITOR.LINE_INPUT(i));

      await lineInput.waitFor({ state: 'visible', timeout: 3000 });

      await lineInput.clear();
      await lineInput.fill(lines[i]);

      await page.waitForTimeout(300);
    }

    await page.waitForTimeout(1000);
  }

  /**
   * Ejecuta el análisis y espera los resultados
   */
  static async waitForAnalysis(page: Page, timeout = 20000): Promise<void> {
    const analyzeButton = page.locator(SELECTORS.BUTTONS.ANALYZE);

    await analyzeButton.first().waitFor({ state: 'visible', timeout: 5000 });
    await expect(analyzeButton.first()).toBeEnabled({ timeout: 5000 });

    await analyzeButton.first().click();

    console.log('Analysis started, waiting for results...');

    try {
      await page.waitForSelector(SELECTORS.STATE.LOADING, {
        state: 'visible',
        timeout: 5000,
      });
      console.log('Loading indicator found, waiting for it to disappear...');

      await page.waitForSelector(SELECTORS.STATE.LOADING, {
        state: 'detached',
        timeout: 15000,
      });
      console.log('Loading indicator disappeared');
    } catch {
      console.log('No loading indicators found, continuing...');
    }

    try {
      await page.waitForSelector(SELECTORS.RESULTS.CONTAINER, { timeout });
      console.log('Main results container found');
    } catch (error) {
      console.log('Main results container not found, trying alternative strategies...', error);

      const resultComponents = [
        'app-poem-results',
        'app-meter-analysis-section',
        'app-poem-quality',
        'app-quick-stats-panel',
        'app-word-suggestions',
      ];

      let foundComponent = false;
      for (const component of resultComponents) {
        if (await page.locator(component).isVisible({ timeout: 3000 })) {
          console.log(`Found result component: ${component}`);
          foundComponent = true;
          break;
        }
      }

      if (!foundComponent) {
        await page.waitForTimeout(5000);

        if (await analyzeButton.first().isEnabled()) {
          console.log('Analyze button re-enabled, analysis might be complete');
        } else {
          throw new Error('No analysis results found with any strategy');
        }
      }
    }
  }

  /**
   * Navega a una sección específica usando los botones de navegación rápida
   */
  static async navigateToSection(page: Page, section: 'editor' | 'results'): Promise<void> {
    const navButton = page.locator(`.nav-pill:has-text("${section}")`);
    await navButton.click();

    await page.waitForTimeout(1000);

    const sectionElement = page.locator(`[data-section="${section}"]`);
    await expect(sectionElement).toBeVisible({ timeout: 3000 });
  }

  /**
   * Cambia a una pestaña específica en los resultados de análisis
   */
  static async switchAnalysisTab(page: Page, tabName: string): Promise<void> {
    const tabButton = page.locator(`.metro-pivot-item:has-text("${tabName}")`);
    await tabButton.click();

    await page.waitForTimeout(500);

    await expect(tabButton).toHaveClass(/metro-pivot-active/, { timeout: 3000 });
  }

  /**
   * Espera a que un toast aparezca y verifica su contenido
   */
  static async waitForToast(
    page: Page,
    type: 'success' | 'error' | 'info' | 'warning',
    timeout = 5000
  ): Promise<void> {
    const toastSelector =
      SELECTORS.STATE.TOAST[type.toUpperCase() as keyof typeof SELECTORS.STATE.TOAST];
    const toast = page.locator(toastSelector);

    await expect(toast.first()).toBeVisible({ timeout });

    await page.waitForTimeout(1000);
  }

  /**
   * Verifica que el contador de sílabas muestre el valor esperado
   */
  static async verifySyllableCount(
    page: Page,
    lineIndex: number,
    expectedPattern: RegExp | string
  ): Promise<void> {
    const syllableCounter = page.locator(SELECTORS.EDITOR.SYLLABLE_COUNTER(lineIndex));

    await syllableCounter.waitFor({ state: 'visible', timeout: 3000 });

    await page.waitForFunction(
      (args: { selector: string; pattern: string }) => {
        const counter = document.querySelector(args.selector);
        return counter && new RegExp(args.pattern).test(counter.textContent || '');
      },
      {
        selector: `.line-row:nth-child(${lineIndex + 1}) .syllable-count`,
        pattern: expectedPattern instanceof RegExp ? expectedPattern.source : expectedPattern,
      },
      { timeout: 5000 }
    );

    const counterText = await syllableCounter.textContent();

    if (expectedPattern instanceof RegExp) {
      expect(counterText).toMatch(expectedPattern);
    } else {
      expect(counterText).toContain(expectedPattern);
    }
  }

  /**
   * Obtiene el texto completo del poema del editor
   */
  static async getPoemText(page: Page): Promise<string> {
    const lines: string[] = [];

    for (let i = 0; i < 10; i++) {
      const lineInput = page.locator(SELECTORS.EDITOR.LINE_INPUT(i));

      if (await lineInput.isVisible()) {
        const lineText = await lineInput.inputValue();
        if (lineText.trim()) {
          lines.push(lineText);
        }
      } else {
        break;
      }
    }

    return lines.join('\n');
  }
}
