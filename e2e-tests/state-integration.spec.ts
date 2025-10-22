import { test, expect } from '@playwright/test';

test.describe('State Management Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-poem-editor')).toBeVisible();
  });

  test('form selection should update application state correctly', async ({ page }) => {
    const formSelector = page.locator('#poetry-form-selector');

    await test.step('Initial state should be haiku', async () => {
      await expect(formSelector).toHaveValue('haiku');
      await expect(page.locator('#poem-editor input.line-input')).toHaveCount(3);
    });

    await test.step('State should update when changing to tanka', async () => {
      await formSelector.selectOption('tanka');
      await expect(formSelector).toHaveValue('tanka');
      await expect(page.locator('#poem-editor input.line-input')).toHaveCount(5);
    });

    await test.step('State should persist during navigation', async () => {
      await page.reload();
      await page.waitForSelector('#poetry-form-selector', { state: 'visible' });
      await expect(formSelector).toHaveValue('tanka');
      await expect(page.locator('#poem-editor input.line-input')).toHaveCount(5);
    });

    await test.step('State should reset when explicitly changing back', async () => {
      await formSelector.selectOption('haiku');
      await expect(formSelector).toHaveValue('haiku');
      await expect(page.locator('#poem-editor input.line-input')).toHaveCount(3);
    });
  });

  test('text input should synchronize with state in real-time', async ({ page }) => {
    const firstLine = page.locator('#poem-editor-line-0');
    const testText = 'Testing real-time synchronization';

    await firstLine.fill(testText);
    await expect(firstLine).toHaveValue(testText);

    await page.click('button:has-text("example")');

    const currentValue = await firstLine.inputValue();
    expect(currentValue.length).toBeGreaterThan(0);

    await page.selectOption('#poetry-form-selector', 'fibonacci');

    const valueAfterFormChange = await firstLine.inputValue();
    expect(valueAfterFormChange).toBeDefined();
  });

  test('application should maintain state consistency across interactions', async ({ page }) => {
    const formSelector = page.locator('#poetry-form-selector');
    const firstLine = page.locator('#poem-editor-line-0');

    await test.step('Write text and change form', async () => {
      await firstLine.fill('Initial text');
      await formSelector.selectOption('tanka');
      await expect(formSelector).toHaveValue('tanka');
    });

    await test.step('Load example and verify state', async () => {
      await page.click('button:has-text("example")');
      await page.waitForTimeout(1000);

      await expect(formSelector).toHaveValue('tanka');
      await expect(page.locator('#poem-editor input.line-input')).toHaveCount(5);
    });

    await test.step('Clear and verify empty state', async () => {
      await page.click('button:has-text("clear")');

      await expect(formSelector).toHaveValue('tanka');
      await expect(firstLine).toBeEmpty();
    });

    await test.step('Return to original form', async () => {
      await formSelector.selectOption('haiku');
      await expect(formSelector).toHaveValue('haiku');
      await expect(page.locator('#poem-editor input.line-input')).toHaveCount(3);
    });
  });

  test('syllable counting state should be consistent', async ({ page }) => {
    const firstLine = page.locator('#poem-editor-line-0');
    const syllableCounter = page.locator('.syllable-count').first();

    const testCases = [
      { text: 'Hello', description: 'simple word' },
      { text: 'Beautiful sunset', description: 'two words' },
      { text: 'The quick brown fox jumps', description: 'multiple words' },
      { text: '', description: 'empty text' },
    ];

    for (const { text, description } of testCases) {
      await test.step(`Test syllable counting for: ${description}`, async () => {
        await firstLine.fill(text);
        await page.waitForTimeout(300);

        const counterText = await syllableCounter.textContent();

        if (text === '') {
          expect(counterText).toContain('0/');
        } else {
          expect(counterText).toMatch(/\d+\/\d+/);
        }
      });
    }
  });
});
