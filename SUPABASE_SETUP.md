# Supabase Setup & Architecture

All user data (projects, contact messages, site settings, client testimonials, brand logos, milestones) and all uploaded assets (images, resumes, PDFs) are stored **exclusively in Supabase**. Local database (`data.json`) and local disk uploads (`/uploads`) are disabled.

## Setup Instructions

1. **Database Schema**: Execute `supabase/schema.sql` in your Supabase SQL Editor. This initializes all 6 tables (`portfolio_content`, `contact_messages`, `portfolio_settings`, `portfolio_testimonials`, `portfolio_brands`, `portfolio_milestones`) and sets up Row Level Security (RLS) policies.
2. **Storage Bucket**: Ensure a public Storage bucket named `portfolio-images` is created (automatically configured by `schema.sql`).
3. **Environment Credentials**: Verify `.env` contains your Supabase project credentials:
   ```env
   SUPABASE_URL=https://<your-project-ref>.supabase.co
   SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```
4. **Browser Configuration**: Update `supabase-config.js` with your project URL and publishable key for client-side queries.
