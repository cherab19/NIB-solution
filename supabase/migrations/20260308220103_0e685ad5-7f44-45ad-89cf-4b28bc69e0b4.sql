
-- Create app_role enum
create type public.app_role as enum ('admin', 'user');

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.profiles enable row level security;

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Profile RLS
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- User roles RLS
create policy "Users can view own roles" on public.user_roles for select using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin CRUD policies for blog_posts
create policy "Admins can insert blog posts" on public.blog_posts for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update blog posts" on public.blog_posts for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete blog posts" on public.blog_posts for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can select all blog posts" on public.blog_posts for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Admin CRUD policies for portfolio_projects
create policy "Admins can insert portfolio" on public.portfolio_projects for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update portfolio" on public.portfolio_projects for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete portfolio" on public.portfolio_projects for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Admin CRUD policies for services
create policy "Admins can insert services" on public.services for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update services" on public.services for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete services" on public.services for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Admin CRUD policies for products
create policy "Admins can insert products" on public.products for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update products" on public.products for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete products" on public.products for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Admin policies for contact_messages
create policy "Admins can select contact messages" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update contact messages" on public.contact_messages for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete contact messages" on public.contact_messages for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Admin policies for site_stats
create policy "Admins can insert stats" on public.site_stats for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update stats" on public.site_stats for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete stats" on public.site_stats for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
