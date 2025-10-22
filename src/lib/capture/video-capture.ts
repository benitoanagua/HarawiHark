import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { CaptureOptions, CaptureResult } from './types';
import { BrowserManager } from './browser-utils';
import { Browser, BrowserContext, Page } from 'playwright';
import { SHARED_CONFIG } from '../../../playwright.config';

interface VideoCaptureOptions extends Omit<CaptureOptions, 'multiple'> {
  duration?: number;
  browserType?: 'brave' | 'chrome' | 'firefox';
  showInteractions?: boolean;
}

export class VideoCapture {
  private options: Required<Omit<VideoCaptureOptions, 'multiple'>>;

  constructor(options: VideoCaptureOptions = {}) {
    this.options = {
      url: options.url || SHARED_CONFIG.baseURL,
      outputDir: options.outputDir || 'angular-captures/videos',
      viewport: options.viewport || { width: 1200, height: 800 },
      delay: options.delay || 3000,
      format: options.format || 'mp4',
      duration: options.duration || 15000,
      browserType: options.browserType || 'brave',
      mode: options.mode || 'full',
      showInteractions: options.showInteractions ?? true,
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
    console.log(`🖥️ Viewport: ${this.options.viewport.width}x${this.options.viewport.height}`);

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
        timeout: this.options.duration + 10000,
      });

      browser = browserSetup.browser;
      context = browserSetup.context;
      page = browserSetup.page;

      if (context) {
        await context.route('**/*.{png,jpg,jpeg,svg,gif,webp}', (route) => route.abort());
      }

      const navigationSuccess = await BrowserManager.safeNavigate(page, this.options.url);
      if (!navigationSuccess) {
        throw new Error('Failed to navigate to application');
      }

      await BrowserManager.waitForAppReady(page);
      await BrowserManager.wait(this.options.delay);

      if (this.options.showInteractions) {
        await BrowserManager.performEditorActions(page);
      }

      const remainingTime = this.options.duration - (Date.now() - startTime);
      if (remainingTime > 0) {
        await BrowserManager.wait(remainingTime);
      }

      await BrowserManager.cleanup(browser, context);

      const duration = Date.now() - startTime;
      const outputPath = await this.findLatestVideoFile(outputDir);

      console.log('✅ Video recorded successfully');
      console.log(`📊 Capture duration: ${duration}ms`);
      console.log(`💾 Output: ${outputPath}`);

      return {
        success: true,
        outputPath,
        duration,
        timestamp: new Date().toISOString(),
        url: this.options.url,
        mode: this.options.mode,
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
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async findLatestVideoFile(outputDir: string): Promise<string> {
    try {
      const fs = await import('fs/promises');

      if (!existsSync(outputDir)) {
        return '';
      }

      const files = await fs.readdir(outputDir);

      const videoFiles = files
        .filter((f) => f.endsWith('.webm') || f.endsWith('.mp4') || f.endsWith('.mkv'))
        .map((f) => ({
          name: f,
          path: join(outputDir, f),
          time: fs.stat(join(outputDir, f)).then((stat) => stat.mtime),
        }));

      if (videoFiles.length === 0) {
        console.log('❌ No video files found in directory');
        return '';
      }

      const filesWithStats = await Promise.all(
        videoFiles.map(async (file) => ({
          ...file,
          time: await file.time,
        }))
      );

      filesWithStats.sort((a, b) => b.time.getTime() - a.time.getTime());

      const latestFile = filesWithStats[0]?.path || '';
      console.log(`📹 Latest video file: ${latestFile}`);
      return latestFile;
    } catch (error) {
      console.warn('❌ Error finding video file:', error);
      return '';
    }
  }

  static async quickCapture(
    url: string = SHARED_CONFIG.baseURL,
    duration = 15000
  ): Promise<CaptureResult> {
    const capture = new VideoCapture({
      url,
      duration,
      browserType: 'brave',
      showInteractions: true,
    });
    return await capture.capture();
  }

  static async captureDemo(): Promise<CaptureResult> {
    return await this.quickCapture(SHARED_CONFIG.baseURL, 20000);
  }
}

export async function captureVideo(options?: VideoCaptureOptions): Promise<CaptureResult> {
  const capture = new VideoCapture(options);
  return await capture.capture();
}
