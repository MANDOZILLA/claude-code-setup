---
name: scroll-3d-vertical
description: "Scaffold vertical scroll-driven 3D: fixed canvas behind HTML sections, scrolling animates object and camera. Use for \"vertical 3D scroll\", \"WebGL scroll animation\", or a scroll-reactive 3D hero."
---

# Skill: scroll-3d-vertical

Scaffold a scroll-driven vertical 3D web experience using React Three Fiber + Lenis.

## Triggers
- `/scroll-3d-vertical`
- "set up vertical 3D scroll"
- "3D animation that reacts to scrolling down"
- "WebGL scroll animation"

## What this builds
A Next.js page with a fixed 3D canvas in the background. As the user scrolls down through HTML sections, the 3D object rotates, moves, shifts color, and the camera animates — all driven by scroll position in real-time.

## Stack
- `@react-three/fiber` — WebGL canvas inside React
- `@react-three/drei` — helpers (Stars, Environment, etc.)
- `@react-three/postprocessing` — Bloom glow effect
- `three` — 3D math and geometry
- `lenis` — smooth scroll physics

## Install command
```bash
npm install @react-three/fiber @react-three/drei @react-three/postprocessing three lenis gsap
```

Also add to `next.config.ts`:
```ts
transpilePackages: ['three']
```

## Key files to create

### `hooks/useScrollProgress.ts`
```ts
'use client'
import { useEffect, useRef } from 'react'

export function useScrollProgress() {
  const progress = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}
```
Returns a ref (not state) so reading it inside `useFrame` never causes re-renders.

### `components/AnimatedMesh.tsx`
```tsx
'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export default function AnimatedMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const scroll = useScrollProgress()

  useFrame(({ clock, camera }) => {
    if (!meshRef.current || !matRef.current) return
    const p = scroll.current
    const t = clock.getElapsedTime()

    meshRef.current.rotation.x = t * 0.12 + p * Math.PI * 2
    meshRef.current.rotation.y = t * 0.18 + p * Math.PI * 1.5
    meshRef.current.position.y = Math.sin(t * 0.6) * 0.12 - p * 0.6
    meshRef.current.position.x = Math.sin(p * Math.PI) * 1.8

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6 - p * 3, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, p * 0.8, 0.05)

    // Color: purple → blue → cyan
    matRef.current.color.setHSL(0.75 - p * 0.25, 0.9, 0.65)
    matRef.current.emissive.setHSL(0.75 - p * 0.25, 1, 0.08 + p * 0.06)
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 256, 32, 2, 3]} />
      <meshStandardMaterial ref={matRef} color="#8b5cf6" metalness={0.85} roughness={0.1} emissive="#4b0082" emissiveIntensity={0.6} />
    </mesh>
  )
}
```

To use a real 3D model instead of geometry:
```tsx
import { useGLTF } from '@react-three/drei'
const { scene } = useGLTF('/model.glb') // put glb in /public
return <primitive object={scene} ref={meshRef} />
```

### `components/Scene.tsx`
```tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import AnimatedMesh from './AnimatedMesh'

export default function Scene() {
  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true }}
        style={{ background: '#020209' }}
        onCreated={({ gl }) => {
          // Without preventDefault, a lost WebGL context never comes back — canvas just goes blank forever
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            console.warn('WebGL context lost — waiting for restore')
          })
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.warn('WebGL context restored')
          })
        }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[4, 4, 4]} intensity={3} color="#8b5cf6" />
        <pointLight position={[-4, -4, 4]} intensity={1.5} color="#06b6d4" />
        <AnimatedMesh />
        <Stars radius={150} depth={60} count={6000} factor={4} fade speed={0.4} />
        <EffectComposer>
          <Bloom intensity={1.8} luminanceThreshold={0.35} luminanceSmoothing={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
```

### `app/page.tsx`
```tsx
'use client'
import dynamic from 'next/dynamic'
const Scene = dynamic(() => import('@/components/Scene'), { ssr: false })

export default function Home() {
  return (
    <>
      <Scene />
      <main className="relative" style={{ zIndex: 10 }}>
        <section className="h-screen flex items-center justify-center">
          <h1 className="text-8xl font-black text-white">Hero</h1>
        </section>
        <section className="h-screen flex items-center pl-32">
          <div className="text-white max-w-md">
            <h2 className="text-5xl font-bold mb-4">Section Two</h2>
            <p className="text-white/50">Content here.</p>
          </div>
        </section>
        {/* add more sections */}
      </main>
    </>
  )
}
```

## Critical gotchas
- **Always `ssr: false`** on the Canvas dynamic import — Three.js needs a browser DOM
- **`'use client'`** on every file that uses R3F hooks (`useFrame`, `useRef`, etc.)
- **`transpilePackages: ['three']`** in next.config.ts — needed for Next.js bundler
- In Next.js 16+, `ssr: false` requires the file using `dynamic()` to also be `'use client'`
- Modify camera inside `useFrame`, NOT with React state — state updates cause re-renders which kill performance
- Use `THREE.MathUtils.lerp` for smooth camera easing instead of snapping
- **Avoid drei's `<Environment preset="...">` (HDRI image-based lighting).** On some GPU/driver combos it reliably crashes the WebGL context permanently a few seconds after load (canvas flashes once then goes blank forever, no JS error, no recoverable `webglcontextrestored` event) — reproduces across Chrome AND Edge on the same machine, so it's not a browser-specific quirk. Root cause: the HDRI fetch + one-shot PMREM (prefiltered mipmap environment map) GPU computation it runs on load. Confirmed by bisection: strip `Scene.tsx` to a bare `<mesh>` + lights first (should be rock solid), then add pieces back one at a time — `Environment` was the trigger every time, removing it fixed it instantly with no other changes. Use manual `ambientLight` + `directionalLight` + colored `pointLight`s instead — for stylized/low-poly scenes you don't need photoreal HDRI reflections anyway.
- Always add the `webglcontextlost`/`webglcontextrestored` listener with `preventDefault()` shown in the Scene.tsx template above — it's not a full fix for a driver-level crash, but without it a context loss is permanent even in cases that WOULD otherwise auto-recover.
- If a scene flashes once then goes permanently blank: it's a real WebGL context loss (confirm via console: `THREE.WebGLRenderer: Context Lost.` with no matching `restored` log), not a React/JS error. Debug by bisection, not by staring at the code — comment the whole scene down to one mesh + one light, confirm it's stable, then reintroduce pieces one at a time (Environment/HDRI first, then postprocessing/Bloom, then any per-frame vertex/geometry mutation) until it breaks again.

## Customizing the 3D object
Replace `<torusKnotGeometry>` with any Three.js geometry:
- `<sphereGeometry args={[1, 64, 64]}>`
- `<icosahedronGeometry args={[1, 4]}>`
- `<boxGeometry args={[1.5, 1.5, 1.5]}>`
- Or load a `.glb` model with `useGLTF('/model.glb')` from Drei

## Working demo
`C:\Users\whyhe\scroll-3d-demo` — run `npm run dev`, open localhost:3000
