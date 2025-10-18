import type { Meta, StoryObj } from '@storybook/angular';
import { QuickStatsPanelComponent } from './quick-stats-panel.component';
import type { QuickStats } from './quick-stats-panel.component';

const meta: Meta<QuickStatsPanelComponent> = {
  title: 'Metro UI/Quick Stats Panel',
  component: QuickStatsPanelComponent,
  tags: ['autodocs'],
  argTypes: {
    stats: {
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<QuickStatsPanelComponent>;

const defaultStats: QuickStats = {
  totalSyllables: 42,
  avgSyllablesPerLine: 5.7,
  vocabularyRichness: 85.5,
  patternMatch: 'Perfect',
};

export const Default: Story = {
  args: {
    stats: defaultStats,
  },
};

export const PartialMatch: Story = {
  args: {
    stats: {
      totalSyllables: 36,
      avgSyllablesPerLine: 4.5,
      vocabularyRichness: 72.3,
      patternMatch: 'Partial',
    },
  },
};

export const LowVocabulary: Story = {
  args: {
    stats: {
      totalSyllables: 28,
      avgSyllablesPerLine: 3.5,
      vocabularyRichness: 45.2,
      patternMatch: 'Partial',
    },
  },
};

export const HaikuStats: Story = {
  args: {
    stats: {
      totalSyllables: 17,
      avgSyllablesPerLine: 5.7,
      vocabularyRichness: 92.1,
      patternMatch: 'Perfect',
    },
  },
};

export const TankaStats: Story = {
  args: {
    stats: {
      totalSyllables: 31,
      avgSyllablesPerLine: 6.2,
      vocabularyRichness: 88.7,
      patternMatch: 'Perfect',
    },
  },
};

export const AllStats: Story = {
  render: () => ({
    template: `
      <div class="space-y-4">
        <app-quick-stats-panel 
          [stats]="{
            totalSyllables: 17,
            avgSyllablesPerLine: 5.7,
            vocabularyRichness: 92.1,
            patternMatch: 'Perfect'
          }"
        />
        
        <app-quick-stats-panel 
          [stats]="{
            totalSyllables: 25,
            avgSyllablesPerLine: 5.0,
            vocabularyRichness: 78.3,
            patternMatch: 'Partial'
          }"
        />
        
        <app-quick-stats-panel 
          [stats]="{
            totalSyllables: 42,
            avgSyllablesPerLine: 6.0,
            vocabularyRichness: 65.8,
            patternMatch: 'Partial'
          }"
        />
      </div>
    `,
  }),
};
