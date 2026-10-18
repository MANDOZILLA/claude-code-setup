---
name: nextjs-app-router
description: Use this skill for ANY Next.js 14+ task using the App Router — creating pages, API routes, server/client components, layouts, middleware, data fetching, route handlers, dynamic routes, or deploying. Trigger whenever the user mentions Next.js, App Router, server components, use client, route handlers, app/ directory, layout.tsx, page.tsx, loading.tsx, or is building any Next.js project.
---

# Next.js 14 App Router Patterns

## Directory structure
```
/app
  layout.tsx              ← root layout, always server component
  page.tsx                ← route UI
  loading.tsx             ← auto Suspense fallback
  error.tsx               ← error boundary (must be 'use client')
  not-found.tsx
  /api
    /[route]
      route.ts            ← API route handler
  /dashboard
    /[id]
      page.tsx            ← dynamic route: params.id
/components
  /ui                     ← pure UI, usually client
  /server                 ← data-fetching components, server only
/lib
  db.ts
  auth.ts
/public
next.config.ts
```

## Server vs Client components

| | Server (default) | Client ('use client') |
|--|--|--|
| Data fetching | ✅ async/await directly | ❌ use useEffect/SWR |
| Browser APIs | ❌ | ✅ |
| useState/useEffect | ❌ | ✅ |
| Access DB/secrets | ✅ | ❌ |
| Bundle size | 0 JS shipped | Adds to bundle |

**Rule**: default to Server. Add `'use client'` only when you need interactivity or browser APIs. Push `'use client'` as far down the tree as possible.

## Page component (server)
```tsx
// app/dashboard/[projectId]/page.tsx
export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: { projectId: string }
  searchParams: { range?: string }
}) {
  const data = await fetchData(params.projectId); // direct async, no useEffect
  return <Dashboard data={data} />;
}
```

## Route handler (API)
```ts
// app/api/analytics/overview/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const propertyId = req.nextUrl.searchParams.get('propertyId');
  try {
    const data = await getOverview(propertyId!);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // ...
  return NextResponse.json({ ok: true });
}
```

## Data fetching patterns

### Server component (preferred)
```tsx
async function StatsCard({ propertyId }: { propertyId: string }) {
  const stats = await getStats(propertyId); // runs on server, secrets safe
  return <div>{stats.sessions}</div>;
}
```

### Client component with SWR
```tsx
'use client';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(r => r.json());

export function RealtimePanel({ propertyId }: { propertyId: string }) {
  const { data, error } = useSWR(`/api/analytics/realtime?id=${propertyId}`, fetcher, {
    refreshInterval: 30000
  });
  if (error) return <ErrorState />;
  if (!data) return <Skeleton />;
  return <div>{data.activeUsers}</div>;
}
```

## Layout with sidebar
```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-[#0a0a0a]">
        <Sidebar />           {/* server component */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
```

## Dynamic routes
```
app/dashboard/[projectId]/page.tsx  → params.projectId
app/blog/[...slug]/page.tsx         → params.slug (array)
app/shop/[[...category]]/page.tsx   → optional catch-all
```

## Loading & Suspense
```tsx
// app/dashboard/[id]/loading.tsx — auto-wraps page in Suspense
export default function Loading() {
  return <DashboardSkeleton />;
}

// Or inline Suspense for granular loading
import { Suspense } from 'react';
<Suspense fallback={<Skeleton />}>
  <SlowServerComponent />
</Suspense>
```

## Environment variables
```
.env.local          ← local only, never committed
.env.production     ← production

NEXT_PUBLIC_*       ← exposed to browser
Everything else     ← server-only (safe for secrets)
```
```ts
// Server only
const key = process.env.GA4_KEY_PATH;

// Client-safe
const url = process.env.NEXT_PUBLIC_API_URL;
```

## next.config.ts patterns
```ts
import type { NextConfig } from 'next';
const config: NextConfig = {
  // Allow external image domains
  images: { domains: ['example.com'] },
  // Env passthrough
  env: { GA4_KEY_PATH: process.env.GA4_KEY_PATH },
};
export default config;
```

## Common gotchas
- `params` and `searchParams` in page.tsx are plain objects, not URLSearchParams
- Route handlers replace `pages/api/` — do NOT create both
- Server components cannot import client components that use hooks at the top level (wrap in Suspense)
- `cookies()` and `headers()` make a route dynamic — cache won't apply
- `'use client'` propagates down: all children of a client component are also client-side
- For real-time polling, use client component + SWR `refreshInterval`, not server components
