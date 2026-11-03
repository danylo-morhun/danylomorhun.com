// /WORK/grx-pay and /work/grx-pay/ would otherwise render as duplicate pages.
export default defineEventHandler((event) => {
  if (event.path.startsWith('/_') || event.path.includes('.')) return
  const target = canonicalPath(event.path)
  if (target) return sendRedirect(event, target, 301)
})
