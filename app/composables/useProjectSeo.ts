import type { ComputedRef } from 'vue'
import type { LocalizedCaseStudy } from './useCaseStudies'

export function useProjectSeo(project: ComputedRef<LocalizedCaseStudy>, section: 'work' | 'lab') {
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
  })

  defineOgImage('Default', {
    title: () => project.value.name,
    subtitle: () => project.value.role,
    tag: () => project.value.tag,
    tagline: () => t('og.tagline'),
  })

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: () => JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          'name': project.value.name,
          'description': project.value.metaDescription,
          'creator': { '@type': 'Person', 'name': 'Danylo Morhun' },
          'url': `${siteConfig.url}${localePath(`/${section}/${project.value.slug}`)}`,
          'image': project.value.gallery[0] ? `${siteConfig.url}${project.value.gallery[0].src}` : undefined,
        }),
      },
    ],
  })
}
