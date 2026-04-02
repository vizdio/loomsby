# Loomsby Supabase Setup

1. Create a new Supabase project.
2. Run the SQL migration in `supabase/migrations/20260401_loomsby_mvp.sql`.
3. Enable Google OAuth in Auth providers if needed.
4. Add frontend env variables using `.env.example`.
5. Optional: create an Edge Function for image thumbnail generation.

## Realtime
Enable replication for tables:
- `posts`
- `chat_messages`
- `chat_typing`

## Security Notes
- RLS is enabled on all app tables.
- Write policies are scoped to `auth.uid()`.
- Chat read access is restricted to thread participants.
- Pals access is restricted to record participants.
