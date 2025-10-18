import type { Meta, StoryObj } from '@storybook/angular';
import { MeterAnalysisSectionComponent } from './meter-analysis-section.component';
import type { EnhancedPoetryResult, MeterAnalysis } from '../../../services';

const meta: Meta<MeterAnalysisSectionComponent> = {
  title: 'Metro UI/Meter Analysis Section',
  component: MeterAnalysisSectionComponent,
  tags: ['autodocs'],
  argTypes: {
    result: {
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<MeterAnalysisSectionComponent>;

const createMockResult = (meterAnalysis: MeterAnalysis | undefined): EnhancedPoetryResult => ({
  ok: true,
  form: 'haiku',
  totalLines: { expected: 3, actual: 3 },
  lines: [],
  summary: 'Perfect match',
  rhymeScheme: 'ABA',
  suggestions: [],
  overallAlliterations: [],
  detectedPatterns: [],
  meterAnalysis,
});

export const IambicMeter: Story = {
  args: {
    result: createMockResult({
      type: 'iambic',
      consistency: 85,
      pattern: 'da-DUM (0/1)',
      description: 'Most common in English poetry. Sounds natural and flowing.',
      examples: [
        "Shall I compare thee to a summer's day?",
        'The curfew tolls the knell of parting day',
      ],
    }),
  },
};

export const TrochaicMeter: Story = {
  args: {
    result: createMockResult({
      type: 'trochaic',
      consistency: 78,
      pattern: 'DUM-da (1/0)',
      description: "Strong, emphatic rhythm. Common in children's verse.",
      examples: ['Tell me not in mournful numbers', 'Tiger, tiger, burning bright'],
    }),
  },
};

export const AnapesticMeter: Story = {
  args: {
    result: createMockResult({
      type: 'anapestic',
      consistency: 65,
      pattern: 'da-da-DUM (0/0/1)',
      description: 'Galloping, energetic rhythm. Creates sense of movement.',
      examples: ['Twas the night before Christmas', 'And the sound of a voice that is still'],
    }),
  },
};

export const DactylicMeter: Story = {
  args: {
    result: createMockResult({
      type: 'dactylic',
      consistency: 45,
      pattern: 'DUM-da-da (1/0/0)',
      description: 'Falling rhythm. Rare in English, common in ancient Greek.',
      examples: ['This is the forest primeval', 'Cannon to right of them'],
    }),
  },
};

export const IrregularMeter: Story = {
  args: {
    result: createMockResult({
      type: 'irregular',
      consistency: 25,
      pattern: 'mixed or free verse',
      description:
        'No consistent metrical pattern detected. This could be free verse or mixed meters.',
      examples: ['Free verse has no set pattern', 'Modern poetry often breaks rules'],
    }),
  },
};

export const LowConsistency: Story = {
  args: {
    result: createMockResult({
      type: 'iambic',
      consistency: 35,
      pattern: 'da-DUM (0/1)',
      description: 'Some iambic patterns detected but inconsistent throughout the poem.',
      examples: ["Shall I compare thee to a summer's day?"],
    }),
  },
};

export const NoMeterAnalysis: Story = {
  args: {
    result: createMockResult(undefined),
  },
};

export const AllMeterTypes: Story = {
  render: () => ({
    template: `
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold mb-3">Iambic Meter (High Consistency)</h3>
          <app-meter-analysis-section 
            [result]="{
              ok: true,
              form: 'sonnet',
              totalLines: { expected: 14, actual: 14 },
              lines: [],
              summary: 'Perfect match',
              rhymeScheme: 'ABAB CDCD EFEF GG',
              suggestions: [],
              overallAlliterations: [],
              detectedPatterns: [],
              meterAnalysis: {
                type: 'iambic',
                consistency: 92,
                pattern: 'da-DUM (0/1)',
                description: 'Most common in English poetry. Sounds natural and flowing.',
                examples: [
                  'Shall I compare thee to a summer\\'s day?',
                  'The curfew tolls the knell of parting day'
                ]
              }
            }"
          />
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3">Trochaic Meter (Medium Consistency)</h3>
          <app-meter-analysis-section 
            [result]="{
              ok: true,
              form: 'limerick',
              totalLines: { expected: 5, actual: 5 },
              lines: [],
              summary: 'Perfect match',
              rhymeScheme: 'AABBA',
              suggestions: [],
              overallAlliterations: [],
              detectedPatterns: [],
              meterAnalysis: {
                type: 'trochaic',
                consistency: 65,
                pattern: 'DUM-da (1/0)',
                description: 'Strong, emphatic rhythm. Common in children\\'s verse.',
                examples: [
                  'Tell me not in mournful numbers',
                  'Tiger, tiger, burning bright'
                ]
              }
            }"
          />
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3">Irregular Meter</h3>
          <app-meter-analysis-section 
            [result]="{
              ok: true,
              form: 'free-verse',
              totalLines: { expected: 8, actual: 8 },
              lines: [],
              summary: 'Free verse poem',
              rhymeScheme: undefined,
              suggestions: [],
              overallAlliterations: [],
              detectedPatterns: [],
              meterAnalysis: {
                type: 'irregular',
                consistency: 15,
                pattern: 'mixed or free verse',
                description: 'No consistent metrical pattern detected. This could be free verse or mixed meters.',
                examples: []
              }
            }"
          />
        </div>
      </div>
    `,
  }),
};
