import type { Meta, StoryObj } from '@storybook/angular';
import { EmptyStateComponent } from './empty-state.component';

const meta: Meta<EmptyStateComponent> = {
  title: 'Metro UI/Empty State',
  component: EmptyStateComponent,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: { type: 'text' },
    },
    title: {
      control: { type: 'text' },
    },
    description: {
      control: { type: 'text' },
    },
    actionLabel: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<EmptyStateComponent>;

export const Default: Story = {
  args: {
    icon: 'icon-[iconoir--page-search]',
    title: 'no poem yet',
    description: 'Start writing your poem to see syllable analysis',
  },
};

export const WithAction: Story = {
  args: {
    icon: 'icon-[iconoir--flower]',
    title: 'no examples loaded',
    description: 'Load a sample poem to see how the analyzer works',
    actionLabel: 'load example',
  },
};

export const NoResults: Story = {
  args: {
    icon: 'icon-[iconoir--search-window]',
    title: 'no matches found',
    description: 'Try adjusting your search criteria',
    actionLabel: 'clear filters',
  },
};

export const EmptyPoems: Story = {
  args: {
    icon: 'icon-[iconoir--book-stack]',
    title: 'no saved poems',
    description: 'Your analyzed poems will appear here once you start creating',
    actionLabel: 'create first poem',
  },
};

export const MinimalWithoutDescription: Story = {
  args: {
    icon: 'icon-[iconoir--sparks]',
    title: 'nothing here',
  },
};
