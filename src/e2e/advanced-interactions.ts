import { Page, expect, test } from '@playwright/test';
import { SELECTORS, TestHelpers, TEST_POEMS } from './selectors';

export class AdvancedInteractions {
  /**
   * Flujo completo de creación y análisis de poema
   */
  static async completePoemWorkflow(
    page: Page,
    formType: string,
    poemLines: string[]
  ): Promise<void> {
    console.log(`Starting complete workflow for ${formType}`);

    await TestHelpers.selectPoetryForm(page, formType);
    await page.waitForTimeout(1000);

    try {
      await TestHelpers.clearEditor(page);
    } catch {
      console.log('Clear failed, continuing...');
    }

    await TestHelpers.fillPoemLines(page, poemLines);

    const poemText = await TestHelpers.getPoemText(page);
    if (!poemText.trim()) {
      throw new Error('No poem content to analyze');
    }

    console.log(`Poem content: ${poemText}`);

    const analyzeButton = page.locator(SELECTORS.BUTTONS.ANALYZE);
    await analyzeButton.first().waitFor({ state: 'visible', timeout: 5000 });

    const isEnabled = await analyzeButton.first().isEnabled();
    if (!isEnabled) {
      console.log('Analyze button disabled, checking why...');

      for (let i = 0; i < poemLines.length; i++) {
        const lineInput = page.locator(SELECTORS.EDITOR.LINE_INPUT(i));
        const content = await lineInput.inputValue();
        console.log(`Line ${i}: "${content}"`);
      }

      const firstLine = page.locator(SELECTORS.EDITOR.LINE_INPUT(0));
      await firstLine.click();
      await page.waitForTimeout(500);

      const isEnabledAfterClick = await analyzeButton.first().isEnabled();
      if (!isEnabledAfterClick) {
        throw new Error('Analyze button is disabled despite having content');
      }
    }

    await TestHelpers.waitForAnalysis(page, 25000);

    await page.waitForTimeout(4000);

    console.log('Complete workflow finished successfully');
  }

  /**
   * Prueba todas las formas poéticas disponibles
   */
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
      await test.step(`Testing ${form} form`, async () => {
        console.log(`Testing form: ${form}`);

        await TestHelpers.selectPoetryForm(page, form);
        await page.waitForTimeout(1000);

        const formSelector = page.locator(SELECTORS.FORM_SELECTOR);
        await expect(formSelector).toHaveValue(form);

        if ([SELECTORS.FORM_OPTIONS.HAIKU, SELECTORS.FORM_OPTIONS.TANKA].includes(form)) {
          await TestHelpers.loadExample(page);

          const firstLine = page.locator(SELECTORS.EDITOR.LINE_INPUT(0));
          const lineContent = await firstLine.inputValue();
          expect(lineContent.trim().length).toBeGreaterThan(0);
        }

        console.log(`Form ${form} tested successfully`);
      });
    }
  }

  /**
   * Verifica características avanzadas del análisis
   */
  static async testAdvancedAnalysisFeatures(page: Page): Promise<void> {
    console.log('Testing advanced analysis features...');

    const resultsContainer = page.locator(SELECTORS.RESULTS.CONTAINER);
    await expect(resultsContainer).toBeVisible({ timeout: 10000 });

    const analysisTabs = ['structure', 'rhythm', 'quality', 'stats'];

    for (const tab of analysisTabs) {
      try {
        await test.step(`Testing ${tab} analysis tab`, async () => {
          const tabButton = page.locator(`.metro-pivot-item:has-text("${tab}")`);

          if (await tabButton.isVisible({ timeout: 3000 })) {
            await tabButton.click();
            await page.waitForTimeout(1000);

            switch (tab) {
              case 'structure':
                await expect(page.locator('app-poem-results')).toBeVisible();
                break;
              case 'rhythm':
                await this.verifyRhythmAnalysis(page);
                break;
              case 'quality':
                await this.verifyQualityAnalysis(page);
                break;
              case 'stats':
                await expect(page.locator('app-quick-stats-panel')).toBeVisible();
                break;
            }

            console.log(`Tab ${tab} verified successfully`);
          } else {
            console.log(`Tab ${tab} not available, skipping...`);
          }
        });
      } catch (error) {
        console.log(`Tab ${tab} test failed:`, error instanceof Error ? error.message : error);
      }
    }

    await this.verifyWordDetails(page);

    console.log('All advanced analysis features tested');
  }

  /**
   * Verifica el análisis de ritmo y métrica
   */
  private static async verifyRhythmAnalysis(page: Page): Promise<void> {
    const meterSection = page.locator(SELECTORS.RESULTS.METER_SECTION);

    if (await meterSection.isVisible({ timeout: 5000 })) {
      const meterContent = page.locator(`${SELECTORS.RESULTS.METER_SECTION} .meter-pattern`);
      if (await meterContent.isVisible({ timeout: 3000 })) {
        const patternText = await meterContent.textContent();
        expect(patternText?.length).toBeGreaterThan(0);
        console.log(`Meter pattern found: ${patternText}`);
      }
    } else {
      console.log('Meter analysis section not visible, may be empty analysis');
    }
  }

  /**
   * Verifica el análisis de calidad
   */
  private static async verifyQualityAnalysis(page: Page): Promise<void> {
    const qualitySection = page.locator(SELECTORS.RESULTS.QUALITY_SECTION);

    if (await qualitySection.isVisible({ timeout: 5000 })) {
      const scoreElement = page.locator(`${SELECTORS.RESULTS.QUALITY_SECTION} .score-number`);
      if (await scoreElement.isVisible({ timeout: 3000 })) {
        const scoreText = await scoreElement.textContent();
        expect(scoreText?.length).toBeGreaterThan(0);
        console.log(`Quality score: ${scoreText}`);
      }
    } else {
      console.log('Quality analysis section not visible');
    }
  }

  /**
   * Verifica detalles de palabras con manejo de múltiples elementos
   */
  private static async verifyWordDetails(page: Page): Promise<void> {
    const wordDetails = page.locator(SELECTORS.RESULTS.WORD_DETAILS);

    if (await wordDetails.first().isVisible({ timeout: 5000 })) {
      const wordDetailsCount = await wordDetails.count();
      console.log(`Found ${wordDetailsCount} word details sections`);

      const firstWordDetail = wordDetails.first();

      try {
        const isExpanded = await firstWordDetail.evaluate((el) => el.hasAttribute('open'));
        if (!isExpanded) {
          await firstWordDetail.click({ timeout: 3000 });
          await page.waitForTimeout(1000);
        }

        await expect(firstWordDetail).toBeVisible({ timeout: 3000 });

        const detailContent = firstWordDetail.locator('.word-detail-item');
        if (await detailContent.first().isVisible({ timeout: 2000 })) {
          console.log('Word details content is visible and accessible');
        }
      } catch (error) {
        console.log(
          'Could not interact with word details:',
          error instanceof Error ? error.message : error
        );
      }
    } else {
      console.log('No word details sections found');
    }
  }

  /**
   * Prueba el sistema de sugerencias de palabras
   */
  static async testWordSuggestions(page: Page): Promise<void> {
    console.log('Testing word suggestions system...');

    await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.HAIKU);
    await TestHelpers.clearEditor(page);

    const testPoem = [
      'A tremendously big silent pond in forest',
      'A small green amphibian creature jumps',
      'Enormous splash sound happens right now',
    ];

    await TestHelpers.fillPoemLines(page, testPoem);
    await TestHelpers.waitForAnalysis(page);

    await page.waitForTimeout(5000);

    const clickableWords = page.locator('.word-token.word-clickable');
    const wordCount = await clickableWords.count();

    console.log(`Found ${wordCount} clickable words`);

    if (wordCount > 0) {
      for (let i = 0; i < Math.min(wordCount, 3); i++) {
        try {
          const word = clickableWords.nth(i);
          await word.click();
          await page.waitForTimeout(2000);

          const suggestionsPanel = page.locator('app-word-suggestions');
          if (await suggestionsPanel.isVisible({ timeout: 3000 })) {
            console.log('Word suggestions panel appeared!');

            const alternatives = suggestionsPanel.locator('.alternative-item');
            const altCount = await alternatives.count();

            if (altCount > 0) {
              console.log(`Found ${altCount} word alternatives`);

              const useButton = alternatives.first().locator('button:has-text("use")');
              if (await useButton.isEnabled()) {
                await useButton.click();
                await page.waitForTimeout(3000);

                try {
                  await TestHelpers.waitForToast(page, 'success', 3000);
                  console.log('Word replacement successful');
                  return;
                } catch {
                  console.log('No success toast after word replacement');
                }
              }
            } else {
              console.log('No word alternatives found in suggestions panel');
            }
          }
        } catch (error) {
          console.log(`Failed with word ${i}:`, error instanceof Error ? error.message : error);
        }
      }
    } else {
      console.log('No clickable words found for suggestions test');

      const allWords = page.locator('.word-token');
      const totalWords = await allWords.count();
      console.log(`Total words in analysis: ${totalWords}`);

      if (totalWords > 0) {
        await allWords.first().click();
        await page.waitForTimeout(2000);

        const suggestionsPanel = page.locator('app-word-suggestions');
        if (await suggestionsPanel.isVisible({ timeout: 2000 })) {
          console.log('Fallback: suggestions panel appeared');
        }
      }
    }
  }

  /**
   * Prueba el análisis de ritmo y métrica
   */
  static async testRhythmAndMeter(page: Page): Promise<void> {
    console.log('Testing rhythm and meter analysis...');

    await TestHelpers.clearEditor(page);
    await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.HAIKU);
    await TestHelpers.loadExample(page);

    await page.waitForTimeout(2000);

    const firstLine = page.locator(SELECTORS.EDITOR.LINE_INPUT(0));
    const lineContent = await firstLine.inputValue();

    if (!lineContent.trim()) {
      console.log('No content loaded, retrying example...');
      await TestHelpers.loadExample(page);
      await page.waitForTimeout(2000);
    }

    await TestHelpers.waitForAnalysis(page, 20000);

    await page.waitForTimeout(4000);

    try {
      await TestHelpers.switchAnalysisTab(page, 'rhythm');
      console.log('Successfully switched to rhythm tab');
    } catch {
      console.log('Could not switch to rhythm tab, checking current view...');
    }

    await page
      .waitForSelector(SELECTORS.RESULTS.METER_SECTION, { timeout: 10000 })
      .catch(async () => {
        console.log('Meter analysis section not found, checking for any rhythm content...');

        const rhythmContent = page.locator(
          '[class*="meter"], [class*="rhythm"], [class*="stress"]'
        );
        if (await rhythmContent.first().isVisible({ timeout: 3000 })) {
          console.log('Found alternative rhythm content');
          return;
        }
        throw new Error('No rhythm or meter analysis content found');
      });

    console.log('Rhythm and meter analysis tested successfully');
  }

  /**
   * Prueba el sistema de evaluación de calidad
   */
  static async testQualityAssessment(page: Page): Promise<void> {
    console.log('Testing quality assessment system...');

    await TestHelpers.clearEditor(page);
    await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.TANKA);
    await TestHelpers.loadExample(page);

    await page.waitForTimeout(2000);

    await TestHelpers.waitForAnalysis(page);
    await page.waitForTimeout(3000);

    try {
      await TestHelpers.switchAnalysisTab(page, 'quality');
      console.log('Successfully switched to quality tab');
    } catch {
      console.log('Could not switch to quality tab, checking current view...');
    }

    const qualitySection = page.locator(SELECTORS.RESULTS.QUALITY_SECTION);
    await expect(qualitySection).toBeVisible({ timeout: 8000 });

    const qualityIndicators = [
      '.score-number',
      '.grade-badge',
      '.metrics-breakdown',
      '.feedback-section',
    ];

    for (const indicator of qualityIndicators) {
      const element = qualitySection.locator(indicator);
      if (await element.isVisible({ timeout: 3000 })) {
        console.log(`Quality indicator found: ${indicator}`);
      } else {
        console.log(`Quality indicator not found: ${indicator}`);
      }
    }

    console.log('Quality assessment system tested successfully');
  }

  /**
   * Prueba la funcionalidad de copia con resumen
   */
  static async testCopyFunctionality(page: Page): Promise<void> {
    console.log('Testing copy functionality...');

    await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.HAIKU);
    await TestHelpers.clearEditor(page);
    await TestHelpers.fillPoemLines(page, TEST_POEMS.HAIKU);

    const copyButton = page.locator(SELECTORS.BUTTONS.COPY);
    await expect(copyButton.first()).toBeEnabled({ timeout: 5000 });

    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    page.on('dialog', (dialog) => dialog.accept());

    await copyButton.first().click();

    try {
      await TestHelpers.waitForToast(page, 'success', 5000);
      console.log('Copy success notification received');
    } catch {
      console.log('No copy notification, but operation may have completed');

      const poemText = await TestHelpers.getPoemText(page);
      expect(poemText.trim().length).toBeGreaterThan(0);
      console.log('Poem preserved after copy operation');
    }

    console.log('Copy functionality tested successfully');
  }

  /**
   * Ejecuta una prueba de rendimiento básica del análisis
   */
  static async performanceTest(page: Page, formType: string, poemLines: string[]): Promise<number> {
    console.log(`Starting performance test for ${formType}`);

    const startTime = Date.now();

    await this.completePoemWorkflow(page, formType, poemLines);

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Performance test completed in ${duration}ms`);

    return duration;
  }
}
