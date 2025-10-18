import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'Metro UI/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'info', 'success', 'warning', 'error'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium'],
    },
    icon: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'medium',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-badge [variant]="variant" [size]="size">
        default
      </app-badge>
    `,
  }),
};

export const Info: Story = {
  args: {
    variant: 'info',
    size: 'medium',
    icon: 'icon-[iconoir--info-circle]',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-badge [variant]="variant" [size]="size" [icon]="icon">
        info
      </app-badge>
    `,
  }),
};

export const Success: Story = {
  args: {
    variant: 'success',
    size: 'medium',
    icon: 'icon-[iconoir--check]',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-badge [variant]="variant" [size]="size" [icon]="icon">
        pattern matched
      </app-badge>
    `,
  }),
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    size: 'medium',
    icon: 'icon-[iconoir--warning-triangle]',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-badge [variant]="variant" [size]="size" [icon]="icon">
        check syllables
      </app-badge>
    `,
  }),
};

export const Error: Story = {
  args: {
    variant: 'error',
    size: 'medium',
    icon: 'icon-[iconoir--cancel]',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-badge [variant]="variant" [size]="size" [icon]="icon">
        pattern mismatch
      </app-badge>
    `,
  }),
};

export const Small: Story = {
  args: {
    variant: 'success',
    size: 'small',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-badge [variant]="variant" [size]="size">
        5 syllables
      </app-badge>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-3">
        <app-badge variant="default" size="medium">default</app-badge>
        <app-badge variant="info" size="medium" icon="icon-[iconoir--info-circle]">info</app-badge>
        <app-badge variant="success" size="medium" icon="icon-[iconoir--check]">success</app-badge>
        <app-badge variant="warning" size="medium" icon="icon-[iconoir--warning-triangle]">warning</app-badge>
        <app-badge variant="error" size="medium" icon="icon-[iconoir--cancel]">error</app-badge>
      </div>
    `,
  }),
};

export const WithoutIcons: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-3">
        <app-badge variant="default" size="medium">default</app-badge>
        <app-badge variant="info" size="medium">info</app-badge>
        <app-badge variant="success" size="medium">success</app-badge>
        <app-badge variant="warning" size="medium">warning</app-badge>
        <app-badge variant="error" size="medium">error</app-badge>
      </div>
    `,
  }),
};
