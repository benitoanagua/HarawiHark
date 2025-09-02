import { generateThemeFiles } from './theme-generator.js';
import { resolve } from 'path';

const root = process.cwd();
const outputDir = 'src/lib/tokens';

generateThemeFiles(root, outputDir);
