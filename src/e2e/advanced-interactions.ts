import { test, expect } from '@playwright/test';
import { SELECTORS, TestHelpers, TEST_POEMS } from './selectors';

export const AdvancedInteractions = {
  async completePoemWorkflow(page: any, form: string, poemLines: string[]) {
    await test.step(`Complete workflow for ${form}`, async () => {
      await TestHelpers.selectPoetryForm(page, form);

      await TestHelpers.fillPoemLines(page, poemLines);

      await expect(page.locator(SELECTORS.STATS.LINES)).toBeVisible();
      await expect(page.locator(SELECTORS.STATS.SYLLABLES)).toBeVisible();

      await TestHelpers.analyzePoem(page);

      await TestHelpers.navigateToResults(page);

      await TestHelpers.waitForAnalysisComplete(page);
    });
  },

  async testAllPoetryForms(page: any) {
    const forms = [
      SELECTORS.FORM_OPTIONS.HAIKU,
      SELECTORS.FORM_OPTIONS.TANKA,
      SELECTORS.FORM_OPTIONS.CINQUAIN,
      SELECTORS.FORM_OPTIONS.LIMERICK,
      SELECTORS.FORM_OPTIONS.DIAMANTE,
      SELECTORS.FORM_OPTIONS.FIBONACCI,
    ];

    for (const form of forms) {
      await test.step(`Testing ${form} form`, async () => {
        await TestHelpers.selectPoetryForm(page, form);

        const lineInputs = page.locator(SELECTORS.EDITOR.LINE_INPUTS);
        await expect(lineInputs).toHaveCount(await this.getExpectedLineCount(form));

        await TestHelpers.loadExample(page);
        const firstLine = page.locator(SELECTORS.EDITOR.LINE_INPUT(0));
        await expect(firstLine).not.toBeEmpty();
      });
    }
  },

  async testAdvancedAnalysisFeatures(page: any) {
    await test.step('Test advanced analysis features', async () => {
      await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.HAIKU);
      await TestHelpers.fillPoemLines(page, TEST_POEMS.HAIKU_SPANISH);
      await TestHelpers.analyzePoem(page);
      await TestHelpers.navigateToResults(page);

      await expect(page.locator(SELECTORS.ANALYSIS.TABS.STRUCTURE)).toBeVisible();
      await expect(page.locator(SELECTORS.ANALYSIS.TABS.RHYTHM)).toBeVisible();
      await expect(page.locator(SELECTORS.ANALYSIS.TABS.QUALITY)).toBeVisible();
      await expect(page.locator(SELECTORS.ANALYSIS.TABS.STATS)).toBeVisible();

      await page.locator(SELECTORS.ANALYSIS.TABS.QUALITY).click();
      await expect(page.locator(SELECTORS.ANALYSIS.QUALITY_SCORE)).toBeVisible();
      await expect(page.locator(SELECTORS.ANALYSIS.QUALITY_GRADE)).toBeVisible();

      await page.locator(SELECTORS.ANALYSIS.TABS.RHYTHM).click();
      await expect(page.locator(SELECTORS.ANALYSIS.METER_TYPE)).toBeVisible();

      await page.locator(SELECTORS.ANALYSIS.TABS.STRUCTURE).click();
      await expect(page.locator(SELECTORS.ANALYSIS.RHYME_SCHEME)).toBeVisible();
    });
  },

  async testWordSuggestions(page: any) {
    await test.step('Test word suggestions functionality', async () => {
      await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.HAIKU);
      await TestHelpers.fillPoemLines(page, TEST_POEMS.ERROR_EXAMPLES.HAIKU_TOO_LONG);
      await TestHelpers.analyzePoem(page);

      const misalignedWord = page.locator('.word-token:has-text("forest")').first();
      if (await misalignedWord.isVisible()) {
        await misalignedWord.click();
        await expect(page.locator(SELECTORS.ANALYSIS.WORD_ALTERNATIVES)).toBeVisible();

        const replaceButton = page.locator('button:has-text("use")').first();
        if (await replaceButton.isVisible()) {
          await replaceButton.click();
          await expect(page.locator(SELECTORS.TOAST.SUCCESS)).toBeVisible();
        }
      }
    });
  },

  async testRhythmAndMeter(page: any) {
    await test.step('Test rhythm and meter analysis', async () => {
      await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.LIMERICK);
      await TestHelpers.loadExample(page);
      await TestHelpers.analyzePoem(page);
      await TestHelpers.navigateToResults(page);

      await page.locator(SELECTORS.ANALYSIS.TABS.RHYTHM).click();
      const meterText = await page.locator(SELECTORS.ANALYSIS.METER_TYPE).textContent();
      expect(meterText).toBeTruthy();

      const rhythmSuggestions = page.locator(SELECTORS.ANALYSIS.SUGGESTIONS);
      if (await rhythmSuggestions.isVisible()) {
        const suggestionCount = await rhythmSuggestions.count();
        expect(suggestionCount).toBeGreaterThan(0);
      }
    });
  },

  async testQualityAssessment(page: any) {
    await test.step('Test quality assessment system', async () => {
      const testCases = [
        { poem: TEST_POEMS.HAIKU, description: 'well-structured haiku' },
        { poem: TEST_POEMS.ERROR_EXAMPLES.HAIKU_TOO_SHORT, description: 'poorly structured haiku' },
      ];

      for (const { poem, description } of testCases) {
        await test.step(`Quality assessment for ${description}`, async () => {
          await TestHelpers.clearEditor(page);
          await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.HAIKU);
          await TestHelpers.fillPoemLines(page, poem);
          await TestHelpers.analyzePoem(page);
          await TestHelpers.navigateToResults(page);

          await page.locator(SELECTORS.ANALYSIS.TABS.QUALITY).click();

          const scoreElement = page.locator(SELECTORS.ANALYSIS.QUALITY_SCORE);
          await expect(scoreElement).toBeVisible();

          const scoreText = await scoreElement.textContent();
          const score = parseFloat(scoreText || '0');
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);

          const gradeElement = page.locator(SELECTORS.ANALYSIS.QUALITY_GRADE);
          await expect(gradeElement).toBeVisible();
        });
      }
    });
  },

  async getExpectedLineCount(form: string): Promise<number> {
    const lineCounts: Record<string, number> = {
      [SELECTORS.FORM_OPTIONS.HAIKU]: 3,
      [SELECTORS.FORM_OPTIONS.TANKA]: 5,
      [SELECTORS.FORM_OPTIONS.CINQUAIN]: 5,
      [SELECTORS.FORM_OPTIONS.LIMERICK]: 5,
      [SELECTORS.FORM_OPTIONS.DIAMANTE]: 7,
      [SELECTORS.FORM_OPTIONS.FIBONACCI]: 6,
      [SELECTORS.FORM_OPTIONS.REDONDILLA]: 4,
      [SELECTORS.FORM_OPTIONS.LANTERNE]: 5,
    };
    return lineCounts[form] || 3;
  },
};
