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
  dates: string
  nda?: boolean
  liveUrl?: string
  name: string
  tag: string
  role: string
  overview: string
  metaDescription: string
  challenge: string
  approach: string[]
  outcome: CaseStudyMetric[]
  gallery: CaseStudyGalleryImage[]
  librarySectionTitle?: string
  library?: CaseStudyGalleryImage[]
}

type ImageText = { alt: unknown, caption: unknown }

export function useLocalizeProject() {
  const { t, te, tm, rt } = useI18n()

  function renderList(key: string) {
    return (tm(key) as unknown[]).map(entry => rt(entry as never))
  }

  function localizeImages(images: CaseStudy['gallery'], key: string) {
    const text = tm(key) as ImageText[]
    return images.map((image, i) => ({
      src: image.src,
      alt: text[i] ? rt(text[i].alt as never) : '',
      caption: text[i] ? rt(text[i].caption as never) : '',
    }))
  }

  return function localizeProject(project: CaseStudy, base: string): LocalizedCaseStudy {
    const labels = renderList(`${base}.outcome`)
    const values = te(`${base}.outcomeValues`) ? renderList(`${base}.outcomeValues`) : project.outcome
    const months = renderList('dates.months')

    return {
      slug: project.slug,
      dates: formatPeriod(project.period, months, t('dates.ongoing')),
      nda: project.nda,
      liveUrl: project.liveUrl,
      name: t(`${base}.name`),
      tag: t(`${base}.tag`),
      role: t(`${base}.role`),
      overview: t(`${base}.overview`),
      metaDescription: t(`${base}.metaDescription`),
      challenge: t(`${base}.challenge`),
      approach: renderList(`${base}.approach`),
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
