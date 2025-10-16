import type { Meta, StoryObj } from '@storybook/angular';
import { CardComponent } from './card.component';

const meta: Meta<CardComponent> = {
  title: 'Metro UI/Card',
  component: CardComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated'],
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'small', 'medium', 'large'],
    },
    clickable: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<CardComponent>;

export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'medium',
    clickable: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [variant]="variant" [padding]="padding" [clickable]="clickable">
        <h3 class="text-lg font-semibold tracking-tight text-onSurface mb-2">card title</h3>
        <p class="text-sm text-onSurfaceVariant">
          This is a card component with default styling. 
          Cards are used to group related content together.
        </p>
      </app-card>
    `,
  }),
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'medium',
    clickable: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [variant]="variant" [padding]="padding" [clickable]="clickable">
        <h3 class="text-lg font-semibold tracking-tight text-onSurface mb-2">elevated card</h3>
        <p class="text-sm text-onSurfaceVariant">
          This card has an elevated appearance with shadow.
        </p>
      </app-card>
    `,
  }),
};

export const Clickable: Story = {
  args: {
    variant: 'default',
    padding: 'medium',
    clickable: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [variant]="variant" [padding]="padding" [clickable]="clickable">
        <h3 class="text-lg font-semibold tracking-tight text-onSurface mb-2">clickable card</h3>
        <p class="text-sm text-onSurfaceVariant">
          Hover over this card to see the interactive effect.
        </p>
      </app-card>
    `,
  }),
};

export const SmallPadding: Story = {
  args: {
    variant: 'default',
    padding: 'small',
    clickable: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [variant]="variant" [padding]="padding" [clickable]="clickable">
        <p class="text-sm text-onSurface">Compact card with small padding</p>
      </app-card>
    `,
  }),
};

export const LargePadding: Story = {
  args: {
    variant: 'default',
    padding: 'large',
    clickable: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [variant]="variant" [padding]="padding" [clickable]="clickable">
        <h3 class="text-xl font-semibold tracking-tight text-onSurface mb-4">spacious card</h3>
        <p class="text-base text-onSurfaceVariant mb-4">
          This card has large padding for more breathing room.
        </p>
        <p class="text-sm text-onSurfaceVariant">
          Perfect for hero sections or important content.
        </p>
      </app-card>
    `,
  }),
};

export const NoPadding: Story = {
  args: {
    variant: 'default',
    padding: 'none',
    clickable: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-card [variant]="variant" [padding]="padding" [clickable]="clickable">
        <div class="p-4 border-b border-outlineVariant">
          <h3 class="text-lg font-semibold tracking-tight text-onSurface">header</h3>
        </div>
        <div class="p-4">
          <p class="text-sm text-onSurfaceVariant">Content with custom internal padding</p>
        </div>
      </app-card>
    `,
  }),
};
