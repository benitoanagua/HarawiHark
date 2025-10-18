import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
  title: 'Metro UI/Input',
  component: InputComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'textarea'],
    },
    label: {
      control: { type: 'text' },
    },
    placeholder: {
      control: { type: 'text' },
    },
    error: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    rows: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Text: Story = {
  args: {
    type: 'text',
    label: 'poem title',
    placeholder: 'Enter a title for your poem...',
    disabled: false,
  },
};

export const Textarea: Story = {
  args: {
    type: 'textarea',
    label: 'your poem',
    placeholder: 'Write your poem here, one line per line...',
    rows: 8,
    disabled: false,
  },
};

export const WithError: Story = {
  args: {
    type: 'text',
    label: 'poem title',
    placeholder: 'Enter a title...',
    error: 'Title is required',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    label: 'poem title',
    placeholder: 'This field is disabled',
    disabled: true,
  },
};

export const TextareaWithError: Story = {
  args: {
    type: 'textarea',
    label: 'your poem',
    placeholder: 'Write your poem...',
    error: 'Please enter at least 3 lines',
    rows: 6,
    disabled: false,
  },
};
