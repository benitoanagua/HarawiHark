import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';

setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  decorators: [
    (story) => {
      const storyData = story();
      const theme = (storyData as any).props?.['theme'] || 'light';
      return {
        ...storyData,
        template: `
          <div data-theme="${theme}" style="min-height: 100vh;">
            ${storyData.template}
          </div>
        `,
      };
    },
  ],
};

export default preview;
