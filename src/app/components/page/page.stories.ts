import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import { PageComponent } from './page.component';

const meta: Meta<PageComponent> = {
  title: 'Metro UI/Page',
  component: PageComponent,
  tags: ['autodocs'],
  decorators: [componentWrapperDecorator((story) => `<div style="width: 100%">${story}</div>`)],
};

export default meta;
type Story = StoryObj<PageComponent>;

export const Default: Story = {
  args: {
    user: null,
  },
};

export const LoggedIn: Story = {
  args: {
    user: { name: 'Jane Doe' },
  },
};
