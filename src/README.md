
# Junglee Ghumakkad Photography Website

## Supabase Setup Instructions

This project uses Supabase for authentication and database functionality. Follow these steps to set up your Supabase project:

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create an account if you don't have one
2. Create a new project with a name of your choice
3. Note down your project URL and anon key (found in Settings > API)

### 2. Set Up Environment Variables

Create a `.env` file in the **ROOT** of the project (NOT in the src folder) and add these variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Example:**
```
VITE_SUPABASE_URL=https://abcdefghijklm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Important Notes:
- The `.env` file MUST be in the project root directory
- Do NOT commit the `.env` file to version control
- Restart your development server after adding these variables

After adding these variables, restart your development server.

### 3. Set Up Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `setup/supabase_schema.sql` and run it to create your tables and policies

### 4. Create Storage Buckets

1. Go to Storage in your Supabase dashboard
2. Create the following buckets:
   - `images`: For all website images
   - `gallery`: For gallery images
   - `blogs`: For blog post images

Make sure to set the appropriate access permissions (recommended: authenticated uploads, public downloads)

### 5. Set Up Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Make sure Email provider is enabled
3. Set up additional providers if needed
4. Go to Users and create an admin user with your email address

### 6. Upload Initial Content

1. Login to the admin interface with your created admin account
2. Use the UI to upload gallery images, set print options, and create blog posts

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Additional Notes

- The admin section is password-protected and only accessible to authenticated users
- All image uploads are stored in Supabase Storage
- Database queries use React Query for efficient caching and updates

## Troubleshooting

If you see "Supabase Configuration Missing" alert:
1. Check that you've created a `.env` file in the root directory (not in src/)
2. Ensure your environment variables are named correctly: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
3. Restart your development server after making changes to the .env file
4. If using production build, ensure these variables are set in your hosting environment
