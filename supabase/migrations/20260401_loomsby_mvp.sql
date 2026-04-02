create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists public.pals (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  is_locked boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  content_md text not null,
  image_url text,
  pinned boolean not null default false,
  locked boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  content_md text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles (id) on delete cascade,
  user_b uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  check (user_a <> user_b)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  image_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_typing (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  is_typing boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (thread_id, user_id)
);

create table if not exists public.node_graphs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  graph jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_owner_from_auth()
returns trigger
language plpgsql
as $$
begin
  if tg_table_name = 'boards' then
    new.owner_id := auth.uid();
  elsif tg_table_name = 'posts' then
    new.author_id := auth.uid();
  elsif tg_table_name = 'comments' then
    new.author_id := auth.uid();
  elsif tg_table_name = 'chat_messages' then
    new.sender_id := auth.uid();
  elsif tg_table_name = 'node_graphs' then
    new.owner_id := auth.uid();
  elsif tg_table_name = 'chat_typing' then
    new.user_id := auth.uid();
  elsif tg_table_name = 'pals' then
    new.requester_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists set_owner_boards on public.boards;
create trigger set_owner_boards before insert on public.boards
for each row execute function public.set_owner_from_auth();

drop trigger if exists set_owner_posts on public.posts;
create trigger set_owner_posts before insert on public.posts
for each row execute function public.set_owner_from_auth();

drop trigger if exists set_owner_comments on public.comments;
create trigger set_owner_comments before insert on public.comments
for each row execute function public.set_owner_from_auth();

drop trigger if exists set_owner_messages on public.chat_messages;
create trigger set_owner_messages before insert on public.chat_messages
for each row execute function public.set_owner_from_auth();

drop trigger if exists set_owner_graphs on public.node_graphs;
create trigger set_owner_graphs before insert on public.node_graphs
for each row execute function public.set_owner_from_auth();

drop trigger if exists set_owner_typing on public.chat_typing;
create trigger set_owner_typing before insert on public.chat_typing
for each row execute function public.set_owner_from_auth();

drop trigger if exists set_owner_pals on public.pals;
create trigger set_owner_pals before insert on public.pals
for each row execute function public.set_owner_from_auth();

alter table public.profiles enable row level security;
alter table public.pals enable row level security;
alter table public.boards enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_typing enable row level security;
alter table public.node_graphs enable row level security;

create policy "profiles readable by authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles owned updates"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "pals member read"
  on public.pals for select
  to authenticated
  using (requester_id = auth.uid() or addressee_id = auth.uid());

create policy "pals requester insert"
  on public.pals for insert
  to authenticated
  with check (requester_id = auth.uid());

create policy "pals members update"
  on public.pals for update
  to authenticated
  using (requester_id = auth.uid() or addressee_id = auth.uid())
  with check (requester_id = auth.uid() or addressee_id = auth.uid());

create policy "pals members delete"
  on public.pals for delete
  to authenticated
  using (requester_id = auth.uid() or addressee_id = auth.uid());

create policy "boards authenticated read"
  on public.boards for select
  to authenticated
  using (true);

create policy "boards owner write"
  on public.boards for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "posts authenticated read"
  on public.posts for select
  to authenticated
  using (true);

create policy "posts author write"
  on public.posts for all
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "comments authenticated read"
  on public.comments for select
  to authenticated
  using (true);

create policy "comments author write"
  on public.comments for all
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "threads members read"
  on public.chat_threads for select
  to authenticated
  using (user_a = auth.uid() or user_b = auth.uid());

create policy "threads member create"
  on public.chat_threads for insert
  to authenticated
  with check (user_a = auth.uid() or user_b = auth.uid());

create policy "messages thread members read"
  on public.chat_messages for select
  to authenticated
  using (
    exists (
      select 1 from public.chat_threads t
      where t.id = thread_id and (t.user_a = auth.uid() or t.user_b = auth.uid())
    )
  );

create policy "messages sender insert"
  on public.chat_messages for insert
  to authenticated
  with check (sender_id = auth.uid());

create policy "messages sender update"
  on public.chat_messages for update
  to authenticated
  using (sender_id = auth.uid())
  with check (sender_id = auth.uid());

create policy "typing thread members read"
  on public.chat_typing for select
  to authenticated
  using (
    exists (
      select 1 from public.chat_threads t
      where t.id = thread_id and (t.user_a = auth.uid() or t.user_b = auth.uid())
    )
  );

create policy "typing owner write"
  on public.chat_typing for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "graphs owner read"
  on public.node_graphs for select
  to authenticated
  using (owner_id = auth.uid());

create policy "graphs owner write"
  on public.node_graphs for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "avatar read public"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'avatars');

create policy "avatar owner upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

create policy "media read public"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'media');

create policy "media user upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

-- Thumbnail generation should be implemented by a Supabase Edge Function
-- triggered by Storage object creation. This migration keeps schema/policies ready.
