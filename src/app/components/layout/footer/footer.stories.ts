import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import { FooterComponent } from './footer.component';

const meta: Meta<FooterComponent> = {
  title: 'Metro UI/Footer',
  component: FooterComponent,
  tags: ['autodocs'],
  decorators: [componentWrapperDecorator((story) => `<div style="width: 100%">${story}</div>`)],
};

export default meta;
type Story = StoryObj<FooterComponent>;

export const Default: Story = {
  args: {},
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {},
};

export const DesktopView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  args: {},
};

export const DarkTheme: Story = {
  parameters: {
    themes: {
      default: 'dark',
    },
  },
  decorators: [
    componentWrapperDecorator(
      (story) => `<div data-theme="dark" style="width: 100%">${story}</div>`
    ),
  ],
  args: {},
};
