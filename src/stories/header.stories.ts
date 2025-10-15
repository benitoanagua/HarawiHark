import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Metro UI/Header',
  tags: ['autodocs'],
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

export const LoggedIn: Story = {
  render: (args) => ({
    props: args,
    template: `
      <header [attr.data-theme]="theme" class="storybook-header">
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
            <div class="user-section">
              <span class="welcome-text">
                Welcome, <b class="user-name">{{ user.name }}</b>!
              </span>
              <button 
                class="btn-base btn-small btn-outline"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>
    `,
  }),
  args: {
    user: {
      name: 'Jane Doe',
    },
    theme: 'light',
  },
};

export const LoggedOut: Story = {
  render: (args) => ({
    props: args,
    template: `
      <header [attr.data-theme]="theme" class="storybook-header">
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
              <button 
                class="btn-base btn-small btn-outline"
              >
                Log in
              </button>
              <button 
                class="btn-base btn-small btn-primary"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </header>
    `,
  }),
  args: {
    user: null,
    theme: 'light',
  },
};
