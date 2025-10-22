import { chromium, Browser, BrowserContext, Page, LaunchOptions } from 'playwright';
import { BROWSER_CONFIG, SHARED_CONFIG, BrowserConfig } from '../../../playwright.config';
import { SELECTORS, TestHelpers } from '../../e2e/selectors';

export interface BrowserLaunchOptions {
  headless?: boolean;
  viewport?: { width: number; height: number };
  recordVideo?: boolean;
  videoSize?: { width: number; height: number };
  browserType?: 'brave' | 'chrome' | 'firefox';
  timeout?: number;
}

export class BrowserManager {
  /**
   * Lanza el navegador con la configuración especificada
   */
  static async launchBrowser(
    options: BrowserLaunchOptions = {}
  ): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
    const {
      headless = false,
      viewport = { width: 1200, height: 800 },
      recordVideo = false,
      videoSize = { width: 1200, height: 800 },
      browserType = 'brave',
      timeout = 30000,
    } = options;

    const browserConfig: BrowserConfig = BROWSER_CONFIG[browserType];

    const launchOptions: LaunchOptions = {
      headless,
      timeout,
    };

    if (browserConfig.channel) {
      launchOptions.channel = browserConfig.channel;
    }

    if (browserConfig.launchOptions.executablePath) {
      launchOptions.executablePath = browserConfig.launchOptions.executablePath;
    }

    launchOptions.args = [...browserConfig.launchOptions.args];

    console.log(`🚀 Launching ${browserType} browser...`);
    const browser = await chromium.launch(launchOptions);

    const contextOptions = {
      viewport,
      baseURL: SHARED_CONFIG.baseURL,
      ignoreHTTPSErrors: true,
      trace: SHARED_CONFIG.trace,
      screenshot: SHARED_CONFIG.screenshot,
      ...(recordVideo && {
        recordVideo: {
          dir: 'angular-captures/videos',
          size: videoSize,
        },
      }),
    };

    const context = await browser.newContext(contextOptions);
    context.setDefaultTimeout(timeout);
    context.setDefaultNavigationTimeout(timeout);

    const page = await context.newPage();
    page.setDefaultTimeout(timeout);
    page.setDefaultNavigationTimeout(timeout);

    return { browser, context, page };
  }

  /**
   * Navega de forma segura a la URL especificada
   */
  static async safeNavigate(page: Page, url: string, timeout = 30000): Promise<boolean> {
    try {
      console.log(`🌐 Navigating to: ${url}`);
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout,
      });

      await page
        .waitForSelector(SELECTORS.EDITOR.CONTAINER, { timeout: 10000 })
        .catch(() => page.waitForSelector('app-root', { timeout: 5000 }));

      console.log('✅ Application loaded successfully');
      return true;
    } catch (error) {
      console.error(`❌ Failed to navigate to ${url}:`, error);
      return false;
    }
  }

  /**
   * Espera a que la aplicación esté completamente cargada y lista
   */
  static async waitForAppReady(page: Page, timeout = 15000): Promise<boolean> {
    try {
      await page.waitForSelector(SELECTORS.EDITOR.CONTAINER, { timeout });
      await page.waitForSelector(SELECTORS.FORM_SELECTOR, { timeout: 10000 });
      await page.waitForSelector('.editor-actions', { timeout: 5000 });

      console.log('✅ Poetry editor application ready');
      return true;
    } catch (error) {
      console.error('❌ Application not ready within timeout:', error);
      return false;
    }
  }

  /**
   * Limpia recursos del navegador
   */
  static async cleanup(browser?: Browser, context?: BrowserContext): Promise<void> {
    try {
      if (context) {
        await context.close();
        console.log('✅ Browser context closed');
      }
      if (browser) {
        await browser.close();
        console.log('✅ Browser closed');
      }
    } catch (error) {
      console.warn('⚠️ Error during browser cleanup:', error);
    }
  }

  /**
   * ⚡ REFACTORIZADO: Realiza acciones de demostración del editor usando TestHelpers
   * Esto muestra las capacidades de la aplicación en videos/screenshots
   */
  static async performEditorActions(page: Page): Promise<void> {
    console.log('🔄 Performing poetry editor actions using TestHelpers...');

    try {
      const forms = [
        SELECTORS.FORM_OPTIONS.TANKA,
        SELECTORS.FORM_OPTIONS.LIMERICK,
        SELECTORS.FORM_OPTIONS.HAIKU,
      ];

      for (const form of forms) {
        await TestHelpers.selectPoetryForm(page, form);
        await this.wait(1200);
        console.log(`✅ Form changed to: ${form}`);
      }

      const testLines = [
        'Ancient pond so still',
        'A frog jumps into water',
        'Splash breaks silence',
      ];

      const firstLine = page.locator(SELECTORS.EDITOR.LINE_INPUT(0));
      if (await firstLine.isVisible({ timeout: 2000 })) {
        await TestHelpers.fillPoemLines(page, testLines);
        await this.wait(1500);
        console.log('✅ Sample poem written');

        await firstLine.fill('');
        await this.wait(500);
      }

      await TestHelpers.loadExample(page);
      console.log('✅ Example loaded');

      const analyzeButton = page.locator(SELECTORS.BUTTONS.ANALYZE).first();
      if ((await analyzeButton.isVisible({ timeout: 2000 })) && (await analyzeButton.isEnabled())) {
        await analyzeButton.click();
        await this.wait(4000);
        console.log('✅ Analysis triggered');
      }

      const clearButton = page.locator(SELECTORS.BUTTONS.CLEAR).first();
      if ((await clearButton.isVisible({ timeout: 2000 })) && (await clearButton.isEnabled())) {
        await clearButton.click();

        try {
          await page.waitForSelector('button:has-text("OK"), button:has-text("Confirm")', {
            timeout: 1000,
          });
          await page.click('button:has-text("OK"), button:has-text("Confirm")');
        } catch {
          // Nothing
        }

        await this.wait(1000);
        console.log('✅ Editor cleared');
      }

      await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }));
      await this.wait(800);
      await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'smooth' }));
      await this.wait(800);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await this.wait(800);

      console.log('✅ All editor actions completed successfully');
    } catch (error) {
      console.log(
        '⚠️ Some actions failed, but capture continues:',
        error instanceof Error ? error.message : error
      );
    }
  }

  /**
   * Espera un número específico de milisegundos
   */
  static async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Toma un screenshot de la página actual
   */
  static async takeScreenshot(page: Page, name: string, path: string): Promise<boolean> {
    try {
      await page.screenshot({
        path,
        fullPage: true,
      });
      console.log(`✅ Screenshot saved: ${name} -> ${path}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to take screenshot ${name}:`, error);
      return false;
    }
  }
}
