import { computed } from 'vue'
import { experience } from '~/data/experience'

export function useExperience() {
  const { t, tm, rt } = useI18n()

  return computed(() => {
    const months = (tm('dates.months') as unknown[]).map(entry => rt(entry as never))

    return experience.map(entry => ({
      ...entry,
      dates: formatPeriod(entry.period, months, t('dates.ongoing'), ' – '),
      role: t(`experience.entries.${entry.key}.role`),
      country: t(`experience.entries.${entry.key}.country`),
      summary: t(`experience.entries.${entry.key}.summary`),
    }))
  })
}
