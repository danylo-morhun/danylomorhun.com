import { computed } from 'vue'
import { caseStudies as caseStudiesData, type CaseStudy } from '~/data/case-studies'

export interface CaseStudyMetric {
  value: string
  label: string
}

export interface CaseStudyGalleryImage {
  src: string
  alt: string
  caption: string
}

export interface LocalizedCaseStudy {
  slug: string
  /** "Company · dates", or whichever of the two exists. */
  meta: string
  liveUrl?: string
  name: string
  tag: string
  description: string
  overview: string
  metaDescription: string
  challenge?: string
  approach: string[]
  stack: string
  outcome: CaseStudyMetric[]
  gallery: CaseStudyGalleryImage[]
  librarySectionTitle?: string
  library?: CaseStudyGalleryImage[]
}

type ImageText = { caption: unknown }

export function useLocalizeProject() {
  const { t, te, tm, rt } = useI18n()

  function renderList(key: string) {
    return (tm(key) as unknown[]).map(entry => rt(entry as never))
  }

  // The caption describes the screen, so it doubles as the alt text.
  function localizeImages(images: CaseStudy['gallery'], key: string) {
    const text = tm(key) as ImageText[]
    return images.map((image, i) => {
      const caption = text[i] ? rt(text[i].caption as never) : ''
      return { src: image.src, alt: caption, caption }
    })
  }

  return function localizeProject(project: CaseStudy, base: string): LocalizedCaseStudy {
    const labels = renderList(`${base}.outcome`)
    const values = te(`${base}.outcomeValues`) ? renderList(`${base}.outcomeValues`) : project.outcome
    const months = renderList('dates.months')
    const dates = formatPeriod(project.period, months, t('dates.ongoing'))
    const description = t(`${base}.description`)

    return {
      slug: project.slug,
      meta: [project.company, dates].filter(Boolean).join(' · '),
      liveUrl: project.liveUrl,
      name: t(`${base}.name`),
      tag: t(`${base}.tag`),
      description,
      overview: te(`${base}.overview`) ? t(`${base}.overview`) : description,
      metaDescription: t(`${base}.metaDescription`),
      challenge: te(`${base}.challenge`) ? t(`${base}.challenge`) : undefined,
      approach: renderList(`${base}.approach`),
      stack: project.stack,
      outcome: values.map((value, i) => ({ value, label: labels[i] ?? '' })),
      gallery: localizeImages(project.gallery, `${base}.gallery`),
      librarySectionTitle: project.library ? t(`${base}.librarySectionTitle`) : undefined,
      library: project.library ? localizeImages(project.library, `${base}.library`) : undefined,
    }
  }
}

export function useCaseStudies() {
  const localizeProject = useLocalizeProject()

  return computed(() => caseStudiesData.map(cs => localizeProject(cs, `caseStudies.${cs.slug}`)))
}

export function useCaseStudy(slug: string) {
  const caseStudies = useCaseStudies()
  return computed(() => caseStudies.value.find(cs => cs.slug === slug))
}
