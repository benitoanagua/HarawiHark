import { chromium, Browser, BrowserContext, Page, LaunchOptions } from 'playwright';
import { BROWSER_CONFIG, SHARED_CONFIG, BrowserConfig } from '../../../playwright.config';

export interface BrowserLaunchOptions {
  headless?: boolean;
  viewport?: { width: number; height: number };
  recordVideo?: boolean;
  videoSize?: { width: number; height: number };
  browserType?: 'brave' | 'chrome' | 'firefox';
  timeout?: number;
}

export class BrowserManager {
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

  static async safeNavigate(page: Page, url: string, timeout = 30000): Promise<boolean> {
    try {
      console.log(`🌐 Navigating to: ${url}`);
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout,
      });

      await page
        .waitForSelector('app-poem-editor', { timeout: 10000 })
        .catch(() => page.waitForSelector('app-root', { timeout: 5000 }));

      console.log('✅ Application loaded successfully');
      return true;
    } catch (error) {
      console.error(`❌ Failed to navigate to ${url}:`, error);
      return false;
    }
  }

  static async waitForAppReady(page: Page, timeout = 15000): Promise<boolean> {
    try {
      await page.waitForSelector('app-poem-editor', { timeout });

      await page.waitForSelector('#poetry-form-selector', { timeout: 10000 });
      await page.waitForSelector('.editor-actions', { timeout: 5000 });

      console.log('✅ Poetry editor application ready');
      return true;
    } catch (error) {
      console.error('❌ Application not ready within timeout:', error);
      return false;
    }
  }

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

  static async robustClick(page: Page, selectors: string[], timeout = 5000): Promise<boolean> {
    for (const selector of selectors) {
      try {
        const element = page.locator(selector);
        if (await element.isVisible({ timeout: 2000 })) {
          await element.click({ timeout });
          await page.waitForTimeout(500);
          return true;
        }
      } catch {
        continue;
      }
    }

    for (const selector of selectors) {
      try {
        const element = page.locator(selector);
        if (await element.isVisible({ timeout: 2000 })) {
          await element.click({ force: true });
          await page.waitForTimeout(500);
          return true;
        }
      } catch {
        continue;
      }
    }

    console.warn(`❌ All click attempts failed for selectors: ${selectors.join(', ')}`);
    return false;
  }

  static async performEditorActions(page: Page): Promise<void> {
    console.log('🔄 Performing poetry editor actions...');

    try {
      const navSelectors = [
        '.nav-pill:has-text("results")',
        '.nav-pill:has-text("editor")',
        '.quick-nav-buttons button:has-text("results")',
        '.quick-nav-buttons button:has-text("editor")',
        'button:has-text("results")',
        'button:has-text("editor")',
      ];

      for (const selector of navSelectors) {
        if (await this.robustClick(page, [selector])) {
          await this.wait(1500);
          console.log(`✅ Clicked navigation: ${selector}`);
          break;
        }
      }

      const formSelect = page.locator('#poetry-form-selector');
      if (await formSelect.isVisible()) {
        const forms = ['tanka', 'limerick', 'haiku'];
        for (const form of forms) {
          await formSelect.selectOption({ value: form });
          await this.wait(1200);
          console.log(`✅ Form changed to: ${form}`);
        }

        await formSelect.selectOption({ value: 'haiku' });
        await this.wait(1000);
      }

      const firstLineInput = page.locator('#poem-editor-line-0');
      if (await firstLineInput.isVisible()) {
        const sampleLines = [
          'Moonlight shines on water',
          'Soft breeze through the trees',
          'Nature speaks in whispers',
        ];

        for (const line of sampleLines) {
          await firstLineInput.fill(line);
          await this.wait(800);
        }
        console.log('✅ Sample poem written');

        await firstLineInput.fill('');
        await this.wait(500);
      }

      const buttonActions = [
        { text: 'example', wait: 2500 },
        { text: 'analyze', wait: 4000 },
        { text: 'clear', wait: 1500 },
      ];

      for (const action of buttonActions) {
        const buttonSelectors = [
          `.editor-actions button:has-text("${action.text}")`,
          `button:has-text("${action.text}"):not(.metro-command-button)`,
          `button:has-text("${action.text}")`,
        ];

        let clicked = false;
        for (const selector of buttonSelectors) {
          const button = page.locator(selector).first();
          if ((await button.isVisible({ timeout: 2000 })) && (await button.isEnabled())) {
            await button.click();
            await this.wait(action.wait);
            console.log(`✅ Button clicked: ${action.text}`);
            clicked = true;
            break;
          }
        }

        if (!clicked) {
          console.log(`⚠️ Could not click button: ${action.text}`);
        }
      }

      if (await page.locator('app-poem-results').isVisible({ timeout: 3000 })) {
        console.log('✅ Results section is visible, navigating...');
        const resultsNavSelectors = [
          '.nav-pill:has-text("results")',
          '.quick-nav-buttons button:has-text("results")',
          'button:has-text("results")',
        ];

        for (const selector of resultsNavSelectors) {
          if (await this.robustClick(page, [selector])) {
            await this.wait(2000);
            console.log('✅ Navigated to results section');
            break;
          }
        }
      }

      await page.evaluate(() => window.scrollTo(0, 300));
      await this.wait(800);
      await page.evaluate(() => window.scrollTo(0, 600));
      await this.wait(800);
      await page.evaluate(() => window.scrollTo(0, 0));
      await this.wait(800);

      console.log('✅ All editor actions completed successfully');
    } catch (error) {
      console.log(
        '⚠️ Some actions failed, but capture continues:',
        error instanceof Error ? error.message : error
      );
    }
  }

  static async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
