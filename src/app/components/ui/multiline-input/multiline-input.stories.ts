import type { Meta, StoryObj } from '@storybook/angular';
import { MultilineInputComponent } from './multiline-input.component';

const meta: Meta<MultilineInputComponent> = {
  title: 'Metro UI/Multiline Input',
  component: MultilineInputComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    error: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
    rows: { control: { type: 'number' } },
    value: { control: { type: 'text' } },
    showLineNumbers: { control: { type: 'boolean' } },
    showLineValidation: { control: { type: 'boolean' } },
    valueChange: { action: 'valueChange' },
    inputBlur: { action: 'inputBlur' },
    lineFocus: { action: 'lineFocus' },
  },
};

export default meta;
type Story = StoryObj<MultilineInputComponent>;

export const Default: Story = {
  args: {
    label: 'your poem',
    placeholder: 'Write your poem line by line...',
    rows: 6,
    showLineNumbers: true,
    showLineValidation: false,
  },
};

export const WithValidation: Story = {
  args: {
    label: 'haiku',
    placeholder: 'Write your haiku here...',
    rows: 3,
    showLineNumbers: true,
    showLineValidation: true,
    expectedPattern: [5, 7, 5],
    value: 'An old silent pond\nA frog jumps into the pond—\nSplash! Silence again.',
  },
};

export const EmptyWithValidation: Story = {
  args: {
    label: 'haiku',
    placeholder: 'Write your haiku (5-7-5 syllables)...',
    rows: 3,
    showLineNumbers: true,
    showLineValidation: true,
    expectedPattern: [5, 7, 5],
  },
};

export const Tanka: Story = {
  args: {
    label: 'tanka',
    placeholder: 'Write your tanka (5-7-5-7-7)...',
    rows: 5,
    showLineNumbers: true,
    showLineValidation: true,
    expectedPattern: [5, 7, 5, 7, 7],
  },
};

export const WithError: Story = {
  args: {
    label: 'your poem',
    placeholder: 'Write your poem here...',
    error: 'Please write at least 3 lines',
    rows: 6,
    showLineNumbers: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'poem content',
    placeholder: 'This editor is disabled',
    rows: 6,
    disabled: true,
    showLineNumbers: true,
  },
};
