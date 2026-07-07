# Portfolio Website

A personal portfolio website built with Nuxt 4, TypeScript, and Tailwind CSS. Server-rendered for real SEO (previous SPA version is archived on the `legacy-v1` branch).

## Tech Stack

- **Framework**: Nuxt 4 (SSR)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Modules**: `@nuxtjs/tailwindcss`, `@nuxtjs/sitemap`, `@nuxtjs/robots`

## Project Structure

```
app/
├── app.vue         # Root component
└── assets/css/     # Global CSS (Tailwind entrypoint)
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

## Status

Bare Nuxt scaffold — no pages, layouts, or content yet. Infra only (Tailwind, sitemap, robots modules wired up). See `CLAUDE.md` for the rebuild workflow.
