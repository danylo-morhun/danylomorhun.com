import type { CaseStudy } from './case-studies'

export const personalProjects: CaseStudy[] = [
  {
    slug: 'seikatsu',
    dates: '2026 – ongoing',
    outcome: ['3', '1 shell'],
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
    dates: '2026',
    outcome: ['0', '3 rails'],
    gallery: [
      { src: '/personal-projects/twojezdrowie-home.webp' },
      { src: '/personal-projects/twojezdrowie-katalog.webp' },
      { src: '/personal-projects/twojezdrowie-produkt.webp' },
      { src: '/personal-projects/twojezdrowie-koszyk.webp' },
    ],
  },
  {
    slug: 'danylomorhun-com',
    dates: '2026',
    outcome: ['5 sections', '1 file'],
    gallery: [
      { src: '/personal-projects/danylomorhun-hero.webp' },
      { src: '/personal-projects/danylomorhun-work.webp' },
    ],
    liveUrl: 'https://danylomorhun.com',
  },
]
