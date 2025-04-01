
-- Create tables for the photography website

-- Gallery Images Table
create table gallery_images (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  photographer_note text,
  location text,
  date text,
  image_url text not null,
  alt text,
  categories text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Print Options Table
create table print_options (
  id uuid default uuid_generate_v4() primary key,
  size text not null,
  price decimal(10, 2) not null,
  in_stock boolean default true,
  created_at timestamp with time zone default now()
);

-- Blog Posts Table
create table blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  featured_image_url text,
  excerpt text,
  author text not null default 'Junglee Ghumakkad',
  published boolean default false,
  created_at timestamp with time zone default now()
);

-- Create storage buckets for images
-- Note: You need to create these in Supabase dashboard or via API

-- Set up Row Level Security (RLS) policies

-- For Gallery Images
alter table gallery_images enable row level security;

create policy "Public can view gallery images"
  on gallery_images for select
  using (true);

create policy "Authenticated users can insert gallery images"
  on gallery_images for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update their gallery images"
  on gallery_images for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete their gallery images"
  on gallery_images for delete
  using (auth.role() = 'authenticated');

-- For Print Options
alter table print_options enable row level security;

create policy "Public can view print options"
  on print_options for select
  using (true);

create policy "Authenticated users can manage print options"
  on print_options for all
  using (auth.role() = 'authenticated');

-- For Blog Posts
alter table blog_posts enable row level security;

create policy "Public can view published blog posts"
  on blog_posts for select
  using (published = true);

create policy "Authenticated users can view all blog posts"
  on blog_posts for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can manage blog posts"
  on blog_posts for all
  using (auth.role() = 'authenticated');

-- Insert sample data for Print Options
insert into print_options (size, price, in_stock) values
  ('8x10 inches', 24.99, true),
  ('11x14 inches', 39.99, true),
  ('16x20 inches', 59.99, true),
  ('20x30 inches', 89.99, true),
  ('24x36 inches', 129.99, false);
