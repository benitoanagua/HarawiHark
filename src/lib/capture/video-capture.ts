import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { CaptureOptions, CaptureResult } from './types';
import { BrowserManager } from './browser-utils';
import { Browser, BrowserContext, Page } from 'playwright';

interface VideoCaptureOptions extends Omit<CaptureOptions, 'multiple'> {
  duration?: number;
  browserType?: 'brave' | 'chrome' | 'firefox';
}

export class VideoCapture {
  private options: Required<Omit<VideoCaptureOptions, 'multiple'>>;

  constructor(options: VideoCaptureOptions = {}) {
    this.options = {
      url: options.url || 'http://localhost:4200',
      outputDir: options.outputDir || 'angular-captures/videos',
      viewport: options.viewport || { width: 1200, height: 800 },
      delay: options.delay || 3000,
      format: options.format || 'mp4',
      duration: options.duration || 10000,
      browserType: options.browserType || 'brave',
      mode: options.mode || 'basic',
    };
  }

  async capture(): Promise<CaptureResult> {
    const startTime = Date.now();
    const outputDir = this.options.outputDir;

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    console.log('🎬 Starting video capture...');
    console.log(`🌐 URL: ${this.options.url}`);
    console.log(`⏱️ Duration: ${this.options.duration}ms`);
    console.log(`🌐 Browser: ${this.options.browserType}`);

    let browser: Browser | undefined;
    let context: BrowserContext | undefined;
    let page: Page | undefined;

    try {
      const browserSetup = await BrowserManager.launchBrowser({
        headless: false,
        viewport: this.options.viewport,
        recordVideo: true,
        videoSize: this.options.viewport,
        browserType: this.options.browserType,
      });

      browser = browserSetup.browser;
      context = browserSetup.context;
      page = browserSetup.page;

      if (context) {
        await context.route('**/*', (route) => {
          const resourceType = route.request().resourceType();
          if (['image', 'font', 'media'].includes(resourceType)) {
            route.abort();
          } else {
            route.continue();
          }
        });
      }

      const navigationSuccess = await BrowserManager.safeNavigate(page, this.options.url);
      if (!navigationSuccess) {
        throw new Error('Failed to navigate to application');
      }

      await BrowserManager.wait(this.options.delay);

      await this.performDemoInteractions(page);

      await BrowserManager.wait(this.options.duration);

      await BrowserManager.cleanup(browser, context);

      const duration = Date.now() - startTime;
      const outputPath = await this.findLatestVideoFile(outputDir);

      console.log('✅ Video recorded successfully');

      return {
        success: true,
        outputPath,
        duration,
        timestamp: new Date().toISOString(),
        url: this.options.url,
        mode: this.options.mode,
      };
    } catch {
      await BrowserManager.cleanup(browser, context);
      console.error('❌ Error during video capture');

      return {
        success: false,
        outputPath: '',
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        url: this.options.url,
      };
    }
  }

  private async performDemoInteractions(page: Page): Promise<void> {
    console.log('🔄 Performing demo interactions...');

    try {
      const quickNavButtons = [
        '.nav-pill:has-text("editor")',
        '.nav-pill:has-text("results")',
        'button:has-text("editor")',
        'button:has-text("results")',
      ];

      for (const selector of quickNavButtons) {
        try {
          const element = page.locator(selector);
          if (await element.isVisible({ timeout: 2000 })) {
            await element.click();
            await BrowserManager.wait(1000);
          }
        } catch {
          continue;
        }
      }

      const formSelect = page.locator('#poetry-form-selector');
      if (await formSelect.isVisible()) {
        const forms = ['tanka', 'limerick', 'haiku'];
        for (const form of forms) {
          await formSelect.selectOption({ value: form });
          await BrowserManager.wait(1200);
        }
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
          await BrowserManager.wait(800);
        }
        await firstLineInput.fill('');
      }

      const buttons = ['example', 'analyze', 'clear'];
      for (const buttonText of buttons) {
        const button = page.locator(`button:has-text("${buttonText}")`).first();
        if ((await button.isVisible()) && (await button.isEnabled())) {
          await button.click();
          await BrowserManager.wait(1500);
        }
      }

      await page.evaluate(() => window.scrollTo(0, 300));
      await BrowserManager.wait(800);

      await page.evaluate(() => window.scrollTo(0, 600));
      await BrowserManager.wait(800);

      await page.evaluate(() => window.scrollTo(0, 0));
      await BrowserManager.wait(800);

      console.log('✅ Demo interactions completed');
    } catch {
      console.log('⚠️ Some interactions failed, but capture continues...');
    }
  }

  private async findLatestVideoFile(outputDir: string): Promise<string> {
    try {
      const fs = await import('fs/promises');
      const files = await fs.readdir(outputDir);

      const videoFiles = files
        .filter((f) => f.endsWith('.webm') || f.endsWith('.mp4') || f.endsWith('.mkv'))
        .sort();

      const latestFile = videoFiles.pop();
      return latestFile ? join(outputDir, latestFile) : '';
    } catch {
      console.warn('Error finding video file');
      return '';
    }
  }

  static async quickCapture(url: string, duration = 10000): Promise<CaptureResult> {
    const capture = new VideoCapture({ url, duration });
    return await capture.capture();
  }
}

export async function captureVideo(options?: VideoCaptureOptions): Promise<CaptureResult> {
  const capture = new VideoCapture(options);
  return await capture.capture();
}
