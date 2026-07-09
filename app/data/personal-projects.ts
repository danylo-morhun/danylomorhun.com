import type { CaseStudy } from './case-studies'

export const personalProjects: CaseStudy[] = [
  {
    slug: 'seikatsu',
    dates: '2026 – ongoing',
    outcome: ['3', '1 shell'],
    gallery: [
      { src: '/personal-projects/seikatsu-seiryu.jpg' },
      { src: '/personal-projects/seikatsu-home.jpg' },
      { src: '/personal-projects/seikatsu-kuroji.jpg' },
      { src: '/personal-projects/seikatsu-tsundoku.jpg' },
    ],
    liveUrl: 'https://seikatsu.danylomorhun.com/',
  },
  {
    slug: 'twoje-zdrowie',
    dates: '2026',
    outcome: ['0', '3 rails'],
    gallery: [
      { src: '/personal-projects/twojezdrowie-home.jpg' },
      { src: '/personal-projects/twojezdrowie-katalog.jpg' },
      { src: '/personal-projects/twojezdrowie-produkt.jpg' },
      { src: '/personal-projects/twojezdrowie-koszyk.jpg' },
    ],
  },
  {
    slug: 'danylomorhun-com',
    dates: '2026',
    outcome: ['5 sections', '1 file'],
    gallery: [
      { src: '/personal-projects/danylomorhun-hero.jpg' },
      { src: '/personal-projects/danylomorhun-work.jpg' },
    ],
    liveUrl: 'https://danylomorhun.com',
  },
]
