import type { Meta, StoryObj } from '@storybook/angular';
import { StatusMessageComponent } from './status-message.component';

const meta: Meta<StatusMessageComponent> = {
  title: 'Metro UI/Status Message',
  component: StatusMessageComponent,
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
      options: ['info', 'warning', 'error', 'success'],
    },
    actionLabel: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<StatusMessageComponent>;

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

export const Success: Story = {
  args: {
    title: 'analysis complete',
    message: 'Your poem matches the haiku pattern perfectly!',
    severity: 'success',
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

export const SuccessWithAction: Story = {
  args: {
    title: 'poem saved',
    message: 'Your poem has been saved successfully.',
    severity: 'success',
    actionLabel: 'view poems',
  },
};

export const AllStatuses: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <app-status-message
          title="info"
          message="This is an informational message."
          severity="info"
        />
        <app-status-message
          title="warning"
          message="This is a warning message."
          severity="warning"
        />
        <app-status-message
          title="error"
          message="This is an error message."
          severity="error"
        />
        <app-status-message
          title="success"
          message="This is a success message."
          severity="success"
        />
      </div>
    `,
  }),
};
