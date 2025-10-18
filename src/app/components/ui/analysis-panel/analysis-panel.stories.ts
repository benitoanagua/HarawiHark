import type { Meta, StoryObj } from '@storybook/angular';
import { AnalysisPanelComponent } from './analysis-panel.component';
import type { AnalysisMetric } from './analysis-panel.component';

const meta: Meta<AnalysisPanelComponent> = {
  title: 'Metro UI/Analysis Panel',
  component: AnalysisPanelComponent,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    compact: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<AnalysisPanelComponent>;

const basicMetrics: AnalysisMetric[] = [
  { label: 'Total Syllables', value: 17, variant: 'default', icon: 'icon-[iconoir--sound-high]' },
  { label: 'Avg per Line', value: 5.7, variant: 'default' },
  { label: 'Vocabulary Richness', value: '85%', variant: 'success' },
  { label: 'Pattern Match', value: 'Perfect', variant: 'success' },
];

export const Default: Story = {
  args: {
    title: 'poem statistics',
    metrics: basicMetrics,
    compact: false,
  },
};

export const Compact: Story = {
  args: {
    title: 'quick stats',
    metrics: basicMetrics,
    compact: true,
  },
};

export const RhythmAnalysis: Story = {
  args: {
    title: 'rhythm analysis',
    metrics: [
      {
        label: 'Meter Type',
        value: 'Iambic',
        variant: 'default',
        icon: 'icon-[iconoir--music-double-note]',
      },
      { label: 'Consistency', value: 85, maxValue: 100, variant: 'success' },
      { label: 'Stress Pattern', value: '0/1', variant: 'default' },
      { label: 'Rhythm Score', value: 'A', variant: 'success' },
    ],
    compact: false,
  },
};

export const QualityMetrics: Story = {
  args: {
    title: 'quality assessment',
    metrics: [
      {
        label: 'Overall Score',
        value: 87,
        maxValue: 100,
        variant: 'success',
        icon: 'icon-[iconoir--star]',
      },
      { label: 'Syllable Accuracy', value: 100, maxValue: 100, variant: 'success' },
      { label: 'Rhyme Quality', value: 75, maxValue: 100, variant: 'warning' },
      { label: 'Vocabulary', value: 92, maxValue: 100, variant: 'success' },
      { label: 'Rhythm', value: 80, maxValue: 100, variant: 'success' },
    ],
    compact: false,
  },
};

export const WithWarnings: Story = {
  args: {
    title: 'analysis results',
    metrics: [
      {
        label: 'Syllable Match',
        value: '2/3',
        variant: 'warning',
        icon: 'icon-[iconoir--warning-triangle]',
      },
      { label: 'Line 1', value: '5/5', variant: 'success' },
      { label: 'Line 2', value: '6/7', variant: 'warning' },
      { label: 'Line 3', value: '5/5', variant: 'success' },
    ],
    compact: false,
  },
};

export const WithErrors: Story = {
  args: {
    title: 'pattern issues',
    metrics: [
      { label: 'Form Match', value: 'No', variant: 'error', icon: 'icon-[iconoir--cancel]' },
      { label: 'Line Count', value: '4/3', variant: 'error' },
      { label: 'Syllable Accuracy', value: '33%', variant: 'error' },
      { label: 'Recommendation', value: 'Revise', variant: 'error' },
    ],
    compact: false,
  },
};

export const MultiplePanels: Story = {
  render: () => ({
    template: `
      <div class="grid gap-4 md:grid-cols-2">
        <app-analysis-panel
          title="basic stats"
          [metrics]="[
            { label: 'Total Syllables', value: 17, variant: 'default', icon: 'icon-[iconoir--sound-high]' },
            { label: 'Avg per Line', value: 5.7, variant: 'default' },
            { label: 'Vocabulary', value: '85%', variant: 'success' },
            { label: 'Pattern Match', value: 'Perfect', variant: 'success' }
          ]"
          [compact]="true"
        />
        
        <app-analysis-panel
          title="rhythm"
          [metrics]="[
            { label: 'Meter Type', value: 'Iambic', variant: 'default', icon: 'icon-[iconoir--music-double-note]' },
            { label: 'Consistency', value: 85, maxValue: 100, variant: 'success' },
            { label: 'Stress Pattern', value: '0/1', variant: 'default' },
            { label: 'Score', value: 'A', variant: 'success' }
          ]"
          [compact]="true"
        />
      </div>
    `,
  }),
};
