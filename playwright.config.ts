import { defineConfig, devices } from '@playwright/test';

// Argumentos comunes para todos los navegadores
export const COMMON_BROWSER_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-web-security',
  '--disable-features=VizDisplayCompositor',
  '--disable-background-timer-throttling',
  '--disable-dev-shm-usage',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--disable-component-extensions-with-background-pages',
];

// Acceso seguro a variables de entorno
const isCI = process.env['CI'] === 'true';
const videoSetting = isCI ? 'off' : 'retain-on-failure';
const retries = isCI ? 2 : 0;
const workers = isCI ? 1 : undefined;
const reuseExistingServer = !isCI;

// Configuración compartida
export const SHARED_CONFIG = {
  baseURL: 'http://localhost:4200',
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: videoSetting,
} as const;

// Configuración específica para cada navegador - SOLO propiedades válidas para 'use'
export const BROWSER_CONFIG = {
  brave: {
    channel: 'chrome' as const,
    launchOptions: {
      executablePath: '/usr/bin/brave',
      args: [...COMMON_BROWSER_ARGS],
    },
  },
  chrome: {
    channel: 'chrome' as const,
    launchOptions: {
      args: [...COMMON_BROWSER_ARGS],
    },
  },
  firefox: {
    launchOptions: {
      args: [...COMMON_BROWSER_ARGS],
    },
  },
};

export default defineConfig({
  testDir: './e2e-tests',
  outputDir: './test-results/artifacts',
  snapshotDir: './test-results/snapshots',

  fullyParallel: true,
  forbidOnly: !!isCI,
  retries: retries,
  workers: workers,

  reporter: [
    ['html', { outputFolder: './test-results/html-report' }],
    ['json', { outputFile: './test-results/test-results.json' }],
  ],

  use: SHARED_CONFIG,

  projects: [
    {
      name: 'brave',
      use: {
        ...devices['Desktop Chrome'],
        ...BROWSER_CONFIG.brave,
      },
    },
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        ...BROWSER_CONFIG.chrome,
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        ...BROWSER_CONFIG.firefox,
      },
    },
  ],

  webServer: {
    command: 'ng serve',
    url: 'http://localhost:4200',
    reuseExistingServer: reuseExistingServer,
    timeout: 180000,
  },
});
