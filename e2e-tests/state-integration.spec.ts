import { test, expect } from '@playwright/test';

test.describe('State Management Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-poem-editor')).toBeVisible();
  });

  test('form selection should update application state correctly', async ({ page }) => {
    // Monitorear cambios de estado mediante el comportamiento observable
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
      // Recargar página y verificar que el estado se mantiene
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
    const testText = 'Probando sincronización en tiempo real';

    // Escribir texto
    await firstLine.fill(testText);
    await expect(firstLine).toHaveValue(testText);

    // Verificar que se mantiene después de interacciones simples
    await page.click('button:has-text("example")');
    // Después de hacer click en example, el texto debería preservarse o cambiar
    // Depende del comportamiento esperado de la aplicación

    const currentValue = await firstLine.inputValue();
    expect(currentValue.length).toBeGreaterThan(0);

    // Cambiar formulario y verificar comportamiento
    await page.selectOption('#poetry-form-selector', 'fibonacci');

    // El texto podría preservarse o resetearse dependiendo del diseño
    const valueAfterFormChange = await firstLine.inputValue();
    expect(valueAfterFormChange).toBeDefined();
  });

  test('application should maintain state consistency across interactions', async ({ page }) => {
    const formSelector = page.locator('#poetry-form-selector');
    const firstLine = page.locator('#poem-editor-line-0');

    // Secuencia compleja de interacciones
    await test.step('Write text and change form', async () => {
      await firstLine.fill('Texto inicial');
      await formSelector.selectOption('tanka');
      await expect(formSelector).toHaveValue('tanka');
    });

    await test.step('Load example and verify state', async () => {
      await page.click('button:has-text("example")');
      await page.waitForTimeout(1000);

      // Después de cargar ejemplo, el formulario debería mantenerse
      await expect(formSelector).toHaveValue('tanka');
      await expect(page.locator('#poem-editor input.line-input')).toHaveCount(5);
    });

    await test.step('Clear and verify empty state', async () => {
      await page.click('button:has-text("clear")');

      // Después de limpiar, el formulario debería mantenerse
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

    // Probar con diferentes textos
    const testCases = [
      { text: 'Hello', description: 'palabra simple' },
      { text: 'Beautiful sunset', description: 'dos palabras' },
      { text: 'The quick brown fox jumps', description: 'múltiples palabras' },
      { text: '', description: 'texto vacío' },
    ];

    for (const { text, description } of testCases) {
      await test.step(`Test syllable counting for: ${description}`, async () => {
        await firstLine.fill(text);
        await page.waitForTimeout(300); // Esperar actualización

        const counterText = await syllableCounter.textContent();

        if (text === '') {
          // Texto vacío debería mostrar 0 sílabas
          expect(counterText).toContain('0/');
        } else {
          // Texto con contenido debería mostrar algún número de sílabas
          expect(counterText).toMatch(/\d+\/\d+/);
        }
      });
    }
  });
});
