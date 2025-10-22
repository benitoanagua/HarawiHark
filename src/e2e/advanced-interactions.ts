import { Page, expect, test } from '@playwright/test';
import { SELECTORS, TestHelpers } from './selectors';

export class AdvancedInteractions {
  static async completePoemWorkflow(
    page: Page,
    formType: string,
    poemLines: string[]
  ): Promise<void> {
    await test.step('Select poetry form', async () => {
      await TestHelpers.selectPoetryForm(page, formType);
      await expect(page.locator(SELECTORS.FORM_SELECTOR)).toHaveValue(formType);
    });

    await test.step('Fill poem lines', async () => {
      await TestHelpers.fillPoemLines(page, poemLines);

      // Verify lines are filled
      for (let i = 0; i < poemLines.length; i++) {
        const lineInput = page.locator(SELECTORS.EDITOR.LINE_INPUT(i));
        await expect(lineInput).toHaveValue(poemLines[i]);
      }
    });

    await test.step('Analyze poem', async () => {
      await TestHelpers.waitForAnalysis(page);

      // Verify results are displayed
      await expect(page.locator(SELECTORS.RESULTS.CONTAINER)).toBeVisible();
    });
  }

  static async testAllPoetryForms(page: Page): Promise<void> {
    const forms = [
      SELECTORS.FORM_OPTIONS.HAIKU,
      SELECTORS.FORM_OPTIONS.TANKA,
      SELECTORS.FORM_OPTIONS.CINQUAIN,
      SELECTORS.FORM_OPTIONS.LIMERICK,
      SELECTORS.FORM_OPTIONS.REDONDILLA,
      SELECTORS.FORM_OPTIONS.LANTERNE,
      SELECTORS.FORM_OPTIONS.DIAMANTE,
      SELECTORS.FORM_OPTIONS.FIBONACCI,
    ];

    for (const form of forms) {
      await test.step(`Test ${form} form`, async () => {
        await TestHelpers.selectPoetryForm(page, form);
        await expect(page.locator(SELECTORS.FORM_SELECTOR)).toHaveValue(form);

        // Verify form structure is displayed correctly
        const expectedLines = await page.locator(SELECTORS.EDITOR.LINE_INPUT(0));
        await expect(expectedLines).toBeVisible();
      });
    }
  }

  static async testWordSuggestions(page: Page): Promise<void> {
    await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.HAIKU);

    // Fill a line with incorrect syllable count to trigger suggestions
    const firstLine = page.locator(SELECTORS.EDITOR.LINE_INPUT(0));
    await firstLine.fill('A very long line that exceeds syllable limit');

    // Wait for analysis to complete
    await page.waitForTimeout(1000);

    // Click on a word to see suggestions (this might need adjustment based on actual implementation)
    const wordTokens = page.locator(SELECTORS.RESULTS.WORD_TOKENS);
    const firstWord = wordTokens.first();

    if (await firstWord.isVisible()) {
      await firstWord.click();

      // Verify suggestions appear
      const suggestionsPanel = page.locator(SELECTORS.SUGGESTIONS.CONTAINER);
      await expect(suggestionsPanel).toBeVisible({ timeout: 5000 });
    }
  }

  static async testRhythmAndMeter(page: Page): Promise<void> {
    await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.HAIKU);
    await TestHelpers.loadExample(page);
    await TestHelpers.waitForAnalysis(page);

    // Navigate to rhythm analysis tab
    const rhythmTab = page.locator(SELECTORS.ANALYSIS_TABS.RHYTHM);
    if (await rhythmTab.isVisible()) {
      await rhythmTab.click();

      // Verify rhythm analysis content
      const meterAnalysis = page.locator(SELECTORS.RESULTS.METER_ANALYSIS);
      await expect(meterAnalysis).toBeVisible();
    }
  }

  static async testQualityAssessment(page: Page): Promise<void> {
    await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.TANKA);
    await TestHelpers.loadExample(page);
    await TestHelpers.waitForAnalysis(page);

    // Navigate to quality assessment tab
    const qualityTab = page.locator(SELECTORS.ANALYSIS_TABS.QUALITY);
    if (await qualityTab.isVisible()) {
      await qualityTab.click();

      // Verify quality metrics are displayed
      const qualityMetrics = page.locator(SELECTORS.RESULTS.QUALITY_METRICS);
      await expect(qualityMetrics).toBeVisible();

      const qualityScore = page.locator(SELECTORS.RESULTS.QUALITY_SCORE);
      await expect(qualityScore).toBeVisible();
    }
  }

  static async testAdvancedAnalysisFeatures(page: Page): Promise<void> {
    await test.step('Test all analysis tabs', async () => {
      const analysisTabs = [
        SELECTORS.ANALYSIS_TABS.STRUCTURE,
        SELECTORS.ANALYSIS_TABS.RHYTHM,
        SELECTORS.ANALYSIS_TABS.QUALITY,
        SELECTORS.ANALYSIS_TABS.STATS,
      ];

      for (const tab of analysisTabs) {
        const tabElement = page.locator(`[data-tab="${tab}"]`);
        if (await tabElement.isVisible()) {
          await tabElement.click();
          await page.waitForTimeout(500);

          // Verify tab content is displayed
          const tabContent = page.locator(`[data-tab-content="${tab}"]`);
          await expect(tabContent).toBeVisible();
        }
      }
    });

    await test.step('Test word interaction', async () => {
      const clickableWords = page.locator(SELECTORS.RESULTS.CLICKABLE_WORDS);
      const firstWord = clickableWords.first();

      if (await firstWord.isVisible()) {
        await firstWord.click();

        // Verify word details or suggestions appear
        const wordDetails = page.locator(SELECTORS.RESULTS.WORD_DETAILS);
        await expect(wordDetails).toBeVisible({ timeout: 3000 });
      }
    });
  }
}
