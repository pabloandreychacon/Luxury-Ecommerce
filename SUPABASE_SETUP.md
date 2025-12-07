# Supabase Setup Guide

## Database Schema

The authentication system uses a `profiles` table in Supabase to store user information.

### Profiles Table Structure

Create the following table in your Supabase project:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_profiles_email ON profiles(email);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-insert profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (new.id, new.email, '', '');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Environment Variables

The application is already configured with the Supabase credentials in `src/lib/supabase.ts`.

## Features Implemented

### Authentication
- **Sign Up**: Create new user accounts with email, password, first name, and last name
- **Sign In**: Login with email and password
- **Sign Out**: Logout functionality with session clearing
- **Session Management**: Automatic session persistence and validation

### Data Storage
- User profiles are automatically created in the `profiles` table on signup
- User data is fetched and stored in the Auth context
- All profile data is encrypted and secure with Supabase's RLS policies

### User Experience
- Loading states during authentication
- Error handling and display
- Automatic redirect after login/signup
- User name display in header when logged in
- Logout option in navigation menu

## Testing the Authentication

1. **Sign Up**:
   - Go to `/signup`
   - Enter full name, email, and password
   - Submit to create account
   - User profile is automatically created in Supabase

2. **Sign In**:
   - Go to `/login`
   - Enter email and password
   - Submit to login
   - User data is loaded from Supabase profiles table

3. **User Session**:
   - User's first name appears in the header
   - Logout button is available in the navigation
   - Session persists on page refresh

## Security Considerations

- Passwords are managed by Supabase Auth (industry-standard encryption)
- Row Level Security (RLS) ensures users can only access their own data
- All communication with Supabase is over HTTPS
- The public anon key is safe to expose (only allows auth operations)
