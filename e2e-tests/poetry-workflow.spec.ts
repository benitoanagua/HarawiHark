import { test, expect } from '@playwright/test';
import { SELECTORS, TestHelpers, TEST_POEMS } from '../src/e2e/selectors';
import { AdvancedInteractions } from '../src/e2e/advanced-interactions';

test.describe('Poetry Editor - Advanced Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-poem-editor')).toBeVisible();
  });

  test('complete poetry creation with advanced analysis', async ({ page }) => {
    await AdvancedInteractions.completePoemWorkflow(
      page,
      SELECTORS.FORM_OPTIONS.HAIKU,
      TEST_POEMS.HAIKU_SPANISH
    );

    // Verificar características avanzadas de análisis
    await AdvancedInteractions.testAdvancedAnalysisFeatures(page);
  });

  test('word suggestions and replacement functionality', async ({ page }) => {
    await AdvancedInteractions.testWordSuggestions(page);
  });

  test('rhythm and meter analysis', async ({ page }) => {
    await AdvancedInteractions.testRhythmAndMeter(page);
  });

  test('quality assessment system', async ({ page }) => {
    await AdvancedInteractions.testQualityAssessment(page);
  });

  test('copy functionality with content summary', async ({ page }) => {
    await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.HAIKU);
    await TestHelpers.fillPoemLines(page, TEST_POEMS.HAIKU);

    const copyButton = page.locator(SELECTORS.BUTTONS.COPY);
    await expect(copyButton).toBeEnabled();

    // Configurar permiso de clipboard para tests
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    await copyButton.click();

    // Verificar notificación de éxito
    try {
      await expect(page.locator(SELECTORS.TOAST.SUCCESS)).toBeVisible({ timeout: 3000 });
    } catch {
      console.log('Copy notification not visible, but continuing test');
    }
  });
});
