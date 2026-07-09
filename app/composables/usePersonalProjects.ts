import { computed } from 'vue'
import { personalProjects as personalProjectsData } from '~/data/personal-projects'
import type { LocalizedCaseStudy } from './useCaseStudies'

type Translate = (key: string) => string
type TranslateMessage = (key: string) => unknown
type RenderTranslation = (message: any) => string

function localize(project: (typeof personalProjectsData)[number], t: Translate, tm: TranslateMessage, rt: RenderTranslation): LocalizedCaseStudy {
  const base = `personalProjects.${project.slug}`
  const approach = (tm(`${base}.approach`) as unknown[]).map(entry => rt(entry))
  const outcomeLabels = (tm(`${base}.outcome`) as unknown[]).map(entry => rt(entry))
  const galleryText = (tm(`${base}.gallery`) as { alt: unknown, caption: unknown }[]).map(entry => ({
    alt: rt(entry.alt),
    caption: rt(entry.caption),
  }))

  return {
    slug: project.slug,
    dates: project.dates,
    liveUrl: project.liveUrl,
    name: t(`${base}.name`),
    tag: t(`${base}.tag`),
    role: t(`${base}.role`),
    overview: t(`${base}.overview`),
    challenge: t(`${base}.challenge`),
    approach,
    outcome: project.outcome.map((value, i) => ({ value, label: outcomeLabels[i] ?? '' })),
    gallery: project.gallery.map((image, i) => ({
      src: image.src,
      alt: galleryText[i]?.alt ?? '',
      caption: galleryText[i]?.caption ?? '',
    })),
  }
}

export function usePersonalProjects() {
  const { t, tm, rt } = useI18n()

  return computed(() => personalProjectsData.map(project => localize(project, t, tm, rt)))
}

export function usePersonalProject(slug: string) {
  const personalProjects = usePersonalProjects()
  return computed(() => personalProjects.value.find(project => project.slug === slug))
}
