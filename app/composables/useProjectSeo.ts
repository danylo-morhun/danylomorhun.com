import type { ComputedRef } from 'vue'
import type { LocalizedCaseStudy } from './useCaseStudies'

export function useProjectSeo(project: ComputedRef<LocalizedCaseStudy>) {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const siteConfig = useSiteConfig()

  // "Sourcely — Wholesale sourcing · Danylo Morhun": the subject keeps the title past ~30 characters.
  const title = computed(() => `${project.value.name} — ${project.value.tag.split(' · ').at(-1)} · Danylo Morhun`)

  useSeoMeta({
    title,
    ogTitle: title,
    twitterTitle: title,
    description: () => project.value.metaDescription,
    ogDescription: () => project.value.metaDescription,
    twitterDescription: () => project.value.metaDescription,
    ogType: 'article',
    ogImageAlt: title,
    twitterImageAlt: title,
  })

  defineOgImage('Beams', {
    title: () => project.value.name,
    subtitle: () => project.value.meta || undefined,
    tag: () => project.value.tag,
    tagline: () => t('og.tagline'),
  })

  useStructuredData(
    { title: () => title.value, description: () => project.value.metaDescription },
    (site, page) => projectPageGraph(site, page, {
      name: project.value.name,
      description: project.value.metaDescription,
      image: project.value.gallery[0] && absoluteUrl(siteConfig.url, project.value.gallery[0].src),
      home: { name: t('nav.home'), url: absoluteUrl(siteConfig.url, localePath('/')) },
    }),
  )
}
