# HarawiHark

A sophisticated poetry analysis application built with modern web technologies featuring a custom Metro UI design system.

![HarawiHark Screenshot](https://i.ibb.co/ZR4Mphc2/harawihark.png)

**Live Demo**: [https://harawihark.onrender.com](https://harawihark.onrender.com)  
**Source Code**: [https://github.com/benitoanagua/HarawiHark](https://github.com/benitoanagua/HarawiHark)

## Technology Stack

### Frontend Architecture

- **Angular 17+** - Modern framework with standalone components and signals
- **TypeScript** - Full type safety with strict mode enforcement
- **Metro UI Design System** - Custom component library built with Tailwind CSS

### Styling & Design

- **Tailwind CSS 4.0** - Utility-first CSS framework with PostCSS
- **Material Design 3** - Dynamic color system with HCT color space
- **Custom Metro Components** - Cohesive design system with 27+ components

### Poetry Analysis

- **RiTa.js** - Advanced NLP for phonetic analysis and syllable counting
- **Custom Analysis Services** - Real-time pattern validation and meter detection

### Development Tools

- **Playwright** - Multi-browser end-to-end testing
- **Storybook** - Component documentation and development
- **ESLint** - Code quality and consistency

## Metro UI Design System

### Core Components

- **AppBar** - Top navigation with command buttons
- **Panorama** - Full-width layout container
- **Pivot** - Tab navigation system
- **ListItem** - Detailed list items with icons and metadata
- **Toggle** - Custom switch controls
- **Progress** - Linear and circular progress indicators
- **Toast** - Notification system with multiple variants
- **Card** - Content containers with elevation variants

### Form Controls

- **Button** - Multiple variants (primary, secondary, outline)
- **Input** - Text and textarea inputs with validation
- **Select** - Custom dropdown with options
- **MultilineInput** - Poetry-specific line-by-line editor
- **Badge** - Status indicators and labels

### Layout Components

- **Header** - Application header with theme toggle
- **Footer** - Application footer with branding
- **PoetryPage** - Main application layout
- **AnalysisPanel** - Data visualization components

## Design Principles

### Material Design Integration

- Dynamic theming with 72 CSS variables (36 Material + 36 Terminal)
- HCT color space for perceptual uniformity
- Fidelity color scheme with harmonic blending
- Automatic light/dark theme variations

### Tailwind CSS Foundation

- Utility-first styling approach
- Responsive design system
- Custom component variants
- Consistent spacing and typography

### Angular Architecture

- Standalone components without NgModules
- Reactive state management with signals
- Service-based dependency injection
- Component composition patterns

## Core Features

### Poetry Form Support

- **Haiku** - 5-7-5 syllable structure
- **Tanka** - 5-7-5-7-7 extended form
- **Cinquain** - 2-4-6-8-2 pattern
- **Limerick** - 8-8-5-5-8 with AABBA rhyme
- **Redondilla** - 8-8-8-8 Spanish quatrain
- **Lanterne** - 1-2-3-4-1 lantern shape
- **Diamante** - 1-2-3-4-3-2-1 diamond poem
- **Fibonacci** - 1-1-2-3-5-8 mathematical sequence

### Advanced Analysis

- Real-time syllable counting with RiTa.js
- Pattern validation against expected structures
- Rhyme scheme detection and analysis
- Meter pattern identification (iambic, trochaic, etc.)
- Alliteration and sound repetition detection
- Vocabulary richness scoring
- Quality assessment with detailed metrics

### User Experience

- Responsive Metro UI design
- Dynamic theme switching (light/dark)
- Live editing with instant feedback
- Example poems for each form
- Word suggestions and alternatives
- Copy to clipboard functionality
- Toast notifications for user feedback

## Development

### Quick Start

```bash
# Install dependencies
pnpm install

# Build for production
ng build

# Serve built application locally
python -m http.server 8080 --directory dist/harawihark/browser

# Component development and documentation
pnpm storybook
```

### Metro UI Components

The application features 27+ custom components organized in:

- `components/metro/` - Core design system components
- `components/ui/` - Form controls and inputs
- `components/poetry/` - Poetry-specific components
- `components/layout/` - Structural components

## License

MIT License
