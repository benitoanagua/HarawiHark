import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { CaptureOptions, CaptureResult } from './types';
import { BrowserManager, BrowserLaunchOptions } from './browser-utils';

interface VideoCaptureOptions extends CaptureOptions {
  duration?: number;
  browserType?: 'brave' | 'chrome' | 'firefox';
}

interface VideoCaptureConfig {
  url: string;
  outputDir: string;
  viewport: { width: number; height: number };
  delay: number;
  format: 'mp4' | 'gif' | 'webm';
  duration: number;
  browserType: 'brave' | 'chrome' | 'firefox';
}

export class VideoCapture {
  private options: VideoCaptureConfig;

  constructor(options: VideoCaptureOptions = {}) {
    this.options = {
      url: options.url || 'http://localhost:4200',
      outputDir: options.outputDir || 'angular-captures/videos',
      viewport: options.viewport || { width: 1200, height: 800 },
      delay: options.delay || 3000,
      format: options.format || 'mp4',
      duration: options.duration || 10000,
      browserType: options.browserType || 'brave',
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

    let browser: any = null;
    let context: any = null;
    let page: any = null;

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

      // Navigate to the application
      const navigationSuccess = await BrowserManager.safeNavigate(page, this.options.url);
      if (!navigationSuccess) {
        throw new Error('Failed to navigate to application');
      }

      // Wait for initial delay
      await BrowserManager.wait(this.options.delay);

      // Perform demo interactions
      await this.performDemoInteractions(page);

      // Wait for the total video duration
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
      };
    } catch (error) {
      await BrowserManager.cleanup(browser, context);
      console.error('❌ Error during video capture:', error);

      return {
        success: false,
        outputPath: '',
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        url: this.options.url,
      };
    }
  }

  private async performDemoInteractions(page: any): Promise<void> {
    console.log('🔄 Performing demo interactions...');

    try {
      // 1. Switch between editor/results tabs
      await BrowserManager.robustClick(page, ['button:has-text("editor")']);
      await BrowserManager.wait(1000);

      await BrowserManager.robustClick(page, ['button:has-text("results")']);
      await BrowserManager.wait(1000);

      await BrowserManager.robustClick(page, ['button:has-text("editor")']);
      await BrowserManager.wait(1500);

      // 2. Change poetic forms
      const formSelect = page.locator('select[id="poetry-form"]');
      if (await formSelect.isVisible()) {
        await formSelect.selectOption({ value: 'tanka' });
        await BrowserManager.wait(1200);
        await formSelect.selectOption({ value: 'haiku' });
        await BrowserManager.wait(1200);
      }

      // 3. Type in the editor
      const textInput = page.locator('input[type="text"]').first();
      if (await textInput.isVisible()) {
        await textInput.fill('Beautiful poetry');
        await BrowserManager.wait(1000);
        await textInput.fill('');
      }

      // 4. Scroll to show different sections
      await page.evaluate(() => {
        window.scrollTo(0, 300);
      });
      await BrowserManager.wait(1000);

      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await BrowserManager.wait(1000);
    } catch {
      console.log('⚠️ Some interactions failed, continuing...');
    }
  }

  private async findLatestVideoFile(outputDir: string): Promise<string> {
    try {
      const videoFiles = await import('fs/promises');
      const files = await videoFiles.readdir(outputDir);
      const videoFile = files
        .filter((f) => f.endsWith('.webm'))
        .sort()
        .pop();

      return videoFile ? join(outputDir, videoFile) : '';
    } catch {
      return '';
    }
  }
}

export async function captureVideo(options?: VideoCaptureOptions): Promise<CaptureResult> {
  const capture = new VideoCapture(options);
  return await capture.capture();
}
