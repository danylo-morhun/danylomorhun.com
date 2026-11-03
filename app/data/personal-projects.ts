import type { CaseStudy } from './case-studies'

export const personalProjects: CaseStudy[] = [
  {
    slug: 'seikatsu',
    period: { start: '2026', ongoing: true },
    outcome: [],
    gallery: [
      { src: '/personal-projects/seikatsu-seiryu.webp' },
      { src: '/personal-projects/seikatsu-home.webp' },
      { src: '/personal-projects/seikatsu-kuroji.webp' },
      { src: '/personal-projects/seikatsu-tsundoku.webp' },
    ],
    liveUrl: 'https://seikatsu.danylomorhun.com/',
  },
  {
    slug: 'twoje-zdrowie',
    period: { start: '2026' },
    outcome: [],
    gallery: [
      { src: '/personal-projects/twojezdrowie-home.webp' },
      { src: '/personal-projects/twojezdrowie-katalog.webp' },
      { src: '/personal-projects/twojezdrowie-produkt.webp' },
    ],
    liveUrl: 'https://wellbotany.pl',
  },
  {
    slug: 'danylomorhun-com',
    period: { start: '2026' },
    outcome: [],
    gallery: [
      { src: '/personal-projects/danylomorhun-hero.webp' },
      { src: '/personal-projects/danylomorhun-work.webp' },
    ],
    liveUrl: 'https://www.danylomorhun.com',
  },
]
