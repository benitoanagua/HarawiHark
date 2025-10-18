import type { Meta, StoryObj } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';

const meta: Meta<TooltipComponent> = {
  title: 'Metro UI/Tooltip',
  component: TooltipComponent,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: { type: 'text' },
    },
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<TooltipComponent>;

export const Top: Story = {
  args: {
    text: 'This is a tooltip on top',
    position: 'top',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8 flex justify-center">
        <app-tooltip [text]="text" [position]="position">
          <button class="px-4 py-2 bg-primary text-onPrimary text-sm">
            hover me (top)
          </button>
        </app-tooltip>
      </div>
    `,
  }),
};

export const Bottom: Story = {
  args: {
    text: 'This tooltip appears below',
    position: 'bottom',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8 flex justify-center">
        <app-tooltip [text]="text" [position]="position">
          <button class="px-4 py-2 bg-primary text-onPrimary text-sm">
            hover me (bottom)
          </button>
        </app-tooltip>
      </div>
    `,
  }),
};

export const Left: Story = {
  args: {
    text: 'Tooltip on the left side',
    position: 'left',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8 flex justify-center">
        <app-tooltip [text]="text" [position]="position">
          <button class="px-4 py-2 bg-primary text-onPrimary text-sm">
            hover me (left)
          </button>
        </app-tooltip>
      </div>
    `,
  }),
};

export const Right: Story = {
  args: {
    text: 'Tooltip on the right side',
    position: 'right',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8 flex justify-center">
        <app-tooltip [text]="text" [position]="position">
          <button class="px-4 py-2 bg-primary text-onPrimary text-sm">
            hover me (right)
          </button>
        </app-tooltip>
      </div>
    `,
  }),
};

export const WithIcon: Story = {
  args: {
    text: 'Noun - 2 syllables',
    position: 'top',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8 flex justify-center">
        <app-tooltip [text]="text" [position]="position">
          <span class="inline-flex items-center gap-1 text-onSurface cursor-help">
            beautiful
            <span class="icon-[iconoir--info-circle] text-sm text-primary"></span>
          </span>
        </app-tooltip>
      </div>
    `,
  }),
};

export const PoetryContext: Story = {
  args: {
    text: 'Verb - 1 syllable - Present tense',
    position: 'top',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8">
        <p class="text-base text-onSurface">
          The 
          <app-tooltip [text]="'Adjective - 2 syllables'" position="top">
            <span class="text-primary underline decoration-dotted cursor-help">gentle</span>
          </app-tooltip>
          wind 
          <app-tooltip [text]="text" position="top">
            <span class="text-primary underline decoration-dotted cursor-help">blows</span>
          </app-tooltip>
          through the trees
        </p>
      </div>
    `,
  }),
};

export const AllPositions: Story = {
  render: () => ({
    template: `
      <div class="p-12 grid grid-cols-2 gap-8 place-items-center">
        <!-- Top -->
        <app-tooltip text="Top tooltip" position="top">
          <button class="px-3 py-1 bg-primary text-onPrimary text-xs">top</button>
        </app-tooltip>

        <!-- Bottom -->
        <app-tooltip text="Bottom tooltip" position="bottom">
          <button class="px-3 py-1 bg-primary text-onPrimary text-xs">bottom</button>
        </app-tooltip>

        <!-- Left -->
        <app-tooltip text="Left tooltip" position="left">
          <button class="px-3 py-1 bg-primary text-onPrimary text-xs">left</button>
        </app-tooltip>

        <!-- Right -->
        <app-tooltip text="Right tooltip" position="right">
          <button class="px-3 py-1 bg-primary text-onPrimary text-xs">right</button>
        </app-tooltip>
      </div>
    `,
  }),
};

export const LongContent: Story = {
  args: {
    text: 'This is a longer tooltip that provides more detailed information about the element. It can span multiple lines if needed.',
    position: 'top',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8 flex justify-center">
        <app-tooltip [text]="text" [position]="position">
          <button class="px-4 py-2 bg-primary text-onPrimary text-sm">
            detailed info
          </button>
        </app-tooltip>
      </div>
    `,
  }),
};
