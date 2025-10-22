import { chromium, Browser, BrowserContext, Page, LaunchOptions } from 'playwright';
import { BROWSER_CONFIG } from '../../../playwright.config';

export interface BrowserLaunchOptions {
  headless?: boolean;
  viewport?: { width: number; height: number };
  recordVideo?: boolean;
  videoSize?: { width: number; height: number };
  browserType?: 'brave' | 'chrome' | 'firefox';
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
    } = options;

    const browserConfig = BROWSER_CONFIG[browserType];

    const launchOptions: LaunchOptions = {
      headless,
    };

    const channel = (browserConfig as unknown as { channel?: string }).channel;
    if (channel) {
      (launchOptions as { channel?: string }).channel = channel;
    }

    const executablePath = (browserConfig.launchOptions as { executablePath?: string })
      .executablePath;
    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }

    if (browserConfig.launchOptions.args) {
      launchOptions.args = [...browserConfig.launchOptions.args];
    }

    const browser = await chromium.launch(launchOptions);

    const contextOptions = {
      viewport,
      baseURL: 'http://localhost:4200',
      trace: 'on-first-retry' as const,
      screenshot: 'only-on-failure' as const,
      ...(recordVideo && {
        recordVideo: {
          dir: 'angular-captures/videos',
          size: videoSize,
        },
      }),
    };

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    return { browser, context, page };
  }

  static async safeNavigate(page: Page, url: string, timeout = 30000): Promise<boolean> {
    try {
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout,
      });
      console.log('✅ Application loaded successfully');
      return true;
    } catch (error) {
      console.error(`❌ Failed to navigate to ${url}:`, error);
      return false;
    }
  }

  static async cleanup(browser?: Browser, context?: BrowserContext): Promise<void> {
    try {
      if (context) await context.close();
      if (browser) await browser.close();
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
          return true;
        }
      } catch {
        continue;
      }
    }

    console.warn(`All click attempts failed for selectors: ${selectors.join(', ')}`);
    return false;
  }

  static async safeHover(page: Page, selector: string): Promise<boolean> {
    try {
      const element = page.locator(selector);
      if (await element.isVisible()) {
        await element.hover();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  static async waitForInteractive(page: Page, selector: string, timeout = 10000): Promise<boolean> {
    try {
      await page.waitForSelector(selector, {
        timeout,
        state: 'visible',
      });

      const isActionable = await page.evaluate((sel: string) => {
        const element = document.querySelector(sel);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const topElement = document.elementFromPoint(centerX, centerY);
        return topElement === element || element.contains(topElement);
      }, selector);

      return isActionable;
    } catch {
      return false;
    }
  }

  static async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
