import { test, expect } from '@playwright/test';
import { SELECTORS, TestHelpers } from '../src/e2e/selectors';
import { AdvancedInteractions } from '../src/e2e/advanced-interactions';

test.describe('Poetry Editor - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-poem-editor')).toBeVisible();
  });

  test('should support all 8 poetry forms with correct structure', async ({ page }) => {
    await AdvancedInteractions.testAllPoetryForms(page);
  });

  test('should provide real-time syllable validation', async ({ page }) => {
    const firstLine = page.locator(SELECTORS.EDITOR.LINE_INPUT(0));
    const syllableCounter = page.locator(SELECTORS.EDITOR.SYLLABLE_COUNTER(0));

    const testCases = [
      { text: 'Hello', expectedPattern: /\d+\/5/ },
      { text: 'Beautiful sunset', expectedPattern: /\d+\/5/ },
      { text: 'The quick brown fox jumps over', expectedPattern: /\d+\/5/ },
      { text: '', expectedPattern: /0\/5/ },
    ];

    for (const { text, expectedPattern } of testCases) {
      await test.step(`Syllable counter for: "${text}"`, async () => {
        await firstLine.fill(text);
        await page.waitForTimeout(300);

        const counterText = await syllableCounter.textContent();
        expect(counterText).toMatch(expectedPattern);
      });
    }
  });

  test('should handle example loading and automatic analysis', async ({ page }) => {
    await TestHelpers.clearEditor(page);
    await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.TANKA);
    await TestHelpers.loadExample(page);

    const firstLine = page.locator(SELECTORS.EDITOR.LINE_INPUT(0));
    await expect(firstLine).not.toBeEmpty();

    // El ejemplo debería cargar contenido automáticamente
    const lineContent = await firstLine.inputValue();
    expect(lineContent.length).toBeGreaterThan(0);

    // Verificar que el análisis está disponible
    const analyzeButton = page.locator(SELECTORS.BUTTONS.ANALYZE);
    await expect(analyzeButton).toBeEnabled();
  });
});
