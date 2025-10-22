import { existsSync, mkdirSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';
import type { CaptureOptions, CaptureResult } from './types';
import { BrowserManager } from './browser-utils';
import { Browser, BrowserContext, Page } from 'playwright';
import { SHARED_CONFIG } from '../../../playwright.config';

interface ScreenshotCaptureOptions extends CaptureOptions {
  multiple?: boolean;
  browserType?: 'brave' | 'chrome' | 'firefox';
  screenshotType?: 'png' | 'jpeg';
  quality?: number;
  fullPage?: boolean;
  captureInteractions?: boolean;
}

export class ScreenshotCapture {
  private options: Required<ScreenshotCaptureOptions>;

  constructor(options: ScreenshotCaptureOptions = {}) {
    this.options = {
      url: options.url || SHARED_CONFIG.baseURL,
      outputDir: options.outputDir || 'angular-captures/screenshots',
      viewport: options.viewport || { width: 1200, height: 800 },
      delay: options.delay || 2000,
      format: options.format || 'mp4',
      multiple: options.multiple || false,
      browserType: options.browserType || 'brave',
      mode: options.mode || 'detailed',
      duration: options.duration || 0,
      screenshotType: options.screenshotType || 'png',
      quality: options.quality || 80,
      fullPage: options.fullPage ?? true,
      captureInteractions: options.captureInteractions ?? true,
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
    console.log(`📁 Output: ${outputDir}`);

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

      await BrowserManager.waitForAppReady(page);
      await BrowserManager.wait(this.options.delay);

      const screenshotResults: { name: string; path: string }[] = [];

      if (this.options.multiple) {
        await this.captureMultipleSections(page, outputDir, screenshotResults);
      } else {
        await this.captureFullPage(page, outputDir, screenshotResults);
      }

      if (this.options.captureInteractions) {
        await this.captureInteractionStates(page, outputDir, screenshotResults);
      }

      await this.generateReport(screenshotResults, outputDir);
      await BrowserManager.cleanup(browser, context);

      const duration = Date.now() - startTime;

      console.log('✅ Screenshot capture completed');
      console.log(`📊 Total screenshots: ${screenshotResults.length}`);
      console.log(`⏱️ Duration: ${duration}ms`);

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
        error: error instanceof Error ? error.message : 'Unknown error',
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
      { name: 'analysis-tabs', selector: '.metro-pivot', fullPage: false },
      { name: 'analysis-tabs-alt', selector: '[role="tablist"]', fullPage: false },
      { name: 'quick-nav', selector: '.quick-nav-buttons', fullPage: false },
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

  private async captureInteractionStates(
    page: Page,
    outputDir: string,
    results: { name: string; path: string }[]
  ): Promise<void> {
    console.log('🔄 Capturing interaction states...');

    try {
      const formSelect = page.locator('#poetry-form-selector');
      if (await formSelect.isVisible()) {
        const forms = ['tanka', 'limerick', 'cinquain'];
        for (const form of forms) {
          await formSelect.selectOption({ value: form });
          await BrowserManager.wait(1500);

          const screenshotPath = join(
            outputDir,
            `form-${form}-${Date.now()}.${this.options.screenshotType}`
          );

          await page.screenshot({
            path: screenshotPath,
            fullPage: this.options.fullPage,
          });

          results.push({ name: `form-${form}`, path: screenshotPath });
          console.log(`✅ Form ${form} captured`);
        }

        await formSelect.selectOption({ value: 'haiku' });
        await BrowserManager.wait(1000);
      }

      const exampleButtonSelectors = [
        '.editor-actions button:has-text("example")',
        'button:has-text("example"):not(.metro-command-button)',
        'button:has-text("example")',
      ];

      let exampleLoaded = false;
      for (const selector of exampleButtonSelectors) {
        const exampleButton = page.locator(selector).first();
        if (
          (await exampleButton.isVisible({ timeout: 2000 })) &&
          (await exampleButton.isEnabled())
        ) {
          await exampleButton.click();
          await BrowserManager.wait(3000);

          const screenshotPath = join(
            outputDir,
            `with-example-${Date.now()}.${this.options.screenshotType}`
          );

          await page.screenshot({
            path: screenshotPath,
            fullPage: this.options.fullPage,
          });

          results.push({ name: 'with-example', path: screenshotPath });
          console.log('✅ Example loaded state captured');
          exampleLoaded = true;
          break;
        }
      }

      if (!exampleLoaded) {
        console.log('⚠️ Could not load example for screenshot');
      }

      const resultsNavSelectors = [
        '.nav-pill:has-text("results")',
        '.quick-nav-buttons button:has-text("results")',
        'button:has-text("results")',
      ];

      let resultsNavigated = false;
      for (const selector of resultsNavSelectors) {
        const resultsNav = page.locator(selector);
        if (await resultsNav.isVisible({ timeout: 2000 })) {
          await resultsNav.click();
          await BrowserManager.wait(2000);

          await page
            .waitForSelector('app-poem-results, [class*="result"], [class*="analysis"]', {
              timeout: 5000,
            })
            .catch(() => console.log('Results not loaded after navigation'));

          const screenshotPath = join(
            outputDir,
            `results-section-${Date.now()}.${this.options.screenshotType}`
          );

          await page.screenshot({
            path: screenshotPath,
            fullPage: this.options.fullPage,
          });

          results.push({ name: 'results-section', path: screenshotPath });
          console.log('✅ Results section captured');
          resultsNavigated = true;

          const editorNavSelectors = [
            '.nav-pill:has-text("editor")',
            '.quick-nav-buttons button:has-text("editor")',
            'button:has-text("editor")',
          ];

          for (const editorSelector of editorNavSelectors) {
            const editorNav = page.locator(editorSelector);
            if (await editorNav.isVisible({ timeout: 2000 })) {
              await editorNav.click();
              await BrowserManager.wait(1000);
              break;
            }
          }
          break;
        }
      }

      if (!resultsNavigated) {
        console.log('⚠️ Could not navigate to results section');
      }
    } catch (error) {
      console.log(
        '⚠️ Some interaction captures failed:',
        error instanceof Error ? error.message : error
      );
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
        browserType: this.options.browserType,
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
    url: string = SHARED_CONFIG.baseURL,
    options: Partial<ScreenshotCaptureOptions> = {}
  ): Promise<CaptureResult> {
    const capture = new ScreenshotCapture({
      url,
      ...options,
      browserType: 'brave',
    });
    return await capture.capture();
  }

  static async captureApplicationOverview(): Promise<CaptureResult> {
    return await this.quickScreenshot(SHARED_CONFIG.baseURL, {
      multiple: true,
      captureInteractions: true,
      mode: 'overview',
    });
  }
}

export async function captureScreenshots(
  options?: ScreenshotCaptureOptions
): Promise<CaptureResult> {
  const capture = new ScreenshotCapture(options);
  return await capture.capture();
}
