create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  bucket text not null check (bucket in ('user-images', 'board-images', 'chat-images', 'builder-assets')),
  path text not null,
  url text not null,
  thumbnail_url text,
  context text not null check (context in ('chat', 'board', 'profile', 'builder')),
  board_id uuid references public.boards (id) on delete cascade,
  post_id uuid references public.posts (id) on delete cascade,
  thread_id uuid references public.chat_threads (id) on delete cascade,
  message_id uuid references public.chat_messages (id) on delete cascade,
  node_graph_id uuid references public.node_graphs (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.post_images (
  post_id uuid not null references public.posts (id) on delete cascade,
  image_id uuid not null references public.images (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, image_id)
);

alter table public.boards
  add column if not exists images_private boolean not null default false;

alter table public.chat_messages
  add column if not exists image_id uuid references public.images (id) on delete set null;

alter table public.images enable row level security;
alter table public.post_images enable row level security;

create policy "images owner read"
  on public.images for select
  to authenticated
  using (user_id = auth.uid());

create policy "images owner insert"
  on public.images for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "images owner update"
  on public.images for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "images owner delete"
  on public.images for delete
  to authenticated
  using (user_id = auth.uid());

create policy "post_images readable by authenticated"
  on public.post_images for select
  to authenticated
  using (
    exists (
      select 1
      from public.posts p
      where p.id = post_images.post_id
    )
  );

create policy "post_images author insert"
  on public.post_images for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.posts p
      where p.id = post_images.post_id and p.author_id = auth.uid()
    )
    and exists (
      select 1
      from public.images i
      where i.id = post_images.image_id and i.user_id = auth.uid()
    )
  );

create policy "post_images author delete"
  on public.post_images for delete
  to authenticated
  using (
    exists (
      select 1
      from public.posts p
      where p.id = post_images.post_id and p.author_id = auth.uid()
    )
  );

insert into storage.buckets (id, name, public)
values ('user-images', 'user-images', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('board-images', 'board-images', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('builder-assets', 'builder-assets', false)
on conflict (id) do nothing;

create policy "user-images owner read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'user-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "user-images owner write"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'user-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'user-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "board-images owner read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'board-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "board-images owner write"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'board-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'board-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "chat-images owner read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'chat-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "chat-images owner write"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'chat-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'chat-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "builder-assets owner read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'builder-assets'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "builder-assets owner write"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'builder-assets'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'builder-assets'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
