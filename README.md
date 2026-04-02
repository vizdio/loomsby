# Loomsby

Loomsby is a modular React + Supabase platform scaffold with:

- Auth (email/password + Google OAuth)
- Pals system (request/accept/decline/remove/block)
- Bulletin boards (boards, posts, comments, markdown)
- Live chat (1:1 threads, realtime messages)
- Image sharing via Supabase Storage
- Node-based builder foundation using React Flow

## Stack

- React + TypeScript + Vite
- Supabase (Auth, Postgres, Realtime, Storage)
- React Router
- React Query
- Zustand
- React Hook Form + Zod

## Folder Structure

- src/components
- src/features
- src/hooks
- src/lib
- src/pages
- src/providers
- src/styles
- src/utils

## Setup

1. Install dependencies:
   npm install
2. Copy env file:
   cp .env.example .env
3. Fill in:
    - VITE_SUPABASE_URL
    - VITE_SUPABASE_ANON_KEY
4. Apply SQL migration from:
   supabase/migrations/20260401_loomsby_mvp.sql
5. Run dev server:
   npm run dev

## Security

- Row Level Security (RLS) enabled for app tables.
- Policies scoped to authenticated users and ownership/membership.
- Chat and pals data are restricted to participants.

## Notes

- Thumbnail generation is left as an optional Supabase Edge Function.
- Builder flow execution is intentionally simple for MVP extension.
