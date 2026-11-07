import type { ComputedRef } from 'vue'
import type { LocalizedCaseStudy } from './useCaseStudies'

export function useProjectSeo(project: ComputedRef<LocalizedCaseStudy>) {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const siteConfig = useSiteConfig()

  const title = computed(() => `${project.value.name} — Danylo Morhun`)

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
    subtitle: () => project.value.role,
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
