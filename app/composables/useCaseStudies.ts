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
  challenge: string
  approach: string[]
  outcome: CaseStudyMetric[]
  gallery: CaseStudyGalleryImage[]
  librarySectionTitle?: string
  library?: CaseStudyGalleryImage[]
}

type Translate = (key: string) => string
type TranslateMessage = (key: string) => unknown
type RenderTranslation = (message: any) => string

function localize(cs: CaseStudy, base: string, t: Translate, tm: TranslateMessage, rt: RenderTranslation): LocalizedCaseStudy {
  const approach = (tm(`${base}.approach`) as unknown[]).map(entry => rt(entry))
  const outcomeLabels = (tm(`${base}.outcome`) as unknown[]).map(entry => rt(entry))
  const galleryText = (tm(`${base}.gallery`) as { alt: unknown, caption: unknown }[]).map(entry => ({
    alt: rt(entry.alt),
    caption: rt(entry.caption),
  }))
  const libraryText = cs.library
    ? (tm(`${base}.library`) as { alt: unknown, caption: unknown }[]).map(entry => ({
        alt: rt(entry.alt),
        caption: rt(entry.caption),
      }))
    : undefined

  return {
    slug: cs.slug,
    dates: cs.dates,
    nda: cs.nda,
    liveUrl: cs.liveUrl,
    name: t(`${base}.name`),
    tag: t(`${base}.tag`),
    role: t(`${base}.role`),
    overview: t(`${base}.overview`),
    challenge: t(`${base}.challenge`),
    approach,
    outcome: cs.outcome.map((value, i) => ({ value, label: outcomeLabels[i] ?? '' })),
    gallery: cs.gallery.map((image, i) => ({
      src: image.src,
      alt: galleryText[i]?.alt ?? '',
      caption: galleryText[i]?.caption ?? '',
    })),
    librarySectionTitle: cs.library ? t(`${base}.librarySectionTitle`) : undefined,
    library: cs.library?.map((image, i) => ({
      src: image.src,
      alt: libraryText?.[i]?.alt ?? '',
      caption: libraryText?.[i]?.caption ?? '',
    })),
  }
}

export function useCaseStudies() {
  const { t, tm, rt } = useI18n()

  return computed(() => caseStudiesData.map(cs => localize(cs, `caseStudies.${cs.slug}`, t, tm, rt)))
}

export function useCaseStudy(slug: string) {
  const caseStudies = useCaseStudies()
  return computed(() => caseStudies.value.find(cs => cs.slug === slug))
}
