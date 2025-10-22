import { test, expect } from '@playwright/test';
import { SELECTORS, TestHelpers } from '../src/e2e/selectors';

test.describe('State Management Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-poem-editor')).toBeVisible();
  });

  test('form selection should maintain state across interactions', async ({ page }) => {
    const formSelector = page.locator(SELECTORS.FORM_SELECTOR);

    await test.step('Initial state and form change', async () => {
      await expect(formSelector).toHaveValue(SELECTORS.FORM_OPTIONS.HAIKU);
      await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.TANKA);
      await expect(formSelector).toHaveValue(SELECTORS.FORM_OPTIONS.TANKA);
    });

    await test.step('State persistence after reload', async () => {
      await page.reload();
      await page.waitForSelector(SELECTORS.FORM_SELECTOR, { state: 'visible' });
      await expect(formSelector).toHaveValue(SELECTORS.FORM_OPTIONS.TANKA);
    });

    await test.step('State maintenance during complex interactions', async () => {
      await TestHelpers.loadExample(page);
      await expect(formSelector).toHaveValue(SELECTORS.FORM_OPTIONS.TANKA);

      await TestHelpers.clearEditor(page);
      await expect(formSelector).toHaveValue(SELECTORS.FORM_OPTIONS.TANKA);

      await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.HAIKU);
      await expect(formSelector).toHaveValue(SELECTORS.FORM_OPTIONS.HAIKU);
    });
  });
});
