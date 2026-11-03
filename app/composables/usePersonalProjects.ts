import { computed } from 'vue'
import { personalProjects as personalProjectsData } from '~/data/personal-projects'
import { useLocalizeProject } from './useCaseStudies'

export function usePersonalProjects() {
  const localizeProject = useLocalizeProject()

  return computed(() => personalProjectsData.map(project => localizeProject(project, `personalProjects.${project.slug}`)))
}

export function usePersonalProject(slug: string) {
  const personalProjects = usePersonalProjects()
  return computed(() => personalProjects.value.find(project => project.slug === slug))
}
