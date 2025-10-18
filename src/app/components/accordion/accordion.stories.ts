import type { Meta, StoryObj } from '@storybook/angular';
import { AccordionComponent } from './accordion.component';

const meta: Meta<AccordionComponent> = {
  title: 'Metro UI/Accordion',
  component: AccordionComponent,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    expanded: {
      control: { type: 'boolean' },
    },
    icon: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<AccordionComponent>;

export const Default: Story = {
  args: {
    title: 'line analysis details',
    expanded: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-accordion [title]="title" [expanded]="expanded">
        <div class="space-y-2">
          <p class="text-sm text-onSurface">This line contains 5 syllables.</p>
          <div class="flex gap-2">
            <span class="text-xs px-2 py-1 bg-surfaceVariant">noun</span>
            <span class="text-xs px-2 py-1 bg-surfaceVariant">verb</span>
            <span class="text-xs px-2 py-1 bg-surfaceVariant">adjective</span>
          </div>
        </div>
      </app-accordion>
    `,
  }),
};

export const WithIcon: Story = {
  args: {
    title: 'syllable breakdown',
    expanded: false,
    icon: 'icon-[iconoir--sound-high]',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-accordion [title]="title" [expanded]="expanded" [icon]="icon">
        <div class="space-y-2">
          <p class="text-sm text-onSurface">Detailed syllable analysis:</p>
          <ul class="text-sm text-onSurfaceVariant list-disc list-inside">
            <li>Word 1: 2 syllables</li>
            <li>Word 2: 1 syllable</li>
            <li>Word 3: 2 syllables</li>
          </ul>
        </div>
      </app-accordion>
    `,
  }),
};

export const Expanded: Story = {
  args: {
    title: 'rhyme scheme analysis',
    expanded: true,
    icon: 'icon-[iconoir--music-double-note]',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-accordion [title]="title" [expanded]="expanded" [icon]="icon">
        <div class="space-y-2">
          <p class="text-sm text-onSurface">Rhyme pattern: AABBA</p>
          <div class="text-xs text-onSurfaceVariant">
            <p>Line 1 (A): ends with "day"</p>
            <p>Line 2 (A): ends with "way"</p>
            <p>Line 3 (B): ends with "night"</p>
            <p>Line 4 (B): ends with "light"</p>
            <p>Line 5 (A): ends with "play"</p>
          </div>
        </div>
      </app-accordion>
    `,
  }),
};

export const MultipleAccordions: Story = {
  render: () => ({
    template: `
      <div class="space-2">
        <app-accordion title="line 1 analysis" expanded="false">
          <p class="text-sm text-onSurface">5 syllables - perfect match</p>
        </app-accordion>
        
        <app-accordion title="line 2 analysis" expanded="false">
          <p class="text-sm text-onSurface">7 syllables - perfect match</p>
        </app-accordion>
        
        <app-accordion title="line 3 analysis" expanded="false">
          <p class="text-sm text-onSurface">5 syllables - perfect match</p>
        </app-accordion>
      </div>
    `,
  }),
};

export const WithComplexContent: Story = {
  args: {
    title: 'complete poem analysis',
    expanded: false,
    icon: 'icon-[iconoir--book-stack]',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-accordion [title]="title" [expanded]="expanded" [icon]="icon">
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-semibold text-onSurface mb-2">syllable pattern</h4>
            <p class="text-sm text-onSurfaceVariant">5-7-5 (haiku)</p>
          </div>
          
          <div>
            <h4 class="text-sm font-semibold text-onSurface mb-2">rhyme scheme</h4>
            <p class="text-sm text-onSurfaceVariant">AAB</p>
          </div>
          
          <div>
            <h4 class="text-sm font-semibold text-onSurface mb-2">meter</h4>
            <p class="text-sm text-onSurfaceVariant">Iambic pentameter</p>
          </div>
        </div>
      </app-accordion>
    `,
  }),
};
