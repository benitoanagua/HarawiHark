import { generateThemeFiles } from './theme-generator';
import { generateTerminalFiles } from './terminal-generator';
import { getConfigInfo } from './theme.config';

const root = process.cwd();
const outputDir = 'src/styles';

console.log(getConfigInfo());
console.log('\n🚀 Starting theme generation...\n');

generateThemeFiles(root, outputDir);

console.log('\n---\n');

generateTerminalFiles(root, outputDir);

console.log('\n🎉 All themes generated successfully!');
