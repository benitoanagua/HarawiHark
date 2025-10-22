import { captureVideo } from './video-capture';
import { captureScreenshots } from './screenshot-capture';
import { Command } from 'commander';

const program = new Command();

program
  .name('angular-capture')
  .description('Capture videos and screenshots of the Angular application')
  .version('1.0.0');

// Video command
program
  .command('video')
  .description('Capture application video')
  .option('-u, --url <url>', 'Application URL', 'http://localhost:4200')
  .option('-o, --output-dir <dir>', 'Output directory', 'angular-captures/videos')
  .option('-d, --delay <ms>', 'Delay before capture', '3000')
  .option('-t, --duration <seconds>', 'Video duration', '10')
  .option('-b, --browser <browser>', 'Browser: brave, chrome, firefox', 'brave')
  .action(async (options) => {
    console.log('🎬 Starting video capture...');

    const result = await captureVideo({
      url: options.url,
      outputDir: options.outputDir,
      delay: parseInt(options.delay),
      duration: parseInt(options.duration) * 1000,
      browserType: options.browser,
    });

    if (result.success) {
      console.log(`✅ Video saved: ${result.outputPath}`);
    } else {
      console.error('❌ Video capture failed');
      process.exit(1);
    }
  });

// Screenshots command
program
  .command('screenshots')
  .description('Capture application screenshots')
  .option('-u, --url <url>', 'Application URL', 'http://localhost:4200')
  .option('-o, --output-dir <dir>', 'Output directory', 'angular-captures/screenshots')
  .option('-d, --delay <ms>', 'Delay before capture', '2000')
  .option('-m, --multiple', 'Capture multiple sections', false)
  .option('-b, --browser <browser>', 'Browser: brave, chrome, firefox', 'brave')
  .action(async (options) => {
    console.log('📸 Starting screenshot capture...');

    const result = await captureScreenshots({
      url: options.url,
      outputDir: options.outputDir,
      delay: parseInt(options.delay),
      multiple: options.multiple,
      browserType: options.browser,
    });

    if (result.success) {
      console.log(`✅ Screenshots saved: ${result.outputPath}`);
    } else {
      console.error('❌ Screenshot capture failed');
      process.exit(1);
    }
  });

// Interactive command
program
  .command('interactive')
  .description('Interactive capture mode')
  .action(async () => {
    const inquirer = await import('inquirer');

    const { captureType } = await inquirer.default.prompt([
      {
        type: 'list',
        name: 'captureType',
        message: 'Select capture type:',
        choices: [
          { name: '🎬 Video', value: 'video' },
          { name: '📸 Screenshots', value: 'screenshots' },
        ],
      },
    ]);

    const { url } = await inquirer.default.prompt([
      {
        type: 'input',
        name: 'url',
        message: 'Application URL:',
        default: 'http://localhost:4200',
      },
    ]);

    const { browser } = await inquirer.default.prompt([
      {
        type: 'list',
        name: 'browser',
        message: 'Select browser:',
        choices: ['brave', 'chrome', 'firefox'],
        default: 'brave',
      },
    ]);

    if (captureType === 'video') {
      await captureVideo({ url, browserType: browser });
    } else {
      await captureScreenshots({ url, browserType: browser, multiple: true });
    }
  });

program.parse();
