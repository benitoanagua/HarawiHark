import type { Meta, StoryObj } from '@storybook/angular';
import { ThemeToggleComponent } from './theme-toggle.component';

const meta: Meta<ThemeToggleComponent> = {
  title: 'Metro UI/ThemeToggle',
  component: ThemeToggleComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ThemeToggleComponent>;

export const Default: Story = {};
