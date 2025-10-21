import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { execSync } from 'child_process';

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

    // Configuración específica para Brave
    const launchOptions: any = {
      headless,
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-component-extensions-with-background-pages',
      ],
    };

    // Configurar según el tipo de navegador
    if (browserType === 'brave') {
      const bravePath = this.findBravePath();
      if (bravePath) {
        launchOptions.executablePath = bravePath;
        console.log(`🚀 Using Brave browser at: ${bravePath}`);
      } else {
        console.warn('⚠️ Brave not found, falling back to system Chrome');
        launchOptions.channel = 'chrome';
      }
    } else if (browserType === 'chrome') {
      launchOptions.channel = 'chrome';
    }

    const browser = await chromium.launch(launchOptions);

    const contextOptions: any = {
      viewport,
    };

    if (recordVideo) {
      contextOptions.recordVideo = {
        dir: 'angular-captures/videos',
        size: videoSize,
      };
    }

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    return { browser, context, page };
  }

  private static findBravePath(): string | null {
    try {
      // Buscar Brave en ubicaciones comunes
      const possiblePaths = [
        '/usr/bin/brave',
        '/usr/bin/brave-browser',
        '/usr/bin/brave-browser-stable',
        '/opt/brave.com/brave/brave',
        '/snap/bin/brave',
        '/usr/lib/brave/brave',
      ];

      for (const path of possiblePaths) {
        try {
          execSync(`which ${path}`, { stdio: 'ignore' });
          return path;
        } catch {
          continue;
        }
      }

      // Intentar encontrar con which/whereis
      try {
        const whichResult = execSync('which brave', { encoding: 'utf-8' }).trim();
        if (whichResult) return whichResult;
      } catch {}

      try {
        const whereisResult = execSync('whereis brave', { encoding: 'utf-8' }).trim();
        const paths = whereisResult.split(' ').slice(1);
        if (paths.length > 0) return paths[0];
      } catch {}

      return null;
    } catch (error) {
      console.warn('⚠️ Error finding Brave path:', error);
      return null;
    }
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

    // If all normal clicks fail, try force clicks
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
