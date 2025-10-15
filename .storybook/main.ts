import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  typescript: {
    check: false,
    skipCompiler: true,
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
