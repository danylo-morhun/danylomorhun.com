<script setup lang="ts">
import { blog, formatPostDate } from '#shared/blog'

definePageMeta({ i18n: { locales: ['en'] } })

const route = useRoute()
const slug = route.params.slug as string
const post = useBlogPost(slug)

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

const { data: html } = await useAsyncData(`blog-${slug}`, () => loadPostHtml(slug))
const siteConfig = useSiteConfig()
const title = `${post.title} — Danylo Morhun`
const article = ref<HTMLElement | null>(null)

useBlogSeo({
  title,
  description: post.description,
  ogTitle: post.title,
  ogSubtitle: `${formatPostDate(post.date)} · ${blog.minRead(post.readingMinutes)}`,
  type: 'article',
})

useSeoMeta({
  articlePublishedTime: post.date,
  articleModifiedTime: post.updated ?? post.date,
  articleAuthor: ['Danylo Morhun'],
  articleTag: post.tags,
})

useStructuredData(
  { title: () => title, description: () => post.description },
  (site, page) => blogPostingGraph(site, page, {
    ...post,
    blog: { name: blog.name, url: absoluteUrl(siteConfig.url, blog.path) },
  }),
)

useReveal(article)
</script>

<template>
  <article
    ref="article"
    class="mx-auto max-w-content px-6 py-24 md:py-32"
  >
    <NuxtLink
      :to="blog.path"
      class="reveal-item -my-3 inline-flex items-center gap-1.5 py-3 text-sm text-muted transition-colors duration-200 hover:text-ink"
    >
      <AppIcon
        name="arrow-left-line"
        :size="16"
      />
      {{ blog.backToBlog }}
    </NuxtLink>

    <header class="reveal-item mt-8 max-w-[70ch]">
      <p class="font-mono text-xs text-muted">
        <time :datetime="post!.date">{{ formatPostDate(post!.date) }}</time>
        · {{ blog.minRead(post!.readingMinutes) }}
      </p>
      <h1 class="mt-3 text-3xl font-medium tracking-tightest text-ink md:text-5xl">
        {{ post!.title }}
      </h1>
      <p class="mt-6 text-lg leading-relaxed text-muted">
        {{ post!.description }}
      </p>
    </header>

    <!-- Rendered at build time from the post's markdown in content/blog. -->
    <!-- eslint-disable vue/no-v-html -->
    <div
      class="post-body reveal-item mt-12 border-t border-line pt-4"
      v-html="html"
    />
    <!-- eslint-enable vue/no-v-html -->

    <footer class="reveal-item mt-16 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-10">
      <ul
        v-if="post!.tags.length"
        class="flex flex-wrap gap-2"
      >
        <li
          v-for="tag in post!.tags"
          :key="tag"
          class="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted"
        >
          {{ tag }}
        </li>
      </ul>
      <NuxtLink
        :to="blog.path"
        class="-my-3 ml-auto inline-flex items-center gap-1.5 py-3 text-sm text-muted transition-colors duration-200 hover:text-ink"
      >
        <AppIcon
          name="arrow-left-line"
          :size="16"
        />
        {{ blog.backToBlog }}
      </NuxtLink>
    </footer>
  </article>
</template>
