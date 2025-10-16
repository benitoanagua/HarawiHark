import type { Meta, StoryObj } from '@storybook/angular';
import { LoadingSpinnerComponent } from './loading-spinner.component';

const meta: Meta<LoadingSpinnerComponent> = {
  title: 'Metro UI/Loading Spinner',
  component: LoadingSpinnerComponent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    text: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<LoadingSpinnerComponent>;

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const WithText: Story = {
  args: {
    size: 'medium',
    text: 'analyzing your poem...',
  },
};

export const LargeWithText: Story = {
  args: {
    size: 'large',
    text: 'counting syllables...',
  },
};

export const InCard: Story = {
  render: () => ({
    template: `
      <div class="bg-surface p-8 border border-outlineVariant">
        <app-loading-spinner size="large" text="processing..." />
      </div>
    `,
  }),
};
