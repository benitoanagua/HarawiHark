import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Metro UI/Page',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
    },
  },
};

export default meta;
type Story = StoryObj;

const pageProps = {
  metroTiles: [
    { label: 'Mail', color: 'var(--color-primary)', icon: '✉️' },
    { label: 'Calendar', color: 'var(--color-error)', icon: '📅' },
    { label: 'Photos', color: 'var(--color-primaryContainer)', icon: '🖼️' },
    { label: 'Store', color: 'var(--color-surfaceVariant)', icon: '🛍️' },
  ],
  documentation: [
    {
      title: 'Design Principles',
      description: 'Learn the core principles of Metro UI design language',
      icon: '🎨',
    },
    {
      title: 'Component Library',
      description: 'Browse our collection of Metro-styled components',
      icon: '🧩',
    },
    {
      title: 'Typography Scale',
      description: 'Understand the typographic hierarchy and spacing',
      icon: '🔤',
    },
    {
      title: 'Motion Guidelines',
      description: 'Implement meaningful animations and transitions',
      icon: '⚡',
    },
  ],
};

export const Default: Story = {
  render: (args) => ({
    props: { ...args, ...pageProps },
    template: `
      <article [attr.data-theme]="theme" class="storybook-page">
        <header class="storybook-header">
          <div class="header-content">
            <div class="logo-section">
              <div class="logo-wrapper">
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
                  <rect width="32" height="32" fill="var(--color-primary)" />
                  <rect x="8" y="8" width="16" height="16" fill="var(--color-onPrimary)" />
                </svg>
                <h1 class="logo-title">Metro UI</h1>
              </div>
            </div>

            <div class="nav-section">
              <div class="auth-section">
                <button class="btn-base btn-small btn-outline">Log in</button>
                <button class="btn-base btn-small btn-primary">Sign up</button>
              </div>
            </div>
          </div>
        </header>
        
        <section class="page-content">
          <div class="hero-section">
            <h2 class="hero-title">Metro UI Design System</h2>
            <p class="hero-subtitle">
              Building modern interfaces with Windows Phone inspiration
            </p>
          </div>

          <div class="content-grid">
            <div class="tiles-section">
              <h3 class="section-title">Application Tiles</h3>
              <div class="tiles-grid">
                <div *ngFor="let tile of metroTiles" 
                     class="metro-tile-story"
                     [style.background]="tile.color">
                  <span class="tile-icon" [innerHTML]="tile.icon"></span>
                  <span class="tile-label">{{ tile.label }}</span>
                </div>
              </div>
            </div>

            <div class="docs-section">
              <h3 class="section-title">Getting Started</h3>
              <div class="docs-list">
                <div class="doc-item" *ngFor="let doc of documentation">
                  <span class="doc-icon" [innerHTML]="doc.icon"></span>
                  <div class="doc-content">
                    <h4 class="doc-title">{{ doc.title }}</h4>
                    <p class="doc-description">{{ doc.description }}</p>
                  </div>
                  <span class="doc-arrow">→</span>
                </div>
              </div>
            </div>
          </div>

          <div class="tips-section">
            <div class="tip-wrapper">
              <span class="tip-badge">Tip</span>
              <p class="tip-text">
                Metro UI emphasizes clean typography, meaningful motion, and content-first design.
                Use ample whitespace and focus on readability.
              </p>
            </div>
          </div>
        </section>
      </article>
    `,
  }),
  args: {
    theme: 'light',
  },
};
