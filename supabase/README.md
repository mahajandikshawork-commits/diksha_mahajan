# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be provisioned

## 2. Run the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `schema.sql` from this directory
3. Paste and run the SQL to create the `orders` table

## 3. Get Your API Keys

1. Go to Project Settings > API
2. Copy the following values:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

## 4. Update Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 5. Database Schema

The `orders` table includes:
- Order and payment IDs
- Customer details (name, email, phone, address)
- Order items (stored as JSONB)
- Order total and status
- Timestamps for tracking

## 6. Security

- Row Level Security (RLS) is enabled
- Currently set to allow all operations (customize policies as needed)
- Service role key should never be exposed to the client
