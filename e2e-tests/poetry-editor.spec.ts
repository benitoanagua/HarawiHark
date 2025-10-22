import { test, expect } from '@playwright/test';
import { SELECTORS, TestHelpers } from '../src/e2e/selectors';
import { AdvancedInteractions } from '../src/e2e/advanced-interactions';

test.describe('Poetry Editor - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-poem-editor')).toBeVisible({ timeout: 10000 });
  });

  test('should support all 8 poetry forms with correct structure', async ({ page }) => {
    await AdvancedInteractions.testAllPoetryForms(page);
  });

  test('should provide real-time syllable validation', async ({ page }) => {
    await page.waitForSelector(SELECTORS.EDITOR.LINE_INPUT(0), { timeout: 5000 });

    const firstLine = page.locator(SELECTORS.EDITOR.LINE_INPUT(0));
    const syllableCounter = page.locator('.syllable-count').first();

    const testCases = [
      { text: 'Hello', expectedPattern: /\d+\/5/ },
      { text: 'Beautiful sunset', expectedPattern: /\d+\/5/ },
      { text: 'The quick brown fox jumps over', expectedPattern: /\d+\/5/ },
      { text: '', expectedPattern: /0\/5/ },
    ];

    for (const { text, expectedPattern } of testCases) {
      await test.step(`Syllable counter for: "${text}"`, async () => {
        await firstLine.fill(text);

        await page.waitForFunction(
          (pattern) => {
            const counter = document.querySelector('.syllable-count');
            return counter && pattern.test(counter.textContent || '');
          },
          expectedPattern,
          { timeout: 5000 }
        );

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
    await expect(firstLine).not.toBeEmpty({ timeout: 5000 });

    const lineContent = await firstLine.inputValue();
    expect(lineContent.length).toBeGreaterThan(0);

    const analyzeButton = page.locator(SELECTORS.BUTTONS.ANALYZE);
    await expect(analyzeButton.first()).toBeEnabled({ timeout: 5000 });
  });

  test('should validate multiple poetry forms structure', async ({ page }) => {
    const forms = [
      { id: SELECTORS.FORM_OPTIONS.HAIKU, lines: 3, pattern: [5, 7, 5] },
      { id: SELECTORS.FORM_OPTIONS.TANKA, lines: 5, pattern: [5, 7, 5, 7, 7] },
      { id: SELECTORS.FORM_OPTIONS.CINQUAIN, lines: 5, pattern: [2, 4, 6, 8, 2] },
    ];

    for (const form of forms) {
      await test.step(`Validating ${form.id} structure`, async () => {
        await TestHelpers.selectPoetryForm(page, form.id);

        const formSelector = page.locator(SELECTORS.FORM_SELECTOR);
        await expect(formSelector).toHaveValue(form.id);

        for (let i = 0; i < form.lines; i++) {
          const lineInput = page.locator(SELECTORS.EDITOR.LINE_INPUT(i));
          await expect(lineInput).toBeVisible();
        }
      });
    }
  });
});
