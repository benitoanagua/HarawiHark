import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/app/components/**/*.stories.ts'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  staticDirs: ['../public'],
  typescript: {
    check: false,
    skipCompiler: true,
  },
  // Configuración crítica para Tailwind 4
  webpackFinal: async (config) => {
    // Agregar soporte para PostCSS y Tailwind
    const cssRule = {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [require('@tailwindcss/postcss')],
            },
          },
        },
      ],
      exclude: /\.module\.css$/,
    };

    // Remover reglas CSS existentes de Storybook
    if (config.module?.rules) {
      config.module.rules = config.module.rules.filter((rule) => {
        if (typeof rule === 'object' && rule && 'test' in rule) {
          return !(rule.test instanceof RegExp && rule.test.test('.css'));
        }
        return true;
      });

      // Agregar nuestra regla CSS
      config.module.rules.push(cssRule);
    }

    return config;
  },
};

export default config;
