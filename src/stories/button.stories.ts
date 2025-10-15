import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Metro UI/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
    },
  },
  args: { label: 'Button' },
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button 
        class="btn-base btn-medium btn-primary"
        [attr.data-theme]="theme"
      >
        {{ label }}
      </button>
    `,
  }),
  args: {
    variant: 'primary',
    label: 'Primary Button',
    theme: 'light',
  },
};

export const Secondary: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button 
        class="btn-base btn-medium btn-secondary"
        [attr.data-theme]="theme"
      >
        {{ label }}
      </button>
    `,
  }),
  args: {
    variant: 'secondary',
    label: 'Secondary Button',
    theme: 'light',
  },
};

export const Outline: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button 
        class="btn-base btn-medium btn-outline"
        [attr.data-theme]="theme"
      >
        {{ label }}
      </button>
    `,
  }),
  args: {
    variant: 'outline',
    label: 'Outline Button',
    theme: 'light',
  },
};

export const Small: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button 
        class="btn-base btn-small btn-primary"
        [attr.data-theme]="theme"
      >
        {{ label }}
      </button>
    `,
  }),
  args: {
    size: 'small',
    label: 'Small Button',
    variant: 'primary',
  },
};

export const Large: Story = {
  render: (args) => ({
    props: args,
    template: `
      <button 
        class="btn-base btn-large btn-primary"
        [attr.data-theme]="theme"
      >
        {{ label }}
      </button>
    `,
  }),
  args: {
    size: 'large',
    label: 'Large Button',
    variant: 'primary',
  },
};
