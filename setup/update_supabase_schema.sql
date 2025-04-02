
-- Create join table for gallery images and print options
create table if not exists image_print_options (
  image_id uuid references gallery_images(id) on delete cascade,
  print_option_id uuid references print_options(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (image_id, print_option_id)
);

-- Add Row Level Security (RLS) policies for the new table
alter table image_print_options enable row level security;

-- Allow public to view image_print_options
create policy "Public can view image print options"
  on image_print_options for select
  using (true);

-- Allow authenticated users to insert image_print_options
create policy "Authenticated users can insert image print options"
  on image_print_options for insert
  with check (auth.role() = 'authenticated');

-- Allow authenticated users to update image_print_options
create policy "Authenticated users can update image print options"
  on image_print_options for update
  using (auth.role() = 'authenticated');

-- Allow authenticated users to delete image_print_options
create policy "Authenticated users can delete image print options"
  on image_print_options for delete
  using (auth.role() = 'authenticated');
