import { captureVideo, VideoCapture } from './video-capture';
import { captureScreenshots } from './screenshot-capture';
import { Command } from 'commander';

const program = new Command();

program
  .name('angular-capture')
  .description('Capture videos and screenshots of the HarawiHark Angular application')
  .version('1.0.0');

program
  .command('video')
  .description('Capture application video demonstration')
  .option('-u, --url <url>', 'Application URL', 'http://localhost:4200')
  .option('-o, --output-dir <dir>', 'Output directory', 'angular-captures/videos')
  .option('-d, --delay <ms>', 'Delay before capture', '3000')
  .option('-t, --duration <seconds>', 'Video duration', '15')
  .option('-b, --browser <browser>', 'Browser: brave, chrome, firefox', 'brave')
  .option('--no-interactions', 'Skip demo interactions', false)
  .option('--advanced', 'Use advanced demo with full workflow', false)
  .action(async (options) => {
    console.log('🎬 Starting poetry editor video capture...');

    const result = await captureVideo({
      url: options.url,
      outputDir: options.outputDir,
      delay: parseInt(options.delay),
      duration: parseInt(options.duration) * 1000,
      browserType: options.browser,
      showInteractions: options.interactions,
      includeAdvancedDemo: options.advanced,
    });

    if (result.success) {
      console.log(`✅ Video saved: ${result.outputPath}`);
      console.log(`⏱️ Duration: ${result.duration}ms`);
    } else {
      console.error('❌ Video capture failed:', result.error);
      process.exit(1);
    }
  });

program
  .command('screenshots')
  .description('Capture application screenshots')
  .option('-u, --url <url>', 'Application URL', 'http://localhost:4200')
  .option('-o, --output-dir <dir>', 'Output directory', 'angular-captures/screenshots')
  .option('-d, --delay <ms>', 'Delay before capture', '2000')
  .option('-m, --multiple', 'Capture multiple sections and states', true)
  .option('-b, --browser <browser>', 'Browser: brave, chrome, firefox', 'brave')
  .option('--no-interactions', 'Skip interaction states', false)
  .option('-f, --format <format>', 'Image format: png, jpeg', 'png')
  .action(async (options) => {
    console.log('📸 Starting poetry editor screenshot capture...');

    const result = await captureScreenshots({
      url: options.url,
      outputDir: options.outputDir,
      delay: parseInt(options.delay),
      multiple: options.multiple,
      browserType: options.browser,
      captureInteractions: options.interactions,
      screenshotType: options.format as 'png' | 'jpeg',
    });

    if (result.success) {
      console.log(`✅ Screenshots saved: ${result.outputPath}`);
      console.log(`📊 Total screenshots: ${result.sections?.length || 0}`);
    } else {
      console.error('❌ Screenshot capture failed:', result.error);
      process.exit(1);
    }
  });

program
  .command('demo')
  .description('Capture complete application demo (video + screenshots)')
  .option('-u, --url <url>', 'Application URL', 'http://localhost:4200')
  .option('-o, --output-dir <dir>', 'Output directory', 'angular-captures/demo')
  .option('-b, --browser <browser>', 'Browser: brave, chrome, firefox', 'brave')
  .option('--advanced', 'Use advanced demo with full workflow (30s)', false)
  .action(async (options) => {
    console.log('🚀 Starting complete application demo capture...');

    console.log('\n🎬 Capturing video demo...');
    const videoResult = await captureVideo({
      url: options.url,
      outputDir: `${options.outputDir}/videos`,
      browserType: options.browser,
      duration: options.advanced ? 30000 : 20000,
      showInteractions: true,
      includeAdvancedDemo: options.advanced,
    });

    console.log('\n📸 Capturing comprehensive screenshots...');
    const screenshotResult = await captureScreenshots({
      url: options.url,
      outputDir: `${options.outputDir}/screenshots`,
      browserType: options.browser,
      multiple: true,
      captureInteractions: true,
    });

    console.log('\n📊 Demo Capture Summary:');
    console.log(`✅ Video: ${videoResult.success ? 'Saved' : 'Failed'}`);
    console.log(`✅ Screenshots: ${screenshotResult.success ? 'Saved' : 'Failed'}`);

    if (videoResult.success && screenshotResult.success) {
      console.log('🎉 Complete demo captured successfully!');
      console.log(`\n📁 Output locations:`);
      console.log(`   Videos: ${options.outputDir}/videos`);
      console.log(`   Screenshots: ${options.outputDir}/screenshots`);
    } else {
      console.log('❌ Demo capture completed with errors');
      process.exit(1);
    }
  });

program
  .command('quick')
  .description('Quick capture of application overview')
  .option('-b, --browser <browser>', 'Browser: brave, chrome, firefox', 'brave')
  .action(async (options) => {
    console.log('⚡ Quick capturing application overview...');

    const result = await captureScreenshots({
      url: 'http://localhost:4200',
      multiple: true,
      captureInteractions: true,
      browserType: options.browser,
    });

    if (result.success) {
      console.log(`✅ Quick capture completed: ${result.sections?.length} screenshots`);
    } else {
      console.error('❌ Quick capture failed:', result.error);
      process.exit(1);
    }
  });

program
  .command('full-demo')
  .description('Extended demo with complete workflow (30s video + all screenshots)')
  .option('-u, --url <url>', 'Application URL', 'http://localhost:4200')
  .option('-b, --browser <browser>', 'Browser: brave, chrome, firefox', 'brave')
  .action(async () => {
    console.log('🎯 Starting FULL application demo with advanced interactions...');

    const result = await VideoCapture.captureFullDemo();

    if (result.success) {
      console.log(`✅ Full demo video captured: ${result.outputPath}`);
      console.log(`⏱️ Duration: ${Math.round(result.duration / 1000)}s`);
    } else {
      console.error('❌ Full demo capture failed:', result.error);
      process.exit(1);
    }
  });

program.parse();
