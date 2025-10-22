import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { CaptureOptions, CaptureResult } from './types';
import { BrowserManager } from './browser-utils';
import { Browser, BrowserContext, Page } from 'playwright';
import { SHARED_CONFIG } from '../../../playwright.config';
import { SELECTORS, TestHelpers } from '../../e2e/selectors';

interface VideoCaptureOptions extends Omit<CaptureOptions, 'multiple'> {
  duration?: number;
  browserType?: 'brave' | 'chrome' | 'firefox';
  showInteractions?: boolean;
  includeAdvancedDemo?: boolean;
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
      includeAdvancedDemo: options.includeAdvancedDemo ?? false,
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
    console.log(`🎯 Interactions: ${this.options.showInteractions ? 'Enabled' : 'Disabled'}`);

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

      const navigationSuccess = await BrowserManager.safeNavigate(page, this.options.url);
      if (!navigationSuccess) {
        throw new Error('Failed to navigate to application');
      }

      await BrowserManager.waitForAppReady(page);
      await BrowserManager.wait(this.options.delay);

      if (this.options.showInteractions) {
        if (this.options.includeAdvancedDemo) {
          await this.performAdvancedDemo(page);
        } else {
          await BrowserManager.performEditorActions(page);
        }
      }

      const elapsedTime = Date.now() - startTime;
      const remainingTime = this.options.duration - elapsedTime;

      if (remainingTime > 0) {
        console.log(`⏳ Recording for ${Math.round(remainingTime / 1000)}s more...`);
        await BrowserManager.wait(remainingTime);
      }

      await BrowserManager.cleanup(browser, context);

      const duration = Date.now() - startTime;
      const outputPath = await this.findLatestVideoFile(outputDir);

      if (outputPath) {
        console.log('✅ Video recorded successfully');
        console.log(`📊 Capture duration: ${duration}ms`);
        console.log(`💾 Output: ${outputPath}`);
      } else {
        console.log('⚠️ Video file not found, but capture completed');
      }

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

  /**
   * ⚡ NUEVO: Demo avanzada que muestra más características
   */
  private async performAdvancedDemo(page: Page): Promise<void> {
    console.log('🎯 Performing advanced demo with full workflow...');

    try {
      const forms = [
        { id: SELECTORS.FORM_OPTIONS.HAIKU, wait: 1500 },
        { id: SELECTORS.FORM_OPTIONS.TANKA, wait: 1500 },
        { id: SELECTORS.FORM_OPTIONS.LIMERICK, wait: 1500 },
      ];

      for (const form of forms) {
        await TestHelpers.selectPoetryForm(page, form.id);
        await BrowserManager.wait(form.wait);
        console.log(`✅ Demo: Form ${form.id}`);
      }

      await TestHelpers.selectPoetryForm(page, SELECTORS.FORM_OPTIONS.HAIKU);
      await BrowserManager.wait(1000);

      const demoPoem = [
        'Silent morning light',
        'Cherry blossoms gently fall',
        'Spring awakens slow',
      ];

      await TestHelpers.fillPoemLines(page, demoPoem);
      await BrowserManager.wait(2000);
      console.log('✅ Demo: Custom poem written');

      const analyzeButton = page.locator(SELECTORS.BUTTONS.ANALYZE).first();
      if ((await analyzeButton.isVisible()) && (await analyzeButton.isEnabled())) {
        await analyzeButton.click();
        console.log('🔍 Demo: Analysis started');

        await BrowserManager.wait(6000);

        const resultsVisible = await page
          .locator(SELECTORS.RESULTS.CONTAINER)
          .isVisible({ timeout: 3000 })
          .catch(() => false);

        if (resultsVisible) {
          console.log('✅ Demo: Results displayed');

          await page.evaluate(() => {
            const results = document.querySelector('app-poem-results');
            if (results) {
              results.scrollTo({ top: 200, behavior: 'smooth' });
            }
          });
          await BrowserManager.wait(1500);

          await page.evaluate(() => {
            const results = document.querySelector('app-poem-results');
            if (results) {
              results.scrollTo({ top: 0, behavior: 'smooth' });
            }
          });
          await BrowserManager.wait(1000);

          const tabs = ['structure', 'rhythm', 'quality'];
          for (const tab of tabs) {
            try {
              const tabButton = page.locator(`.metro-pivot-item:has-text("${tab}")`);
              if (await tabButton.isVisible({ timeout: 2000 })) {
                await tabButton.click();
                await BrowserManager.wait(2000);
                console.log(`✅ Demo: Switched to ${tab} tab`);
              }
            } catch {
              console.log(`⚠️ Demo: Tab ${tab} not available`);
            }
          }
        }
      }

      const copyButton = page.locator(SELECTORS.BUTTONS.COPY).first();
      if ((await copyButton.isVisible()) && (await copyButton.isEnabled())) {
        await copyButton.click();
        await BrowserManager.wait(1500);
        console.log('✅ Demo: Copy function');
      }

      await TestHelpers.loadExample(page);
      await BrowserManager.wait(2000);
      console.log('✅ Demo: Official example loaded');

      await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' }));
      await BrowserManager.wait(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await BrowserManager.wait(1000);

      console.log('✅ Advanced demo completed successfully');
    } catch (error) {
      console.log(
        '⚠️ Some advanced demo actions failed:',
        error instanceof Error ? error.message : error
      );
    }
  }

  /**
   * Busca el archivo de video más reciente en el directorio de salida
   */
  private async findLatestVideoFile(outputDir: string): Promise<string> {
    try {
      const fs = await import('fs/promises');

      if (!existsSync(outputDir)) {
        console.log('⚠️ Output directory does not exist');
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
        console.log('⚠️ No video files found in directory');
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

      if (latestFile) {
        console.log(`📹 Latest video file: ${latestFile}`);
      }

      return latestFile;
    } catch (error) {
      console.warn('⚠️ Error finding video file:', error);
      return '';
    }
  }

  /**
   * Captura rápida de video con configuración predeterminada
   */
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

  /**
   * Captura de demo básica (15 segundos con interacciones estándar)
   */
  static async captureDemo(): Promise<CaptureResult> {
    return await this.quickCapture(SHARED_CONFIG.baseURL, 20000);
  }

  /**
   * Captura de demo completa (30 segundos con workflow completo)
   */
  static async captureFullDemo(): Promise<CaptureResult> {
    const capture = new VideoCapture({
      url: SHARED_CONFIG.baseURL,
      duration: 30000,
      browserType: 'brave',
      showInteractions: true,
      includeAdvancedDemo: true,
    });
    return await capture.capture();
  }
}

export async function captureVideo(options?: VideoCaptureOptions): Promise<CaptureResult> {
  const capture = new VideoCapture(options);
  return await capture.capture();
}
