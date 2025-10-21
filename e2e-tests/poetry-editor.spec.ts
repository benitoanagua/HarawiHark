import { test, expect } from '@playwright/test';

// Datos de prueba basados en los resultados del test manual
const POETRY_FORMS = {
  haiku: { lines: 3, pattern: '5-7-5' },
  tanka: { lines: 5, pattern: '5-7-5-7-7' },
  cinquain: { lines: 5, pattern: '2-4-6-8-2' },
  limerick: { lines: 5, pattern: '8-8-5-5-8' },
  diamante: { lines: 7, pattern: '1-2-3-4-3-2-1' },
  fibonacci: { lines: 6, pattern: '1-1-2-3-5-8' },
};

test.describe('Poetry Editor - Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-poem-editor')).toBeVisible();
  });

  test('should load with default haiku form and correct structure', async ({ page }) => {
    // Verificar select inicial
    const formSelector = page.locator('#poetry-form-selector');
    await expect(formSelector).toBeVisible();
    await expect(formSelector).toHaveValue('haiku');

    // Verificar líneas del editor
    const lineInputs = page.locator('#poem-editor input.line-input');
    await expect(lineInputs).toHaveCount(3);

    // Verificar contadores de sílabas
    const syllableCounters = page.locator('.syllable-count');
    await expect(syllableCounters).toHaveCount(3);
    await expect(syllableCounters.first()).toContainText('/5');
  });

  test('should change line count when selecting different poetry forms', async ({ page }) => {
    const formSelector = page.locator('#poetry-form-selector');
    const lineInputs = page.locator('#poem-editor input.line-input');

    // Probar múltiples formularios
    const testForms = [
      { form: 'tanka', expectedLines: 5 },
      { form: 'cinquain', expectedLines: 5 },
      { form: 'diamante', expectedLines: 7 },
      { form: 'fibonacci', expectedLines: 6 },
      { form: 'haiku', expectedLines: 3 },
    ];

    for (const { form, expectedLines } of testForms) {
      await test.step(`Change to ${form} form`, async () => {
        await formSelector.selectOption(form);
        await expect(formSelector).toHaveValue(form);
        await expect(lineInputs).toHaveCount(expectedLines);

        // Verificar que los contadores se actualizan
        const syllableCounters = page.locator('.syllable-count');
        await expect(syllableCounters).toHaveCount(expectedLines);
      });
    }
  });

  test('should automatically load examples when editor is empty', async ({ page }) => {
    // Limpiar editor primero
    await page.click('button:has-text("clear")');

    // Cambiar a tanka con editor vacío
    await page.selectOption('#poetry-form-selector', 'tanka');

    // Esperar a que cargue el ejemplo automáticamente
    await page.waitForTimeout(1000);

    // Verificar que se cargó ejemplo automáticamente
    const firstLine = page.locator('#poem-editor-line-0');
    await expect(firstLine).not.toBeEmpty();

    // Verificar que tiene contenido de ejemplo (puede variar)
    const lineContent = await firstLine.inputValue();
    expect(lineContent.length).toBeGreaterThan(0);
  });

  test('should preserve existing content when changing forms', async ({ page }) => {
    // Escribir contenido personalizado
    const customContent = 'Mi poema personalizado';
    await page.locator('#poem-editor-line-0').fill(customContent);

    // Cambiar formulario
    await page.selectOption('#poetry-form-selector', 'fibonacci');

    // Verificar que el contenido se preserva
    await expect(page.locator('#poem-editor-line-0')).toHaveValue(customContent);
  });

  test('should update syllable counters in real-time', async ({ page }) => {
    const firstLine = page.locator('#poem-editor-line-0');
    const syllableCounter = page.locator('.syllable-count').first();

    // Verificar estado inicial
    await expect(syllableCounter).toContainText('/5');

    // Escribir texto y verificar contador se actualiza
    await firstLine.fill('Hello world');
    await page.waitForTimeout(300); // Esperar actualización

    // El contador debería mostrar algo diferente de 0
    const counterText = await syllableCounter.textContent();
    expect(counterText).not.toContain('0/5');

    // Escribir más texto
    await firstLine.fill('A longer poetic line for testing syllables');
    await page.waitForTimeout(300);

    const updatedCounterText = await syllableCounter.textContent();
    expect(updatedCounterText).not.toContain('0/5');
  });

  test('should handle rapid form changes without issues', async ({ page }) => {
    const formSelector = page.locator('#poetry-form-selector');
    const rapidForms = ['haiku', 'tanka', 'limerick', 'haiku'];

    for (const form of rapidForms) {
      await formSelector.selectOption(form);
      await expect(formSelector).toHaveValue(form);
      await page.waitForTimeout(100); // Pequeña pausa entre cambios
    }

    // Verificar estado estable final
    await expect(formSelector).toHaveValue('haiku');
    await expect(page.locator('#poem-editor input.line-input')).toHaveCount(3);
  });

  test('should show appropriate syllable counters for each form', async ({ page }) => {
    const formSelector = page.locator('#poetry-form-selector');
    const syllableCounters = page.locator('.syllable-count');

    // Probar diferentes formularios y sus patrones
    const formTests = [
      { form: 'haiku', expectedCounts: ['/5', '/7', '/5'] },
      { form: 'tanka', expectedCounts: ['/5', '/7', '/5', '/7', '/7'] },
      { form: 'cinquain', expectedCounts: ['/2', '/4', '/6', '/8', '/2'] },
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
});
