# Supabase Authentication Quick Start

## 🚀 Quick Setup (5 minutes)

### 1. Create Profiles Table in Supabase

Go to your Supabase dashboard:
1. Click **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase_setup.sql`
4. Click **Run**

### 2. Test the Application

```bash
npm run dev
```

Visit the app and test:
- Go to `/signup` and create an account
- Check Supabase **Table Editor** → **profiles** to see your data
- Go to `/login` and sign in
- Your name should appear in the header
- Click logout to sign out

## 📋 What Was Done

Your authentication system includes:

✅ **Sign Up**
- Create account with email, password, first name, last name
- Automatic profile creation in Supabase
- Password confirmation validation
- Error handling

✅ **Sign In**
- Login with email and password
- Session persistence across page refreshes
- User data loaded from database
- Loading states

✅ **Sign Out**
- Logout functionality
- Session cleared
- User state reset

✅ **Security**
- Passwords encrypted by Supabase Auth
- Row Level Security (RLS) on profiles
- Session validation on app load
- Automatic auth state monitoring

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Supabase client initialization |
| `src/context/AuthContext.tsx` | Authentication logic and state |
| `src/pages/Login.tsx` | Login form and UI |
| `src/pages/Signup.tsx` | Signup form and UI |
| `src/components/Header.tsx` | User display and logout |
| `supabase_setup.sql` | Database schema |

## 🧪 Test Credentials

After creating an account, use those credentials to test login.

Example:
- Email: test@example.com
- Password: yourpassword123

## 📊 Database Schema

```
profiles table:
├── id (UUID) - Primary key, references auth.users
├── email (TEXT) - User email
├── first_name (TEXT) - First name
├── last_name (TEXT) - Last name
├── created_at (TIMESTAMP) - Account creation date
└── updated_at (TIMESTAMP) - Last update date
```

## 🔗 Available Routes

- `/login` - Sign in page
- `/signup` - Create account page
- `/` - Home page (redirects to login if not authenticated)
- `/shop` - Shop page
- `/cart` - Shopping cart
- etc.

## 💡 Tips

1. Check browser console for detailed error messages
2. Check Supabase logs for backend errors
3. Verify email/password format before signup
4. Use unique emails for each account
5. Session persists for 1 hour by default in Supabase

## ❓ Troubleshooting

**"User already exists"**
- Try with a different email address

**"Invalid credentials"**
- Verify email and password are correct
- Check if user account exists

**Profile not appearing in database**
- Ensure the SQL setup script ran successfully
- Check Supabase RLS policies

**Session not persisting**
- Clear browser cache/cookies
- Check browser console for errors
- Verify Supabase connection is working

## 📚 More Information

- See `AUTH_IMPLEMENTATION.md` for detailed implementation notes
- See `SUPABASE_SETUP.md` for database schema details
- Supabase Docs: https://supabase.com/docs
