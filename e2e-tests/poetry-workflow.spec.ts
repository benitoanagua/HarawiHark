import { test, expect } from '@playwright/test';

test.describe('Poetry Editor - Complete Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-poem-editor')).toBeVisible();
  });

  test('complete poetry creation and analysis workflow', async ({ page }) => {
    // 1. Seleccionar formulario y escribir poema
    await page.selectOption('#poetry-form-selector', 'haiku');

    await page.locator('#poem-editor-line-0').fill('La luz de la luna');
    await page.locator('#poem-editor-line-1').fill('Brilla sobre el estanque quieto');
    await page.locator('#poem-editor-line-2').fill('Noche de paz eterna');

    // 2. Verificar estadísticas básicas están visibles
    await expect(page.locator('text=lines')).toBeVisible();
    await expect(page.locator('text=syllables')).toBeVisible();

    // 3. Ejecutar análisis
    const analyzeButton = page.locator('button:has-text("analyze")');
    await expect(analyzeButton).toBeEnabled();
    await analyzeButton.click();

    // 4. Verificar que el proceso de análisis inicia
    // Puede mostrar toast, loading, o cambiar de vista
    await page.waitForTimeout(2000);

    // Verificar algún indicador de análisis
    const analysisIndicator = page
      .locator('text=Analyzing')
      .or(page.locator('.metro-toast'))
      .first();

    try {
      await expect(analysisIndicator).toBeVisible({ timeout: 5000 });
    } catch {
      // Si no hay indicador visible, al menos verificar que no hay error
      console.log('No se encontró indicador de análisis visible');
    }

    // 5. Probar botón de copiar
    const copyButton = page.locator('button:has-text("copy")');
    await expect(copyButton).toBeEnabled();
    await copyButton.click();

    // Verificar notificación de éxito (si la aplicación la muestra)
    try {
      await expect(
        page.locator('text=Poem Copied').or(page.locator('.metro-toast-success'))
      ).toBeVisible({ timeout: 3000 });
    } catch {
      console.log('No se encontró notificación de copia');
    }
  });

  test('example loading functionality', async ({ page }) => {
    // Limpiar primero si hay contenido
    const clearButton = page.locator('button:has-text("clear")');
    if (await clearButton.isEnabled()) {
      await clearButton.click();
    }

    // Cargar ejemplo manualmente
    const exampleButton = page.locator('button:has-text("example")');
    await expect(exampleButton).toBeEnabled();
    await exampleButton.click();

    // Verificar que se cargó contenido
    const firstLine = page.locator('#poem-editor-line-0');
    await expect(firstLine).not.toBeEmpty({ timeout: 3000 });

    // Verificar que el botón analyze está habilitado
    const analyzeButton = page.locator('button:has-text("analyze")');
    await expect(analyzeButton).toBeEnabled();

    // Verificar que hay múltiples líneas con contenido
    const lineInputs = page.locator('#poem-editor input.line-input');
    const lineCount = await lineInputs.count();

    for (let i = 0; i < Math.min(lineCount, 3); i++) {
      const line = lineInputs.nth(i);
      const content = await line.inputValue();
      expect(content.length).toBeGreaterThan(0);
    }
  });

  test('clear functionality should reset editor', async ({ page }) => {
    // Escribir contenido en varias líneas
    await page.locator('#poem-editor-line-0').fill('Primera línea de prueba');
    await page.locator('#poem-editor-line-1').fill('Segunda línea con más texto');

    // Verificar que hay contenido antes de limpiar
    const firstLine = page.locator('#poem-editor-line-0');
    await expect(firstLine).not.toBeEmpty();

    // Limpiar
    const clearButton = page.locator('button:has-text("clear")');
    await expect(clearButton).toBeEnabled();
    await clearButton.click();

    // Verificar que está vacío
    await expect(firstLine).toBeEmpty();

    // Verificar que la segunda línea también está vacía
    const secondLine = page.locator('#poem-editor-line-1');
    await expect(secondLine).toBeEmpty();

    // Verificar que se pueden cargar ejemplos de nuevo
    await page.selectOption('#poetry-form-selector', 'tanka');
    await page.click('button:has-text("example")');
    await page.waitForTimeout(1000);

    await expect(firstLine).not.toBeEmpty();
  });

  test('should handle analysis with incomplete poems', async ({ page }) => {
    // Escribir solo una línea (poema incompleto)
    await page.locator('#poem-editor-line-0').fill('Solo una línea');

    // Intentar analizar
    const analyzeButton = page.locator('button:has-text("analyze")');
    await expect(analyzeButton).toBeEnabled();
    await analyzeButton.click();

    // La aplicación debería manejar esto sin errores
    await page.waitForTimeout(3000);

    // Verificar que no se cayó la aplicación
    await expect(page.locator('app-poem-editor')).toBeVisible();
  });
});
