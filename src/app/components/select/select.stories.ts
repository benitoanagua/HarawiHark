import type { Meta, StoryObj } from '@storybook/angular';
import { SelectComponent } from './select.component';

const poetryForms = [
  { value: 'haiku', label: 'haiku', description: '5-7-5' },
  { value: 'tanka', label: 'tanka', description: '5-7-5-7-7' },
  { value: 'cinquain', label: 'cinquain', description: '2-4-6-8-2' },
  { value: 'limerick', label: 'limerick', description: '8-8-5-5-8' },
  { value: 'sonnet', label: 'sonnet', description: '14 lines' },
];

const meta: Meta<SelectComponent> = {
  title: 'Metro UI/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<SelectComponent>;

export const Default: Story = {
  args: {
    label: 'poetry form',
    options: poetryForms,
    disabled: false,
  },
};

export const WithoutLabel: Story = {
  args: {
    options: poetryForms,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'poetry form',
    options: poetryForms,
    disabled: true,
  },
};

export const SimpleOptions: Story = {
  args: {
    label: 'language',
    options: [
      { value: 'en', label: 'english' },
      { value: 'es', label: 'español' },
      { value: 'fr', label: 'français' },
    ],
    disabled: false,
  },
};
