create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.users enable row level security;

-- Create policy to allow users to read their own data
create policy "Users can view own profile" on users
  for select using (auth.uid() = id);

-- Create policy to allow users to update their own data
create policy "Users can update own profile" on users
  for update using (auth.uid() = id);

-- Create policy to allow insert during signup
create policy "Users can insert own profile" on users
  for insert with check (auth.uid() = id);