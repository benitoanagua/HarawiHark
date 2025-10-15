import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import { HeaderComponent } from './header.component';

const meta: Meta<HeaderComponent> = {
  title: 'Metro UI/Header',
  component: HeaderComponent,
  tags: ['autodocs'],
  decorators: [componentWrapperDecorator((story) => `<div style="width: 100%">${story}</div>`)],
  argTypes: {
    login: { action: 'login' },
    logout: { action: 'logout' },
    createAccount: { action: 'createAccount' },
  },
};

export default meta;
type Story = StoryObj<HeaderComponent>;

export const LoggedIn: Story = {
  args: {
    user: { name: 'Jane Doe' },
  },
};

export const LoggedOut: Story = {
  args: {
    user: null,
  },
};
