// The sitemap lists every <img> on a page; country flags are decoration, not images to index.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:resolved', (ctx) => {
    for (const url of ctx.urls) {
      if (url.images) url.images = url.images.filter(image => !String(image.loc).endsWith('.svg'))
    }
  })
})
