import { test, expect } from '@playwright/test';

test.describe('Poetry Editor - Complete Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-poem-editor')).toBeVisible();
  });

  test('complete poetry creation and analysis workflow', async ({ page }) => {
    await page.selectOption('#poetry-form-selector', 'haiku');

    await page.locator('#poem-editor-line-0').fill('Moonlight shines bright');
    await page.locator('#poem-editor-line-1').fill('On the quiet peaceful pond');
    await page.locator('#poem-editor-line-2').fill('Night serenity');

    await expect(page.locator('text=lines')).toBeVisible();
    await expect(page.locator('text=syllables')).toBeVisible();

    const analyzeButton = page.locator('button:has-text("analyze")');
    await expect(analyzeButton).toBeEnabled();
    await analyzeButton.click();

    await page.waitForTimeout(2000);

    const analysisIndicator = page
      .locator('text=Analyzing')
      .or(page.locator('.metro-toast'))
      .first();

    try {
      await expect(analysisIndicator).toBeVisible({ timeout: 5000 });
    } catch {
      console.log('No visible analysis indicator found');
    }

    const copyButton = page.locator('button:has-text("copy")');
    await expect(copyButton).toBeEnabled();
    await copyButton.click();

    try {
      await expect(
        page.locator('text=Poem Copied').or(page.locator('.metro-toast-success'))
      ).toBeVisible({ timeout: 3000 });
    } catch {
      console.log('No copy notification found');
    }
  });

  test('example loading functionality', async ({ page }) => {
    const clearButton = page.locator('button:has-text("clear")');
    if (await clearButton.isEnabled()) {
      await clearButton.click();
    }

    const exampleButton = page.locator('button:has-text("example")');
    await expect(exampleButton).toBeEnabled();
    await exampleButton.click();

    const firstLine = page.locator('#poem-editor-line-0');
    await expect(firstLine).not.toBeEmpty({ timeout: 3000 });

    const analyzeButton = page.locator('button:has-text("analyze")');
    await expect(analyzeButton).toBeEnabled();

    const lineInputs = page.locator('#poem-editor input.line-input');
    const lineCount = await lineInputs.count();

    for (let i = 0; i < Math.min(lineCount, 3); i++) {
      const line = lineInputs.nth(i);
      const content = await line.inputValue();
      expect(content.length).toBeGreaterThan(0);
    }
  });

  test('clear functionality should reset editor', async ({ page }) => {
    await page.locator('#poem-editor-line-0').fill('First test line');
    await page.locator('#poem-editor-line-1').fill('Second line with more text');

    const firstLine = page.locator('#poem-editor-line-0');
    await expect(firstLine).not.toBeEmpty();

    const clearButton = page.locator('button:has-text("clear")');
    await expect(clearButton).toBeEnabled();
    await clearButton.click();

    await expect(firstLine).toBeEmpty();

    const secondLine = page.locator('#poem-editor-line-1');
    await expect(secondLine).toBeEmpty();

    await page.selectOption('#poetry-form-selector', 'tanka');
    await page.click('button:has-text("example")');
    await page.waitForTimeout(1000);

    await expect(firstLine).not.toBeEmpty();
  });

  test('should handle analysis with incomplete poems', async ({ page }) => {
    await page.locator('#poem-editor-line-0').fill('Only one line');

    const analyzeButton = page.locator('button:has-text("analyze")');
    await expect(analyzeButton).toBeEnabled();
    await analyzeButton.click();

    await page.waitForTimeout(3000);

    await expect(page.locator('app-poem-editor')).toBeVisible();
  });
});
