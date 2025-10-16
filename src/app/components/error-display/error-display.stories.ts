import type { Meta, StoryObj } from '@storybook/angular';
import { ErrorDisplayComponent } from './error-display.component';

const meta: Meta<ErrorDisplayComponent> = {
  title: 'Metro UI/Error Display',
  component: ErrorDisplayComponent,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    message: {
      control: { type: 'text' },
    },
    severity: {
      control: { type: 'select' },
      options: ['info', 'warning', 'error'],
    },
    actionLabel: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<ErrorDisplayComponent>;

export const Info: Story = {
  args: {
    title: 'info',
    message: 'This is an informational message about syllable counting.',
    severity: 'info',
  },
};

export const Warning: Story = {
  args: {
    title: 'syllable mismatch',
    message: 'Line 2 has 6 syllables but expected 7 for this haiku pattern.',
    severity: 'warning',
  },
};

export const Error: Story = {
  args: {
    title: 'analysis failed',
    message: 'Please enter at least 3 lines to analyze as a haiku.',
    severity: 'error',
  },
};

export const WithAction: Story = {
  args: {
    title: 'pattern not found',
    message: 'The selected poetry form could not be loaded.',
    severity: 'error',
    actionLabel: 'retry',
  },
};

export const ValidationError: Story = {
  args: {
    title: 'validation error',
    message: 'Empty lines are not allowed. Please write at least one word per line.',
    severity: 'error',
    actionLabel: 'clear input',
  },
};

export const AllSeverities: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <app-error-display
          title="info"
          message="This is an informational message."
          severity="info"
        />
        <app-error-display
          title="warning"
          message="This is a warning message."
          severity="warning"
        />
        <app-error-display
          title="error"
          message="This is an error message."
          severity="error"
        />
      </div>
    `,
  }),
};
