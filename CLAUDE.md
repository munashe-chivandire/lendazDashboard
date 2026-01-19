# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Lendaz Owner Dashboard** - a property management dashboard for property owners to manage listings, communications, documents, and maintenance operations. The application is built as a static HTML/CSS/JavaScript dashboard with modular SCSS architecture.

## Commands

### SCSS Compilation
```bash
sass styles.scss styles.css --watch
```
The project uses SCSS with a modular architecture. Changes to any `.scss` file require compilation to CSS.

### File Permissions
The project has specific Bash permissions configured:
- `sass:*` - SCSS compilation commands
- `cat:*` - File reading operations  
- `find:*` - File discovery operations

## Architecture & Structure

### Core Structure
- **index.html**: Single-page application with tab-based navigation between modules
- **main.js**: Vanilla JavaScript functionality organized in IIFE modules for different features
- **styles.scss**: Main SCSS entry point that imports modular partials
- **scss/**: Modular SCSS architecture with design system
  - `_variables.scss`: Design tokens (colors, typography, spacing, breakpoints)
  - `_components.scss`: Reusable UI components (buttons, forms, modals, cards)
  - `_layout.scss`: Layout utilities and responsive grid systems
- **assets/**: Static assets including user avatars and media
- **dashboardplan.md**: Technical specifications and development roadmap

### Navigation System
The dashboard uses client-side JavaScript for tab navigation between five main sections:
- **Analytics Overview** (`#analytics`): Metrics, lead sources, revenue forecasting
- **Messaging Center** (`#messaging`): Conversation management with prospects and tenants
- **Maintenance Hub** (`#maintenance`): Kanban board for maintenance tickets and vendor management
- **Document Hub** (`#documents`): Document storage with compliance tracking
- **Profile & Settings** (`#profile`): Account management and team permissions

### Design System

#### Colors
- Primary brand: `--color-primary` (#2563eb)
- Neutral grays: `--color-gray-50` through `--color-gray-900`
- Status colors: success, warning, error variants

#### Typography
- Font family: Inter with system font fallbacks
- Size scale: `--font-size-xs` (12px) to `--font-size-4xl` (36px)
- Weight scale: 400 (normal) to 700 (bold)

#### Spacing & Layout
- Consistent spacing scale: `--space-1` (4px) to `--space-20` (80px)
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Border radius system: `--radius-sm` to `--radius-full`

## Development Guidelines

### CSS/SCSS Best Practices
- **Always use design system variables** instead of hardcoded values
- **No inline styles** - all styling goes in appropriate SCSS files
- **Component-based organization** - group related styles in `_components.scss`
- **Use semantic HTML** with proper ARIA attributes for accessibility
- **Responsive design** using mobile-first approach with `respond-above()` mixins

### Component Patterns
- **Cards**: Use `@include card-base` for consistent card styling
- **Buttons**: Follow `.btn` class patterns with modifier classes (`--primary`, `--secondary`)
- **Forms**: Use `.form-group` structure with proper validation states
- **Status indicators**: Use `.status-badge` with semantic color variants

### Property Type Context
When working with property-related features, consider the scale hierarchy:
1. **Commercial Home** (largest scale)
2. **Home Industry** (medium scale)  
3. **Smart Rural Homes** (smallest scale)

### UI/UX Preferences
- **Avoid colored borders on cards** - use subtle shadows instead
- **Use SVG icons over emojis** for professional appearance
- **Clean, minimal design** with ample whitespace
- **Consistent interaction patterns** across all modules

## Key Development Tasks

### Adding New Components
1. Add markup following existing semantic HTML patterns
2. Create styles in `scss/_components.scss` using design system variables
3. Ensure responsive behavior using provided mixins
4. Test accessibility with proper ARIA attributes

### Styling Guidelines
- Use existing CSS custom properties from `_variables.scss`
- Follow BEM methodology for class naming
- Implement hover/focus states for interactive elements
- Ensure proper color contrast for accessibility

### Navigation Updates
- Modify sidebar navigation in `index.html`
- Add corresponding section with proper `id` attribute
- Update JavaScript navigation handler for new sections
- Ensure proper ARIA attributes for screen readers

## Code Quality Standards

- **Semantic HTML**: Use appropriate HTML5 elements
- **Accessibility**: Include ARIA labels, roles, and proper focus management
- **Progressive Enhancement**: JavaScript enhances but doesn't break basic functionality
- **Performance**: Optimize for fast loading with efficient CSS organization
- **Browser Support**: Modern browsers with graceful degradation

## JavaScript Architecture

### Module Organization
The application uses vanilla JavaScript organized in IIFE (Immediately Invoked Function Expression) modules within a main DOMContentLoaded wrapper:

- **User Menu**: Dropdown functionality with keyboard navigation and ARIA support
- **Navigation**: Tab-based section switching with URL state management
- **Charts**: Chart.js integration for analytics (forecast charts, lead sources)
- **Modal System**: Centralized modal management for listings and profile settings
- **Search**: Spotlight search functionality with recent searches and keyboard shortcuts
- **Profile Modals**: Comprehensive modal system for account settings and file uploads

### Key JavaScript Patterns
- **Error Handling**: All DOM operations include null checks and safe element queries
- **Accessibility**: Proper ARIA attributes, focus management, and keyboard navigation
- **Cross-browser Compatibility**: Uses compatible selectors and avoids modern CSS pseudo-selectors like `:has()`
- **Global Functions**: Modal functions exposed via `window.openProfileModal()` for button connections

### Modal System Architecture
The profile modal system uses a centralized controller pattern:
- Helper functions for safe element selection and text updates
- Unified modal management with proper cleanup and reset functionality
- Real-time UI updates that modify profile cards after modal submissions
- Comprehensive form validation with user-friendly error handling

### Chart.js Integration
Charts are conditionally initialized when Chart.js is available:
- Revenue forecast chart with time range filters
- Lead sources doughnut chart with interactive legend
- Listing analytics modals with drill-down capabilities

## Technical Notes

- **No build system**: Direct SCSS compilation to CSS
- **External Dependencies**: Chart.js 4.4.4 loaded via CDN
- **Vanilla JavaScript**: No framework dependencies, all functionality in main.js
- **Static deployment**: Files can be served directly from any web server
- **Mobile responsive**: Tested across device sizes using CSS Grid and Flexbox