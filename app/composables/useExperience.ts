import { computed } from 'vue'
import { experience } from '~/data/experience'

export function useExperience() {
  const { t } = useI18n()

  return computed(() => experience.map(entry => ({
    ...entry,
    role: t(`experience.entries.${entry.key}.role`),
    country: t(`experience.entries.${entry.key}.country`),
    summary: t(`experience.entries.${entry.key}.summary`),
  })))
}
