# Chakra - Nepal MTB Hub

Central hub for Nepal's mountain biking community. Built with Next.js 14, Supabase, Tailwind CSS, shadcn/ui.

## Vision
Every trail from Shivapuri Nagarjun to Mustang mapped, every rider connected, every shop and guide discoverable. Features monsoon trail intelligence, offline GPX, SOS, and local payments.

## Tech Stack
- **Frontend:** Next.js App Router, TypeScript, Tailwind, shadcn/ui, Lucide Icons, Recharts, MapLibre GL (placeholder)
- **Backend:** Supabase Auth, Postgres + PostGIS, Storage, Realtime
- **Maps:** MapLibre + OpenStreetMap + PostGIS geom
- **Deploy:** Vercel + Supabase Cloud

## Features Implemented (MVP Scaffold)
1. Landing with stats
2. Trails discovery + detail with elevation, condition badges, GPX actions
3. Events calendar + detail + registration
4. Community feed
5. Shops directory
6. Marketplace
7. Tours for MTB tourism
8. Auth pages (Supabase ready)
9. Profile with badges and karma

## Setup

1. Clone and install
```bash
npm install
```

2. Setup env
```bash
cp .env.example .env.local
# Fill Supabase keys from supabase.com dashboard
```

3. Create Supabase project and run schema
- Go to SQL editor in Supabase
- Run `supabase/schema.sql`
- Run `supabase/seed.sql`
- Enable PostGIS: `create extension postgis;`
- Create Storage buckets: `trail-gpx`, `trail-photos`, `avatars` (public)

4. Run dev
```bash
npm run dev
```

## Database Schema
See `supabase/schema.sql` - includes profiles, trails (PostGIS LineString), trail_conditions, events, groups, posts, shops, tours, listings, achievements.

RLS: Add policies for public read verified trails, owner write. Starter SQL includes comments.

## Roadmap
- Phase 1: MVP (this zip)
- Phase 2: Real Mapbox integration, GPX parser Edge Function, Realtime conditions
- Phase 3: eSewa/Khalti payments, Strava OAuth sync, push notifications
- Phase 4: Offline PWA + SOS, AI route planner, native wrapper

## Unique Nepal Features to Build Next
- Monsoon condition reporting with photo
- WhatsApp booking for guides
- Altitude warning for Mustang/Annapurna
- Karma points system for verified contributions

## Deployment
Push to GitHub, import to Vercel, add env vars. Supabase URL must be public.

## License
MIT - for Nepal MTB community
