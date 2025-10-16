import { generateThemeFiles } from './theme-generator';
import { generateTerminalPastelFiles } from './terminal-pastel-generator';
import { getConfigInfo } from './theme.config';

const root = process.cwd();
const outputDir = 'src/styles';

console.log(getConfigInfo());
console.log('\n🚀 Starting theme generation...\n');

generateThemeFiles(root, outputDir);

console.log('\n---\n');

generateTerminalPastelFiles(root, outputDir);

console.log('\n🎉 All themes generated successfully!');
