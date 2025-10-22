import { existsSync, mkdirSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';
import type { CaptureOptions, CaptureResult } from './types';
import { BrowserManager } from './browser-utils';
import { Browser, BrowserContext, Page } from 'playwright';

interface ScreenshotCaptureOptions extends CaptureOptions {
  multiple?: boolean;
  browserType?: 'brave' | 'chrome' | 'firefox';
  screenshotType?: 'png' | 'jpeg';
  quality?: number;
  fullPage?: boolean;
}

export class ScreenshotCapture {
  private options: Required<ScreenshotCaptureOptions>;

  constructor(options: ScreenshotCaptureOptions = {}) {
    this.options = {
      url: options.url || 'http://localhost:4200',
      outputDir: options.outputDir || 'angular-captures/screenshots',
      viewport: options.viewport || { width: 1200, height: 800 },
      delay: options.delay || 2000,
      format: options.format || 'mp4',
      multiple: options.multiple || false,
      browserType: options.browserType || 'brave',
      mode: options.mode || 'basic',
      duration: options.duration || 0,
      screenshotType: options.screenshotType || 'png',
      quality: options.quality || 80,
      fullPage: options.fullPage ?? true,
    };
  }

  async capture(): Promise<CaptureResult> {
    const startTime = Date.now();
    const outputDir = this.options.outputDir;

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    console.log('📸 Starting screenshot capture...');
    console.log(`🌐 URL: ${this.options.url}`);
    console.log(`🌐 Browser: ${this.options.browserType}`);
    console.log(`🖼️ Type: ${this.options.screenshotType.toUpperCase()}`);

    let browser: Browser | undefined;
    let context: BrowserContext | undefined;
    let page: Page | undefined;

    try {
      const browserSetup = await BrowserManager.launchBrowser({
        headless: false,
        viewport: this.options.viewport,
        recordVideo: false,
        browserType: this.options.browserType,
      });

      browser = browserSetup.browser;
      context = browserSetup.context;
      page = browserSetup.page;

      const navigationSuccess = await BrowserManager.safeNavigate(page, this.options.url);
      if (!navigationSuccess) {
        throw new Error('Failed to navigate to application');
      }

      await BrowserManager.wait(this.options.delay);

      const screenshotResults: { name: string; path: string }[] = [];

      if (this.options.multiple) {
        await this.captureMultipleSections(page, outputDir, screenshotResults);
      } else {
        await this.captureFullPage(page, outputDir, screenshotResults);
      }

      await this.generateReport(screenshotResults, outputDir);
      await BrowserManager.cleanup(browser, context);

      const duration = Date.now() - startTime;

      console.log('✅ Screenshot capture completed');
      console.log(`📊 Total screenshots: ${screenshotResults.length}`);

      return {
        success: true,
        outputPath: outputDir,
        duration,
        timestamp: new Date().toISOString(),
        url: this.options.url,
        mode: this.options.mode,
        sections: screenshotResults,
      };
    } catch (error) {
      await BrowserManager.cleanup(browser, context);
      console.error('❌ Error during screenshot capture:', error);

      return {
        success: false,
        outputPath: '',
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        url: this.options.url,
      };
    }
  }

  private async captureMultipleSections(
    page: Page,
    outputDir: string,
    results: { name: string; path: string }[]
  ): Promise<void> {
    const sections = [
      { name: 'fullpage', selector: 'body', fullPage: true },
      { name: 'header', selector: 'app-header', fullPage: false },
      { name: 'editor', selector: 'app-poem-editor', fullPage: false },
      { name: 'results', selector: 'app-poem-results', fullPage: false },
      { name: 'footer', selector: 'app-footer', fullPage: false },
    ];

    for (const section of sections) {
      try {
        const timestamp = Date.now();
        const screenshotPath = join(
          outputDir,
          `${section.name}-${timestamp}.${this.options.screenshotType}`
        );

        if (section.fullPage) {
          await page.screenshot({
            path: screenshotPath,
            fullPage: true,
            type: this.options.screenshotType as 'png' | 'jpeg',
            ...(this.options.screenshotType === 'jpeg' && { quality: this.options.quality }),
          });
        } else {
          const element = page.locator(section.selector);
          if (await element.isVisible({ timeout: 2000 })) {
            await element.screenshot({
              path: screenshotPath,
              type: this.options.screenshotType as 'png' | 'jpeg',
              ...(this.options.screenshotType === 'jpeg' && { quality: this.options.quality }),
            });
          } else {
            console.log(`⚠️ Element not visible: ${section.selector}`);
            continue;
          }
        }

        results.push({
          name: section.name,
          path: screenshotPath,
        });
        console.log(`✅ ${section.name} captured: ${screenshotPath}`);

        await BrowserManager.wait(500);
      } catch (error) {
        console.log(
          `⚠️ Could not capture ${section.name}:`,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    }
  }

  private async captureFullPage(
    page: Page,
    outputDir: string,
    results: { name: string; path: string }[]
  ): Promise<void> {
    const timestamp = Date.now();
    const fullPagePath = join(outputDir, `fullpage-${timestamp}.${this.options.screenshotType}`);

    await page.screenshot({
      path: fullPagePath,
      fullPage: this.options.fullPage,
      type: this.options.screenshotType as 'png' | 'jpeg',
      ...(this.options.screenshotType === 'jpeg' && { quality: this.options.quality }),
    });

    results.push({
      name: 'fullpage',
      path: fullPagePath,
    });
  }

  private async generateReport(
    screenshots: { name: string; path: string }[],
    outputDir: string
  ): Promise<void> {
    const report = {
      generatedAt: new Date().toISOString(),
      totalScreenshots: screenshots.length,
      viewport: this.options.viewport,
      settings: {
        screenshotType: this.options.screenshotType,
        quality: this.options.quality,
        fullPage: this.options.fullPage,
        multiple: this.options.multiple,
      },
      screenshots: screenshots.map((s) => ({
        name: s.name,
        path: s.path,
        filename: s.path.split('/').pop(),
        size: this.getFileSize(s.path),
      })),
    };

    const reportPath = join(outputDir, 'screenshots-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Report generated: ${reportPath}`);
  }

  private getFileSize(filePath: string): string {
    try {
      const stats = statSync(filePath);
      const sizeInKB = Math.round(stats.size / 1024);
      return `${sizeInKB} KB`;
    } catch {
      return 'Unknown';
    }
  }

  static async quickScreenshot(
    url: string,
    options: Partial<ScreenshotCaptureOptions> = {}
  ): Promise<CaptureResult> {
    const capture = new ScreenshotCapture({ url, ...options });
    return await capture.capture();
  }

  static async captureElements(
    url: string,
    selectors: string[],
    outputDir?: string
  ): Promise<CaptureResult> {
    const capture = new ScreenshotCapture({
      url,
      multiple: true,
      outputDir,
      fullPage: false,
    });
    return await capture.capture();
  }
}

export async function captureScreenshots(
  options?: ScreenshotCaptureOptions
): Promise<CaptureResult> {
  const capture = new ScreenshotCapture(options);
  return await capture.capture();
}
