import type { PageInfo, SiteIdentity } from '~/utils/structuredData'

/** Adds this page's JSON-LD, built from the site identity and the page's canonical URL. */
export function useStructuredData(
  page: { title: () => string, description: () => string },
  build: (site: SiteIdentity, page: PageInfo) => object,
) {
  const site = useSite()
  const siteConfig = useSiteConfig()
  const route = useRoute()
  const { localeProperties } = useI18n()

  useHead({
    script: [{
      key: 'structured-data',
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify(build(
        {
          url: absoluteUrl(siteConfig.url, '/'),
          name: site.value.name,
          jobTitle: site.value.title,
          email: site.value.email,
          sameAs: [site.value.github, site.value.linkedin],
        },
        {
          url: absoluteUrl(siteConfig.url, route.path),
          language: localeProperties.value.language ?? 'en-US',
          title: page.title(),
          description: page.description(),
        },
      )),
    }],
  })
}
