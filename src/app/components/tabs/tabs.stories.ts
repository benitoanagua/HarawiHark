import type { Meta, StoryObj } from '@storybook/angular';
import { TabsComponent } from './tabs.component';
import type { Tab } from './tabs.component';

const meta: Meta<TabsComponent> = {
  title: 'Metro UI/Tabs',
  component: TabsComponent,
  tags: ['autodocs'],
  argTypes: {
    selectedTab: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<TabsComponent>;

const analysisTabs: Tab[] = [
  { id: 'structure', label: 'structure', icon: 'icon-[iconoir--layout-left]' },
  { id: 'rhythm', label: 'rhythm', icon: 'icon-[iconoir--music-double-note]' },
  { id: 'quality', label: 'quality', icon: 'icon-[iconoir--star]' },
  { id: 'suggestions', label: 'suggestions', icon: 'icon-[iconoir--light-bulb]' },
];

const simpleTabs: Tab[] = [
  { id: 'overview', label: 'overview' },
  { id: 'details', label: 'details' },
  { id: 'settings', label: 'settings' },
];

export const Default: Story = {
  args: {
    tabs: analysisTabs,
    selectedTab: 'structure',
  },
};

export const SimpleTabs: Story = {
  args: {
    tabs: simpleTabs,
    selectedTab: 'overview',
  },
};

export const WithIcons: Story = {
  args: {
    tabs: [
      { id: 'edit', label: 'edit', icon: 'icon-[iconoir--edit]' },
      { id: 'preview', label: 'preview', icon: 'icon-[iconoir--eye-empty]' },
      { id: 'analyze', label: 'analyze', icon: 'icon-[iconoir--search]' },
    ],
    selectedTab: 'edit',
  },
};

export const WithDisabledTabs: Story = {
  args: {
    tabs: [
      { id: 'basic', label: 'basic analysis' },
      { id: 'advanced', label: 'advanced analysis', disabled: true },
      { id: 'export', label: 'export options', disabled: true },
    ],
    selectedTab: 'basic',
  },
};

export const PoetryAnalysisTabs: Story = {
  args: {
    tabs: analysisTabs,
    selectedTab: 'structure',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="space-y-4">
        <app-tabs [tabs]="tabs" [selectedTab]="selectedTab" />
        
        <div class="p-4 bg-surfaceContainerLow border border-outlineVariant">
          @switch (selectedTab) {
            @case ('structure') {
              <div>
                <h3 class="text-lg font-semibold text-onSurface mb-2">structure analysis</h3>
                <p class="text-sm text-onSurfaceVariant">Syllable count and pattern matching</p>
              </div>
            }
            @case ('rhythm') {
              <div>
                <h3 class="text-lg font-semibold text-onSurface mb-2">rhythm analysis</h3>
                <p class="text-sm text-onSurfaceVariant">Meter and stress patterns</p>
              </div>
            }
            @case ('quality') {
              <div>
                <h3 class="text-lg font-semibold text-onSurface mb-2">quality assessment</h3>
                <p class="text-sm text-onSurfaceVariant">Overall poem quality metrics</p>
              </div>
            }
            @case ('suggestions') {
              <div>
                <h3 class="text-lg font-semibold text-onSurface mb-2">suggestions</h3>
                <p class="text-sm text-onSurfaceVariant">Improvement recommendations</p>
              </div>
            }
          }
        </div>
      </div>
    `,
  }),
};

export const InteractiveExample: Story = {
  args: {
    tabs: analysisTabs,
    selectedTab: 'structure',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="space-y-4">
        <app-tabs 
          [tabs]="tabs" 
          [selectedTab]="selectedTab" 
          (tabChange)="selectedTab = $event" 
        />
        
        <div class="p-6 bg-surfaceContainerLow border border-outlineVariant text-center">
          <p class="text-sm text-onSurfaceVariant">
            Selected tab: <strong>{{ selectedTab }}</strong>
          </p>
        </div>
      </div>
    `,
  }),
};
