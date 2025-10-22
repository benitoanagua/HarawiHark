import { test, expect } from '@playwright/test';
import { getPoetryFormTestData, getMockPoetryData } from '../src/app/data';

const POETRY_FORMS = getPoetryFormTestData();
const MOCK_DATA = getMockPoetryData();

test.describe('Poetry Editor - Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-poem-editor')).toBeVisible();
  });

  test('should load with default haiku form and correct structure', async ({ page }) => {
    const formSelector = page.locator('#poetry-form-selector');
    await expect(formSelector).toBeVisible();
    await expect(formSelector).toHaveValue('haiku');

    const lineInputs = page.locator('#poem-editor input.line-input');
    await expect(lineInputs).toHaveCount(POETRY_FORMS.haiku.lines);

    const syllableCounters = page.locator('.syllable-count');
    await expect(syllableCounters).toHaveCount(POETRY_FORMS.haiku.lines);
    await expect(syllableCounters.first()).toContainText(`/${POETRY_FORMS.haiku.pattern[0]}`);
  });

  test('should change line count when selecting different poetry forms', async ({ page }) => {
    const formSelector = page.locator('#poetry-form-selector');
    const lineInputs = page.locator('#poem-editor input.line-input');

    const testForms = [
      { form: 'tanka', expectedLines: POETRY_FORMS.tanka.lines },
      { form: 'cinquain', expectedLines: POETRY_FORMS.cinquain.lines },
      { form: 'diamante', expectedLines: POETRY_FORMS.diamante.lines },
      { form: 'fibonacci', expectedLines: POETRY_FORMS.fibonacci.lines },
      { form: 'haiku', expectedLines: POETRY_FORMS.haiku.lines },
    ];

    for (const { form, expectedLines } of testForms) {
      await test.step(`Change to ${form} form`, async () => {
        await formSelector.selectOption(form);
        await expect(formSelector).toHaveValue(form);
        await expect(lineInputs).toHaveCount(expectedLines);

        const syllableCounters = page.locator('.syllable-count');
        await expect(syllableCounters).toHaveCount(expectedLines);
      });
    }
  });

  test('should automatically load examples when editor is empty', async ({ page }) => {
    await page.click('button:has-text("Clear")');
    await page.selectOption('#poetry-form-selector', 'tanka');
    await page.waitForTimeout(1000);

    const firstLine = page.locator('#poem-editor-line-0');
    await expect(firstLine).not.toBeEmpty();

    const lineContent = await firstLine.inputValue();
    expect(lineContent.length).toBeGreaterThan(0);
  });

  test('should preserve existing content when changing forms', async ({ page }) => {
    const customContent = 'My custom poem';
    await page.locator('#poem-editor-line-0').fill(customContent);
    await page.selectOption('#poetry-form-selector', 'fibonacci');
    await expect(page.locator('#poem-editor-line-0')).toHaveValue(customContent);
  });

  test('should update syllable counters in real-time', async ({ page }) => {
    const firstLine = page.locator('#poem-editor-line-0');
    const syllableCounter = page.locator('.syllable-count').first();

    await expect(syllableCounter).toContainText(`/${POETRY_FORMS.haiku.pattern[0]}`);
    await firstLine.fill('Hello world');
    await page.waitForTimeout(300);

    const counterText = await syllableCounter.textContent();
    expect(counterText).not.toContain('0/');

    await firstLine.fill('A longer poetic line for testing syllables');
    await page.waitForTimeout(300);

    const updatedCounterText = await syllableCounter.textContent();
    expect(updatedCounterText).not.toContain('0/');
  });

  test('should handle rapid form changes without issues', async ({ page }) => {
    const formSelector = page.locator('#poetry-form-selector');
    const rapidForms = ['haiku', 'tanka', 'limerick', 'haiku'];

    for (const form of rapidForms) {
      await formSelector.selectOption(form);
      await expect(formSelector).toHaveValue(form);
      await page.waitForTimeout(100);
    }

    await expect(formSelector).toHaveValue('haiku');
    await expect(page.locator('#poem-editor input.line-input')).toHaveCount(
      POETRY_FORMS.haiku.lines
    );
  });

  test('should show appropriate syllable counters for each form', async ({ page }) => {
    const formSelector = page.locator('#poetry-form-selector');
    const syllableCounters = page.locator('.syllable-count');

    const formTests = [
      {
        form: 'haiku',
        expectedCounts: POETRY_FORMS.haiku.pattern.map((p) => `/${p}`),
      },
      {
        form: 'tanka',
        expectedCounts: POETRY_FORMS.tanka.pattern.map((p) => `/${p}`),
      },
      {
        form: 'cinquain',
        expectedCounts: POETRY_FORMS.cinquain.pattern.map((p) => `/${p}`),
      },
    ];

    for (const { form, expectedCounts } of formTests) {
      await test.step(`Check ${form} syllable counters`, async () => {
        await formSelector.selectOption(form);

        for (let i = 0; i < expectedCounts.length; i++) {
          const counter = syllableCounters.nth(i);
          await expect(counter).toContainText(expectedCounts[i]);
        }
      });
    }
  });

  test('should handle poems with syllable errors', async ({ page }) => {
    const errorExample = MOCK_DATA['haikuWithErrors'];

    for (let i = 0; i < errorExample.length; i++) {
      await page.locator(`#poem-editor-line-${i}`).fill(errorExample[i]);
    }

    const syllableCounters = page.locator('.syllable-count');
    for (let i = 0; i < POETRY_FORMS.haiku.lines; i++) {
      const counter = syllableCounters.nth(i);
      const text = await counter.textContent();
      expect(text).toBeDefined();
    }
  });
});
