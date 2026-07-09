import { computed } from 'vue'
import { projects as projectsData } from '~/data/projects'
import { useCaseStudies } from './useCaseStudies'

export function useProjects() {
  const { t } = useI18n()
  const caseStudies = useCaseStudies()

  return computed(() => projectsData.map((project) => {
    const cs = caseStudies.value.find(c => c.slug === project.slug)!

    return {
      slug: project.slug,
      name: cs.name,
      tag: cs.tag,
      role: cs.role,
      description: t(`projects.${project.slug}.description`),
      metrics: cs.outcome.slice(0, project.metricsCount),
    }
  }))
}
