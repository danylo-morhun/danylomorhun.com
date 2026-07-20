import { caseStudies } from './app/data/case-studies'
import { personalProjects } from './app/data/personal-projects'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  sourcemap: { client: true, server: false },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap', '@nuxtjs/robots', '@nuxtjs/color-mode', '@nuxtjs/i18n', 'nuxt-og-image'],

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },

  site: {
    url: 'https://www.danylomorhun.com',
    name: 'Danylo Morhun',
  },

  sitemap: {
    zeroRuntime: true,
    urls: () => {
      const nonDefaultLocales = ['uk', 'pl']
      const paths = [
        ...caseStudies.map(cs => ({ path: `/work/${cs.slug}`, priority: 0.8 as const })),
        ...personalProjects.map(p => ({ path: `/lab/${p.slug}`, priority: 0.7 as const })),
      ]
      return paths.flatMap(({ path, priority }) => [
        { loc: path, priority },
        ...nonDefaultLocales.map(locale => ({ loc: `/${locale}${path}`, priority })),
      ])
    },
  },

  ogImage: {
    zeroRuntime: true,
  },

  i18n: {
    baseUrl: 'https://www.danylomorhun.com',
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
})
