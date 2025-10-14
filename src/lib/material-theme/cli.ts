import { generateThemeFiles } from './theme-generator';

const root = process.cwd();
const outputDir = 'src/styles';

generateThemeFiles(root, outputDir);
