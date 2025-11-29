# Portfolio Website

A professional portfolio website for a Middle Full-Stack Engineer built with Vue 3, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Vue 3 (Composition API, Script Setup)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Remix Icons (via CDN)
- **Fonts**: Google Fonts (Inter, Caveat)
- **Router**: Vue Router
- **Build Tool**: Vite

## Design System

- **Primary Color**: #f08c00 (Amber)
- **Background**: #f9fafb (Gray-50)
- **Headings**: #1f1f1f (Dark Grey)
- **Text**: #4b5563 (Slate-600)
- **Border Radius**: rounded-lg

## Project Structure

```
src/
├── components/     # Reusable Vue components
├── views/          # Page components
├── data/           # TypeScript data files (projects, skills, experience)
├── router/         # Vue Router configuration
├── composables/    # Vue composables
└── assets/         # Static assets
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Customization

All content is driven by TypeScript data files in `src/data/`:

- `personal.ts` - Personal information and social links
- `projects.ts` - Project portfolio items
- `skills.ts` - Technical skills
- `experience.ts` - Work experience
- `types.ts` - TypeScript type definitions

Simply update these files to customize the portfolio content.

## Features

- ✅ Fully responsive (mobile-first)
- ✅ Clean, modular component architecture
- ✅ TypeScript for type safety
- ✅ Smooth animations and transitions
- ✅ SEO-friendly routing
- ✅ Professional SaaS aesthetic
