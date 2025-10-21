import { captureVideo } from './video-capture';
import { captureScreenshots } from './screenshot-capture';
import { Command } from 'commander';

const program = new Command();

program
  .name('angular-capture')
  .description('CLI to capture videos and screenshots of the Angular application')
  .version('1.0.0');

// Command for video
// En src/lib/capture/cli.ts - actualiza el comando video
program
  .command('video')
  .description('Capture video of the application')
  .option('-u, --url <url>', 'Application URL', 'http://localhost:4200')
  .option('-o, --output-dir <dir>', 'Output directory', 'angular-captures/videos')
  .option('-d, --delay <ms>', 'Delay before capture', '3000')
  .option('-f, --format <format>', 'Video format', 'mp4')
  .option('-t, --duration <seconds>', 'Video duration', '10')
  .option('-b, --browser <browser>', 'Browser to use: brave, chrome, firefox', 'brave')
  .action(
    async (options: {
      url: string;
      outputDir: string;
      delay: string;
      format: string;
      duration: string;
      browser: string;
    }) => {
      console.log('🎬 Starting video capture...');

      const result = await captureVideo({
        url: options.url,
        outputDir: options.outputDir,
        delay: parseInt(options.delay),
        format: options.format as 'mp4' | 'gif' | 'webm',
        duration: parseInt(options.duration) * 1000,
        browserType: options.browser as 'brave' | 'chrome' | 'firefox',
      });

      if (result.success) {
        console.log(`✅ Video saved at: ${result.outputPath}`);
        console.log(`⏱️ Duration: ${result.duration}ms`);
        console.log(`🌐 URL: ${result.url}`);
      } else {
        console.error('❌ Error in video capture');
        process.exit(1);
      }
    }
  );

// Command for screenshots
program
  .command('screenshots')
  .description('Capture screenshots of the application')
  .option('-u, --url <url>', 'Application URL', 'http://localhost:4200')
  .option('-o, --output-dir <dir>', 'Output directory', 'angular-captures/screenshots')
  .option('-d, --delay <ms>', 'Delay before capture', '2000')
  .option('-m, --multiple', 'Capture multiple sections', false)
  .action(async (options: { url: string; outputDir: string; delay: string; multiple: boolean }) => {
    console.log('📸 Starting screenshot capture...');

    const result = await captureScreenshots({
      url: options.url,
      outputDir: options.outputDir,
      delay: parseInt(options.delay),
      multiple: options.multiple,
    });

    if (result.success) {
      console.log(`✅ Screenshots saved in: ${result.outputPath}`);
      console.log(`🌐 URL: ${result.url}`);
    } else {
      console.error('❌ Error in screenshot capture');
      process.exit(1);
    }
  });

// Interactive command
program
  .command('interactive')
  .description('Interactive mode for captures')
  .action(async () => {
    const inquirer = await import('inquirer');

    const { captureType } = await inquirer.default.prompt([
      {
        type: 'list',
        name: 'captureType',
        message: 'What type of capture do you want?',
        choices: [
          { name: '🎬 Application video', value: 'video' },
          { name: '📸 Application screenshots', value: 'screenshots' },
        ],
      },
    ]);

    const { url } = await inquirer.default.prompt([
      {
        type: 'input',
        name: 'url',
        message: 'Angular application URL:',
        default: 'http://localhost:4200',
      },
    ]);

    if (captureType === 'video') {
      await captureVideo({ url });
    } else {
      await captureScreenshots({ url });
    }
  });

program.parse();
