---
title: When the WebGL context never comes back
description: My site's three.js hero sometimes went blank and stayed blank. The cause was a lost WebGL context the browser never restored. Here's how to detect it, rebuild the renderer, and test it in CI.
date: 2026-11-07
tags: [three.js, webgl, debugging]
---

The hero on this site is a three.js scene: soft light beams drifting behind the headline. Most of the time it works. But sometimes, after the laptop woke from sleep or a phone tab came back from the background, the beams were simply gone. A plain dark background, no error in the console, nothing. A reload fixed it.

Bugs that a reload fixes are the worst kind, so here's what was going on.

## The WebGL context is not yours to keep

A WebGL context is GPU memory the browser lends you. It can take it back at any time:

- **The OS reclaims GPU memory** from a backgrounded tab. iOS Safari is especially eager.
- **The GPU process crashes or resets**, for example after sleep, a driver update, or switching graphics cards on a laptop.
- **Too many contexts are alive.** Browsers cap live WebGL contexts (16 in desktop Chrome). When you go over, the oldest one is dropped.

When that happens, the canvas fires `webglcontextlost` and stops drawing. The page doesn't crash. It just goes quiet.

## three.js only handles half of it

three.js already listens for context loss. If the browser fires `webglcontextrestored`, the renderer re-uploads its state and carries on.

The catch is that the browser doesn't have to restore anything. If it never fires `webglcontextrestored`, the renderer sits on a dead context forever. I confirmed this by forcing a loss and sampling the canvas pixels: every frame stayed flat until I remounted the component.

So "lost and restored" is handled for you. "Lost for good" isn't.

## The fix: wait, then rebuild

The idea is simple: when the context is lost, give the browser a moment to restore it. If it still hasn't, throw the renderer away and build a new one.

```ts
const RESTORE_WAIT_MS = 1000
const MAX_REBUILDS = 3
let rebuilds = 0
let restoreTimer: ReturnType<typeof setTimeout> | undefined

function onContextLost() {
  clearTimeout(restoreTimer)
  restoreTimer = setTimeout(rebuildIfLost, RESTORE_WAIT_MS)
}

function onContextRestored() {
  clearTimeout(restoreTimer)
}

function rebuildIfLost() {
  if (!renderer?.getContext().isContextLost()) return
  // A hidden page may lose the new context too; try again when it's visible.
  if (document.hidden || rebuilds >= MAX_REBUILDS) return
  rebuilds++
  disposeRenderer()
  initThreeJS()
}

renderer.domElement.addEventListener('webglcontextlost', onContextLost)
renderer.domElement.addEventListener('webglcontextrestored', onContextRestored)
```

A few details matter here:

- **Wait before rebuilding.** If the browser is about to restore the context, a rebuild would just fight it. One second is plenty.
- **Don't rebuild while hidden.** A backgrounded tab can lose the new context straight away. Instead, check again on `visibilitychange` and `pageshow` (the second one covers pages restored from the back/forward cache).
- **Cap the retries.** If the GPU really is gone, three attempts is enough. After that, the page stays usable without the animation.

```ts
function onPageShown() {
  if (!document.hidden) rebuildIfLost()
}

document.addEventListener('visibilitychange', onPageShown)
window.addEventListener('pageshow', onPageShown)
```

## Dispose properly, or make it worse

There's a trap in the cleanup. `renderer.dispose()` frees three.js resources, but it leaves the GL context alive. Rebuild a few times like that and you're piling up contexts, which is one of the ways to lose a context in the first place.

So the teardown releases the context explicitly, unless it's already lost:

```ts
if (!renderer.getContext().isContextLost()) renderer.forceContextLoss()
renderer.dispose()
renderer.domElement.remove()
```

## Testing it in CI

You can't wait for a GPU crash in a test, but you can fake a permanent loss. The `WEBGL_lose_context` extension has a `loseContext()` method, and if you never call `restoreContext()`, that's exactly the "lost for good" case.

CI machines usually have no GPU, so Chromium needs software WebGL (SwiftShader):

```ts
test.use({ launchOptions: { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] } })

test('the hero comes back after its WebGL context is lost for good', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('#hero canvas')
  await expect(canvas).toHaveCSS('opacity', '1')

  await canvas.evaluate((element: HTMLCanvasElement) => {
    element.dataset.old = 'true'
    element.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext()
  })

  const fresh = page.locator('#hero canvas:not([data-old])')
  await expect(fresh).toHaveCount(1, { timeout: 5_000 })
  await expect(fresh).toHaveCSS('opacity', '1')
})
```

Marking the old canvas with a data attribute makes the assertion clear: a new canvas exists, it's visible, and there's only one.

## Takeaways

- Any long-lived WebGL scene will lose its context sometimes. Plan for it.
- three.js handles a restored context. A context that's never restored is your job.
- Wait briefly, rebuild only while visible, cap the retries, and release the old context.
- `WEBGL_lose_context` plus SwiftShader lets you test all of it in CI.
