<script setup lang="ts">
import { computed } from 'vue'
import { usePersonalProject } from '~/composables/usePersonalProjects'

const { t } = useI18n()
const route = useRoute()

const projectRef = usePersonalProject(route.params.slug as string)

if (!projectRef.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const project = computed(() => projectRef.value!)

useProjectSeo(project)
</script>

<template>
  <ProjectDetail
    :project="project"
    back-path="/#lab"
    :back-label="t('project.backToLab')"
    top-aligned
  />
</template>
