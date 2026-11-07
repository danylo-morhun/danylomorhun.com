---
title: Matching the browser's color to a theme the server can't see
description: A dark site with a light browser bar looks broken. Here's how to set theme-color for a light/dark site when the server doesn't know which theme the reader picked.
date: 2026-11-16
tags: [nuxt, css, dark mode]
---

Some browsers tint their own UI to match the page: the address bar in Chrome on Android, the title bar of an installed web app. You set the color with one tag:

```html
<meta name="theme-color" content="#060606">
```

That's easy on a site with one look. This site has a light and a dark theme, and that makes it harder than it seems.

## The server doesn't know the theme

The reader's theme comes from one of two places:

- **The OS setting**, through `prefers-color-scheme`.
- **A choice they made** with the theme toggle, saved in the browser.

The page is prerendered, so the HTML is built long before anyone visits. The server can't read the OS setting, and it can't read what's saved in someone's browser. Whatever single color it picks will be wrong for half the readers, at least until JavaScript runs.

## Let the browser decide

`theme-color` accepts a `media` attribute, so you can ship both colors and let the browser pick the one that matches the OS:

```html
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f5f5f5">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#060606">
```

No JavaScript needed. The bar is right from the first paint, for everyone who uses the system theme.

## Then follow the reader's choice

Once someone picks a theme with the toggle, the OS setting no longer matters. A dark-OS reader who chose the light theme should get a light bar. So after hydration the page switches from "two colors, browser picks" to "one color, the one they chose".

In Nuxt with `@nuxtjs/color-mode`, that's one reactive `useHead` call:

```ts
const colorMode = useColorMode()
const THEME_COLORS = { light: '#f5f5f5', dark: '#060606' }

useHead({
  meta: () => colorMode.preference === 'system'
    ? [
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: THEME_COLORS.light },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: THEME_COLORS.dark },
      ]
    : [{ name: 'theme-color', content: colorMode.value === 'light' ? THEME_COLORS.light : THEME_COLORS.dark }],
})
```

`preference` is what the reader asked for (`system`, `light` or `dark`). `value` is the theme actually in use. When the preference is `system`, both tags stay and the browser keeps choosing. Otherwise, there's one tag with the chosen color.

## The trap: keys

My first version gave each tag a `key`, because keys are how you usually tell the head manager "this tag replaces that one". After hydration, the page had **duplicate** `theme-color` tags: the ones from the server plus a new set from the client.

Without keys, the head manager matched the server-rendered tags and updated them in place. So the fix was to delete code. If your head tags double up after hydration, check for keys you don't need.

## Keep the colors in one place

The two hex values should match the page background in each theme. Those backgrounds are defined in CSS, so there are now two sources of truth. A comment next to `THEME_COLORS` saying where the values come from helps, and so does a test.

## Testing it

The browser test checks both states: two tags while the theme follows the OS, one tag after the reader picks a theme.

```ts
const themeColors = () => page.locator('meta[name="theme-color"]').evaluateAll(metas =>
  metas.map(meta => `${meta.getAttribute('media') ?? 'any'}=${meta.getAttribute('content')}`))

await gotoHydrated(page, '/work/grx-pay')
expect(await themeColors()).toEqual([
  '(prefers-color-scheme: light)=#f5f5f5',
  '(prefers-color-scheme: dark)=#060606',
])

await page.getByRole('button', { name: 'Toggle color theme' }).click()
await expect.poll(themeColors).toHaveLength(1)
```

Waiting for hydration first matters. Checking before Vue takes over would only test the server HTML.

## Takeaways

- A prerendered page can't know the reader's theme, so don't guess. Ship both colors with `media` and let the browser choose.
- Switch to a single color only once the reader has made an explicit choice.
- If head tags appear twice after hydration, look for `key`s that stop the client from matching the server's tags.
