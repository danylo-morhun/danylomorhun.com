---
title: Bigger tap targets without changing the design
description: Small icons are hard to hit on a phone. Three CSS patterns make the touch area 44px while the layout stays exactly as designed, plus a test that keeps it that way.
date: 2026-12-14
tags: [css, accessibility, mobile]
---

On a phone, a 20px icon is hard to hit. Apple's guidelines ask for at least 44×44 points of touch area, and WCAG's enhanced target-size rule asks for 44×44 CSS pixels. Most designs, including mine, have icons and links that are much smaller than that.

The usual fix is "make the buttons bigger", which changes the design. But the touch area and the visible size don't have to be the same thing. Here are the three patterns I used on this site to make every control 44px to the touch while keeping the layout exactly as it was.

## 1. Negative margin, matching padding

A footer icon is 20px. Give its link 12px of padding on every side and it becomes 44px. That would push everything around it, so cancel the padding with the same negative margin:

```html
<a class="-m-3 p-3" href="https://github.com/...">
  <svg width="20" height="20">...</svg>
</a>
```

`p-3` adds 12px of padding, and `-m-3` takes 12px back from the layout. The link is now 20 + 12 + 12 = 44px wide and tall, but it takes up the same 20px in the flow. The icon doesn't move.

Two things to watch:

- **Neighbors must be far enough apart.** If two icons sit 8px apart and both grow by 12px, their touch areas overlap and the later one wins. I widened the gap between footer icons to 24px, so each one keeps its own 44px.
- **The hover style now covers the padding.** A background on hover would show the bigger box. That's fine for color-only hovers, which is what this site uses.

The same trick works on text links. The "back" link on case study pages is a line of small text, so it gets vertical padding only: `-my-3 py-3`.

## 2. Bigger on touch screens, compact on desktop

Some controls sit in a fixed-size row, like the theme and language buttons in the navigation bar. Padding plus negative margin would make them overlap. These simply get a different size per breakpoint:

```html
<button class="size-11 sm:size-8">...</button>
```

44px on small screens, 32px from the `sm` breakpoint up. On a phone the nav bar is already tight, so I also cut its vertical padding there to keep the bar the same height.

Screen width is only a hint about how people point. A tablet in landscape is wide and still touch. If that matters for your audience, `@media (pointer: coarse)` targets touch screens directly.

## 3. A pseudo-element for the hit area

The "Contact" button in the footer has a visible border, so padding would change how it looks. Instead, an invisible `::after` extends the clickable area above and below it:

```html
<a class="relative after:absolute after:inset-x-0 after:-inset-y-1.5" href="mailto:...">
  Contact
</a>
```

The pseudo-element belongs to the link, so taps on it count as taps on the link. The border stays where it was.

## Test it, or it will regress

A tap target is easy to break without noticing: someone removes a class or adds a new icon. So there's a browser test that runs on a phone-sized viewport and measures real controls:

```ts
test('controls are easy to tap', async ({ page }) => {
  await gotoHydrated(page, '/pl/work/grx-pay')
  const targets = [
    page.getByRole('button', { name: 'Język' }),
    page.getByRole('button', { name: 'Przełącz motyw' }),
    page.getByRole('button', { name: 'Menu' }),
    page.locator('article').getByRole('link').first(),
    page.locator('footer').getByRole('link', { name: /GitHub/ }),
  ]
  for (const target of targets) {
    const box = (await target.boundingBox())!
    expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44)
  }
})
```

It runs on the Polish version on purpose, because longer labels are where layouts break first.

One limit: `boundingBox()` measures the element's own box, so it doesn't see a `::after` hit area. For pattern 3, `document.elementFromPoint()` at a point just outside the border is a better check: it should return the link.

## Takeaways

- What you see and what you can tap can be different sizes.
- Padding plus an equal negative margin grows the tap area without moving anything.
- Where controls share a tight row, size them per breakpoint, or per pointer type.
- For bordered buttons, extend the hit area with an invisible pseudo-element.
- Measure tap targets in a test, on the narrowest screen and the longest language.
