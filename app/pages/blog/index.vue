<script setup lang="ts">
import { blog, formatPostDate } from '#shared/blog'

definePageMeta({ i18n: { locales: ['en'] } })

const posts = useBlogPosts()
const siteConfig = useSiteConfig()
const list = ref<HTMLElement | null>(null)

useBlogSeo({ title: blog.title, description: blog.description, ogTitle: blog.heading, ogSubtitle: blog.description, type: 'website' })

useStructuredData(
  { title: () => blog.title, description: () => blog.description },
  (site, page) => blogGraph(site, page, posts.map(post => ({
    title: post.title,
    url: absoluteUrl(siteConfig.url, `${blog.path}/${post.slug}`),
    date: post.date,
  }))),
)

useReveal(list)
</script>

<template>
  <section class="mx-auto max-w-content px-6 py-24 md:py-32">
    <header class="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div>
        <h1 class="text-3xl font-medium tracking-tightest text-ink md:text-5xl">
          {{ blog.heading }}
        </h1>
        <p class="mt-3 max-w-[60ch] text-muted">
          {{ blog.description }}
        </p>
      </div>
      <a
        :href="blog.feedPath"
        class="-my-3 inline-flex items-center gap-1.5 py-3 font-mono text-xs text-muted transition-colors duration-200 hover:text-ink"
      >
        <AppIcon
          name="rss-line"
          :size="14"
        />
        {{ blog.rss }}
      </a>
    </header>

    <ol
      ref="list"
      class="mt-16 divide-y divide-line border-t border-line"
    >
      <li
        v-for="post in posts"
        :key="post.slug"
        class="reveal-item"
      >
        <NuxtLink
          :to="`${blog.path}/${post.slug}`"
          class="group grid gap-3 py-10 lg:grid-cols-12 lg:gap-8"
        >
          <p class="font-mono text-xs text-muted lg:col-span-3 lg:pt-2">
            <time :datetime="post.date">{{ formatPostDate(post.date) }}</time>
            · {{ blog.minRead(post.readingMinutes) }}
          </p>
          <div class="lg:col-span-9">
            <h2 class="text-xl font-medium text-ink md:text-2xl">
              <span class="underline decoration-line underline-offset-4 transition-colors duration-200 group-hover:decoration-ink">{{ post.title }}</span>
            </h2>
            <p class="mt-3 max-w-[65ch] text-base leading-relaxed text-muted">
              {{ post.description }}
            </p>
          </div>
        </NuxtLink>
      </li>
    </ol>
  </section>
</template>
