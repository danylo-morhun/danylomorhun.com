import tailwindcss from '@tailwindcss/vite'
import { caseStudies } from './app/data/case-studies'
import { personalProjects } from './app/data/personal-projects'
import { loadPosts } from './modules/blog/source'

// Projects that moved or were retired keep their old URLs working, in every locale.
const MOVED_PROJECTS: Record<string, string> = {
  '/lab/twoje-zdrowie': '/lab/wellbotany',
  '/work/air-quality-monitoring-dashboard': '/lab/aerolit',
  '/work/marketplace-investment-platform': '/#work',
  '/work/donation-fundraising-platform': '/#work',
}

function movedProjectRedirects() {
  return Object.fromEntries(['', '/uk', '/pl'].flatMap(prefix => Object.entries(MOVED_PROJECTS).map(([from, to]) => [
    `${prefix}${from}`,
    { redirect: { to: prefix && to.startsWith('/#') ? `${prefix}${to.slice(1)}` : `${prefix}${to}`, statusCode: 301 } },
  ])))
}

const siteUrl = process.env.NUXT_SITE_URL || 'https://www.danylomorhun.com'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxtjs/sitemap', '@nuxtjs/robots', '@nuxtjs/color-mode', '@nuxtjs/i18n', 'nuxt-og-image'],
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  css: ['~/assets/css/main.css', '~/assets/css/og-fonts.css'],

  site: {
    url: siteUrl,
    name: 'Danylo Morhun',
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy': [
          'default-src \'self\'',
          'script-src \'self\' \'unsafe-inline\'',
          'style-src \'self\' \'unsafe-inline\'',
          'img-src \'self\' data:',
          'font-src \'self\'',
          'connect-src \'self\'',
          'object-src \'none\'',
          'base-uri \'self\'',
          'form-action \'self\'',
          'frame-ancestors \'none\'',
        ].join('; '),
      },
    },
    '/resume.pdf': { redirect: { to: '/Danylo_Morhun_Fullstack_Engineer_Resume.pdf', statusCode: 301 } },
    ...movedProjectRedirects(),
  },
  sourcemap: { client: true, server: false },
  features: { inlineStyles: true },
  // Inline each page's payload too, instead of fetching _payload.json before hydrating.
  experimental: { payloadExtraction: false },
  compatibilityDate: '2025-07-15',

  // Every page is static content: prerender it so HTML is served from the CDN
  // and nuxt-og-image (zeroRuntime) renders a share image for each one.
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/uk', '/pl'],
      failOnError: true,
    },
    // Vercel serves prerendered files before the canonical-url middleware runs,
    // so the trailing-slash redirect has to happen at the edge, ahead of the filesystem.
    vercel: {
      config: {
        // @ts-expect-error nitropack types route headers as cache-control only; Vercel accepts any header.
        routes: [{ src: '^/(.+)/$', status: 308, headers: { Location: '/$1' } }],
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  hooks: {
    // The only lazy chunk prefetched on load is three.js (~530 KB) for the hero beams,
    // which start after the page is idle anyway; fetching it early competes with LCP.
    'build:manifest': (manifest) => {
      for (const chunk of Object.values(manifest)) chunk.prefetch = false
    },
  },

  eslint: {
    config: { stylistic: true },
  },

  i18n: {
    baseUrl: siteUrl,
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'uk', language: 'uk-UA', name: 'Українська', file: 'uk.json' },
      { code: 'pl', language: 'pl-PL', name: 'Polski', file: 'pl.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    experimental: {
      strictSeo: true,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
  },

  ogImage: {
    zeroRuntime: true,
    // 1.91:1, the ratio LinkedIn, X and Slack crop to.
    defaults: { width: 1200, height: 630 },
  },

  sitemap: {
    zeroRuntime: true,
    urls: () => {
      const nonDefaultLocales = ['uk', 'pl']
      const paths = [
        ...caseStudies.map(cs => ({ path: `/work/${cs.slug}`, priority: 0.8 as const })),
        ...personalProjects.map(p => ({ path: `/lab/${p.slug}`, priority: 0.7 as const })),
      ]
      // Posts are English-only, so they have no /uk or /pl copies.
      const posts = loadPosts().map(({ meta }) => ({ loc: `/blog/${meta.slug}`, lastmod: meta.updated ?? meta.date, priority: 0.7 as const }))
      return [
        ...paths.flatMap(({ path, priority }) => [
          { loc: path, priority },
          ...nonDefaultLocales.map(locale => ({ loc: `/${locale}${path}`, priority })),
        ]),
        ...posts,
      ]
    },
  },
})
