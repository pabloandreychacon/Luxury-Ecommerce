# Visual Guide to Authentication Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  Login.tsx   │         │ Signup.tsx   │                  │
│  │    Form      │         │    Form      │                  │
│  └──────┬───────┘         └──────┬───────┘                  │
│         │                        │                           │
│         └────────────┬───────────┘                           │
│                      │                                       │
│         ┌────────────▼─────────────┐                        │
│         │  AuthContext.tsx         │                        │
│         │  - login()               │                        │
│         │  - signup()              │                        │
│         │  - logout()              │                        │
│         └────────────┬─────────────┘                        │
│                      │                                       │
│         ┌────────────▼─────────────┐                        │
│         │  supabase.ts             │                        │
│         │  Supabase Client         │                        │
│         └────────────┬─────────────┘                        │
└─────────────────────┼────────────────────────────────────────┘
                      │
        ┌─────────────▼──────────────┐
        │  Supabase Backend          │
        │                            │
        │  ┌──────────────────────┐  │
        │  │  auth.users          │  │
        │  │  - id                │  │
        │  │  - email             │  │
        │  │  - password (hash)   │  │
        │  └──────────────────────┘  │
        │                            │
        │  ┌──────────────────────┐  │
        │  │  profiles            │  │
        │  │  - id (FK)           │  │
        │  │  - email             │  │
        │  │  - first_name        │  │
        │  │  - last_name         │  │
        │  │  - created_at        │  │
        │  │  - updated_at        │  │
        │  └──────────────────────┘  │
        └────────────────────────────┘
```

## Sign Up Flow

```
User opens /signup
        │
        ▼
┌──────────────────────┐
│  Fills signup form   │
│  - First Name        │
│  - Last Name         │
│  - Email             │
│  - Password          │
│  - Confirm Password  │
└──────────┬───────────┘
           │
           ▼
     Validate form
  (password match, format)
           │
           ▼
  ┌─ Client Side ─┐
  │               │
  ▼               ▼
Supabase Auth    profiles table
  │               │
  │ Create        │ Insert
  │ User with     │ User data
  │ Email &       │ (first_name,
  │ Password      │  last_name,
  │               │  email)
  │ Returns ID    │
  └───────┬───────┘
          │
          ▼
   ┌─────────────────┐
   │  User logged in │
   │  Profile saved  │
   │  Redirect home  │
   │  Name in header │
   └─────────────────┘
```

## Sign In Flow

```
User opens /login
        │
        ▼
┌──────────────────┐
│  Fills login form│
│  - Email         │
│  - Password      │
└──────────┬───────┘
           │
           ▼
Supabase Auth
  │
  │ Verify email & password
  │ Check against auth.users
  │
  ▼
  Credentials valid?
  │         │
  YES       NO
  │         │
  ▼         ▼
Create   Show error
session
  │
  ▼
Query profiles table
Load user data
  │
  ▼
┌──────────────────────┐
│ Update React state   │
│ Set user in context  │
│ Update header        │
│ Redirect home        │
└──────────────────────┘
```

## Logout Flow

```
User clicks logout
        │
        ▼
  Logout function
        │
        ▼
Supabase Auth
  │
  │ Clear session
  │ Remove token
  │
  ▼
┌──────────────────┐
│ Clear user state │
│ Set user = null  │
│ Clear in context │
└──────────┬───────┘
           │
           ▼
┌──────────────────┐
│ Update header    │
│ Show login link  │
│ Redirect to home │
└──────────────────┘
```

## Component Relationships

```
App.tsx
  │
  ├─ AuthProvider
  │   └─ AuthContext (provides login, signup, logout, user)
  │
  ├─ Header
  │   ├─ useAuth() → {user, logout}
  │   └─ Display user name / logout button
  │
  ├─ Routes
  │   ├─ /signup → Signup.tsx
  │   │   └─ useAuth() → {signup, loading, error}
  │   │
  │   ├─ /login → Login.tsx
  │   │   └─ useAuth() → {login, loading, error}
  │   │
  │   └─ / → Home.tsx
  │       └─ useAuth() → {user}
  │
  └─ Footer
```

## Data Models

### User Type (in React Context)
```typescript
User {
  id: string              // UUID from Supabase auth
  email: string           // User's email
  firstName: string       // From profiles.first_name
  lastName: string        // From profiles.last_name
  createdAt: string       // ISO timestamp
}
```

### Profiles Table (in Supabase)
```sql
profiles {
  id: UUID              -- Primary key, references auth.users(id)
  email: TEXT           -- User's email address
  first_name: TEXT      -- First name
  last_name: TEXT       -- Last name
  created_at: TIMESTAMP -- Account creation
  updated_at: TIMESTAMP -- Last update
}
```

## Authentication State Machine

```
        ┌─────────────┐
        │  LOADING    │
        │ (check auth)│
        └──────┬──────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    ┌───────┐     ┌──────────┐
    │LOGGED │     │NOT LOGGED│
    │IN     │     │IN        │
    └───┬───┘     └────┬─────┘
        │              │
     logout()       login()/signup()
        │              │
        └──────┬───────┘
               │
               ▼
        (show error)
               │
        ┌──────┴─────────┐
        │                │
     Valid?          Invalid?
        │                │
        ▼                ▼
     Update state    Show error
     Redirect        Try again
```

## Request Flow Diagram

```
Browser              Supabase Client        Supabase Backend
   │                       │                       │
   │──signup form──────────>│                       │
   │                       │─signup request────────>│
   │                       │                       │
   │                       │                   Create auth.user
   │                       │                   (encrypt password)
   │                       │                       │
   │                       │<────user id────────────│
   │                       │                       │
   │                       │─insert profile────────>│
   │                       │                   (via trigger)
   │                       │                       │
   │<────profile data──────│<────profile────────────│
   │                       │                       │
   │  Update React state   │                       │
   │  Show user name       │                       │
```

## Session Lifecycle

```
┌─────────────────────────────────────────┐
│  Browser Session Management             │
│                                         │
│  1. User signs in                       │
│     └─ Session token stored in browser  │
│                                         │
│  2. User navigates to /shop             │
│     └─ Session token sent with request  │
│        └─ Supabase verifies token       │
│           └─ Access granted             │
│                                         │
│  3. User refreshes page                 │
│     └─ Check stored session on load     │
│        └─ Reload user profile           │
│           └─ Session persists           │
│                                         │
│  4. User clicks logout                  │
│     └─ Clear session token              │
│        └─ Delete stored session         │
│           └─ Redirect to login          │
│                                         │
│  5. Session expires (1 hour)            │
│     └─ Token becomes invalid            │
│        └─ User needs to login again     │
└─────────────────────────────────────────┘
```

## Error Handling Flow

```
User Action
    │
    ▼
Validate Input
    │
    ├─ Invalid ──> Show error message
    │              User retries
    │
    ▼
Send to Supabase
    │
    ├─ Network error ──────> Show error
    │                        Retry option
    │
    ├─ User not found ──────> Show error
    │                        Suggest signup
    │
    ├─ Invalid password ────> Show error
    │                        Try again
    │
    └─ Success ────────────> Update state
                            Redirect
```

## File Dependencies

```
App.tsx
  │
  ├─ AuthProvider (AuthContext.tsx)
  │   └─ supabase.ts
  │       └─ @supabase/supabase-js
  │
  ├─ Header.tsx
  │   └─ AuthContext (useAuth hook)
  │
  ├─ pages/Login.tsx
  │   └─ AuthContext (useAuth hook)
  │
  ├─ pages/Signup.tsx
  │   └─ AuthContext (useAuth hook)
  │
  └─ Router
      └─ All pages have access to AuthContext
```
