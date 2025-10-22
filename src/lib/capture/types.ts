export interface CaptureOptions {
  outputDir?: string;
  url?: string;
  viewport?: { width: number; height: number };
  delay?: number;
  format?: 'mp4' | 'gif' | 'webm';
  duration?: number;
  mode?: 'basic' | 'advanced' | 'full' | 'overview' | 'detailed' | 'all';
  multiple?: boolean;
  browserType?: 'brave' | 'chrome' | 'firefox';
}

export interface CaptureResult {
  success: boolean;
  outputPath: string;
  duration: number;
  timestamp: string;
  url: string;
  mode?: string;
  sections?: { name: string; path: string }[];
  error?: string;
}

export interface BrowserLaunchOptions {
  headless?: boolean;
  viewport?: { width: number; height: number };
  recordVideo?: boolean;
  videoSize?: { width: number; height: number };
  browserType?: 'brave' | 'chrome' | 'firefox';
  timeout?: number;
}
