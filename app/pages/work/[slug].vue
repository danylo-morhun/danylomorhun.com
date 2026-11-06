<script setup lang="ts">
import { computed } from 'vue'
import { useCaseStudy } from '~/composables/useCaseStudies'

const { t } = useI18n()
const route = useRoute()

const studyRef = useCaseStudy(route.params.slug as string)

if (!studyRef.value) {
  throw createError({ statusCode: 404, statusMessage: 'Case study not found' })
}

const study = computed(() => studyRef.value!)

useProjectSeo(study)
</script>

<template>
  <ProjectDetail
    :project="study"
    back-path="/#work"
    :back-label="t('project.backToWork')"
  />
</template>
