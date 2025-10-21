import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { CaptureOptions, CaptureResult } from './types';
import { BrowserManager, BrowserLaunchOptions } from './browser-utils';

interface ScreenshotCaptureOptions extends CaptureOptions {
  multiple?: boolean;
  browserType?: 'brave' | 'chrome' | 'firefox';
}

interface ScreenshotCaptureConfig {
  url: string;
  outputDir: string;
  viewport: { width: number; height: number };
  delay: number;
  format: 'mp4' | 'gif' | 'webm';
  multiple: boolean;
  browserType: 'brave' | 'chrome' | 'firefox';
}

export class ScreenshotCapture {
  private options: ScreenshotCaptureConfig;

  constructor(options: ScreenshotCaptureOptions = {}) {
    this.options = {
      url: options.url || 'http://localhost:4200',
      outputDir: options.outputDir || 'angular-captures/screenshots',
      viewport: options.viewport || { width: 1200, height: 800 },
      delay: options.delay || 2000,
      format: options.format || 'mp4',
      multiple: options.multiple || false,
      browserType: options.browserType || 'brave',
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

    let browser: any = null;
    let context: any = null;
    let page: any = null;

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

      // Navigate to the application
      const navigationSuccess = await BrowserManager.safeNavigate(page, this.options.url);
      if (!navigationSuccess) {
        throw new Error('Failed to navigate to application');
      }

      // Wait for initial delay
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

      return {
        success: true,
        outputPath: outputDir,
        duration,
        timestamp: new Date().toISOString(),
        url: this.options.url,
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
    page: any,
    outputDir: string,
    results: { name: string; path: string }[]
  ): Promise<void> {
    const sections = [
      { name: 'header', selector: 'app-header' },
      { name: 'editor', selector: 'app-poem-editor' },
      { name: 'results', selector: 'app-poem-results' },
      { name: 'footer', selector: 'app-footer' },
    ];

    for (const section of sections) {
      try {
        const element = page.locator(section.selector);
        if (await element.isVisible()) {
          const screenshotPath = join(outputDir, `${section.name}-${Date.now()}.png`);
          await element.screenshot({
            path: screenshotPath,
          });
          results.push({
            name: section.name,
            path: screenshotPath,
          });
          console.log(`✅ ${section.name} captured: ${screenshotPath}`);
        }
      } catch {
        console.log(`⚠️ Could not capture ${section.name}`);
      }
    }

    // Full page capture as well
    await this.captureFullPage(page, outputDir, results);
  }

  private async captureFullPage(
    page: any,
    outputDir: string,
    results: { name: string; path: string }[]
  ): Promise<void> {
    const fullPagePath = join(outputDir, `fullpage-${Date.now()}.png`);
    await page.screenshot({
      path: fullPagePath,
      fullPage: true,
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
      screenshots: screenshots.map((s) => ({
        name: s.name,
        path: s.path,
        filename: s.path.split('/').pop(),
      })),
    };

    const reportPath = join(outputDir, 'screenshots-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Report generated: ${reportPath}`);
  }
}

export async function captureScreenshots(
  options?: ScreenshotCaptureOptions
): Promise<CaptureResult> {
  const capture = new ScreenshotCapture(options);
  return await capture.capture();
}
