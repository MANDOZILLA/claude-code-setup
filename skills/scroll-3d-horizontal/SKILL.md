---
name: scroll-3d-horizontal
description: Scaffold horizontal scroll storytelling — scrolling down moves content right over a 3D WebGL canvas. Use for "horizontal scroll with 3D", "Apple-style horizontal scroll", or pin-and-scrub effects.
---

# Skill: scroll-3d-horizontal

Scaffold a horizontal scroll storytelling experience — scrolling DOWN moves the content RIGHT — with a live 3D WebGL canvas behind it.

## Triggers
- `/scroll-3d-horizontal`
- "horizontal scroll with 3D"
- "scroll sideways animation"
- "Apple-style horizontal scroll"
- "sections that slide left to right"
- "pin and scrub scroll"

## What this builds
User scrolls DOWN. The page is pinned. Sections slide horizontally LEFT → RIGHT one at a time (like an Apple product page). The 3D WebGL canvas stays fixed in the background and animates in sync with scroll progress.

This is the pattern used by Apple (AirPods Pro), Stripe, Linear, and other premium sites.

## Stack (same as scroll-3d-vertical, plus GSAP)
- `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three`
- `lenis` — smooth scroll
- `gsap` + `ScrollTrigger` — horizontal pinning/scrubbing

## Install command
```bash
npm install @react-three/fiber @react-three/drei @react-three/postprocessing three lenis gsap
```

## Key files

### `components/SmoothScroll.tsx`
Must wire Lenis into GSAP ticker so ScrollTrigger stays synced:
```tsx
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis()
    const tickerFn = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)
    return () => { lenis.destroy(); gsap.ticker.remove(tickerFn) }
  }, [])
  return <>{children}</>
}
```

### `components/HorizontalScroll.tsx`
The core component. Wraps sections, pins the container, translates children left as scroll progresses:
```tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          pin: true,
          scrub: 1.2,
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="relative">
      <div ref={trackRef} className="flex h-screen will-change-transform">
        {children}
      </div>
    </div>
  )
}
```

### `app/page.tsx` section layout
Each section must be `min-w-[100vw] shrink-0` to fill one screen width and not flex-shrink:
```tsx
'use client'
import dynamic from 'next/dynamic'
import HorizontalScroll from '@/components/HorizontalScroll'
const Scene = dynamic(() => import('@/components/Scene'), { ssr: false })

export default function Home() {
  return (
    <>
      <Scene />
      <main className="relative" style={{ zIndex: 10 }}>
        <HorizontalScroll>
          <section className="min-w-[100vw] h-screen flex items-center justify-center shrink-0">
            <h1 className="text-8xl font-black text-white">Section 1</h1>
          </section>
          <section className="min-w-[100vw] h-screen flex items-center shrink-0 px-32">
            <div className="text-white max-w-md">
              <h2 className="text-5xl font-bold mb-4">Section 2</h2>
              <p className="text-white/50">Slides in from right as you scroll down.</p>
            </div>
          </section>
          {/* Keep adding sections — each one is 100vw wide */}
        </HorizontalScroll>
      </main>
    </>
  )
}
```

The 3D canvas (fixed, z-index 0) uses the same `useScrollProgress` hook — since vertical `scrollY` still increases during the pinned horizontal section, the 3D animation stays in sync automatically.

## How scroll progress works
The GSAP pin adds extra scroll height equal to `track.scrollWidth - window.innerWidth`. So `window.scrollY / maxScroll` (the hook) gives 0→1 across the full horizontal journey. The 3D object reacts to the same value that drives the horizontal slide.

## Snap between sections (optional)
Add `snap: 1 / (sectionCount - 1)` inside the ScrollTrigger config to make sections snap into place when you release the scroll.

## Critical gotchas
- `lenis.on('scroll', ScrollTrigger.update)` is mandatory — without it the pinned section jitters because Lenis and ScrollTrigger fight over scroll position
- `gsap.ticker.lagSmoothing(0)` prevents GSAP from "catching up" after tab switch lag
- `invalidateOnRefresh: true` recalculates widths on window resize
- `will-change-transform` on the track div hints the GPU to composite it separately (performance)
- Do NOT use `overflow-x: scroll` on the wrap — GSAP controls the x position via transform, the wrapper itself is `overflow: hidden`
- **Avoid drei's `<Environment preset="...">`** in the background `Scene.tsx` — see scroll-3d-vertical's gotchas for full detail. On some GPU/driver combos its HDRI fetch + PMREM generation permanently crashes the WebGL context a few seconds in (canvas flashes once then blank forever, no JS error), reproducing across both Chrome and Edge. Use manual lights instead. Always include the `webglcontextlost`/`webglcontextrestored` + `preventDefault()` listener in the Canvas `onCreated` regardless.
- If the scene flashes then goes permanently blank: bisect, don't guess — strip Scene.tsx to one mesh + one light, confirm stable, then add pieces back one at a time (Environment first, then Bloom, then any per-frame geometry mutation).

## Working demo
`C:\Users\whyhe\scroll-3d-demo` — run `npm run dev`, open localhost:3000
Horizontal scroll is active on the main page.
