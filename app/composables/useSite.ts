import { computed } from 'vue'
import { site } from '~/data/site'

export function useSite() {
  const { t, tm, rt } = useI18n()

  return computed(() => ({
    ...site,
    title: t('site.title'),
    oneLiner: t('site.oneLiner'),
    bio: (tm('site.bio') as any[]).map(entry => rt(entry)),
  }))
}
