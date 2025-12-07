# LUXE - Setup & Configuration Guide

## Overview

LUXE is a modern luxury ecommerce platform built with React, TypeScript, Tailwind CSS, and Supabase. This guide will help you get started with the application.

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- Vite (build tool)
- Tailwind CSS & PostCSS
- React Router v7
- Supabase JS Client
- i18next for multilingual support
- Lucide React for icons
- bcryptjs for password hashing
- EmailJS for email functionality

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (from react-lawyer-shop)
VITE_SUPABASE_URL=https://cfigfcufbornekzjxbqd.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaWdmY3VmYm9ybmVremp4YnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDU4NDcsImV4cCI6MjA2ODQ4MTg0N30.Y40XGZS1wvUVku4kEKi5CpntHA3k8Y9ohzMSG9bNMHI

# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
```

## Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Features Available

#### 🎨 Design
- Luxury-focused color scheme (gold, charcoal, cream)
- Responsive design for mobile, tablet, desktop
- Smooth animations and transitions
- Professional typography

#### 🌐 Internationalization
- English and Spanish language support
- Language switcher in header
- Persistent language preference
- Comprehensive translations for all UI text

#### 🌙 Dark Mode
- Toggle dark/light theme
- Persistent theme preference
- Optimized colors for both themes

#### 🛍️ Shopping Features
- Browse products by category (Bags, Scarfs, Watches)
- Filter by price range
- Sort by price and rating
- Shopping cart with quantity management
- Cart persistence using localStorage

#### 👤 Authentication
- User registration with email
- Login functionality
- Password hashing with bcryptjs
- Session management via Supabase Auth
- User profile display in header

#### 📧 Contact & Communication
- Contact form with validation
- EmailJS integration for sending emails
- Success/error message feedback

## Project Architecture

### Components (`src/components/`)

#### Header.tsx
- Navigation menu with links to main pages
- Language switcher (EN/ES)
- Dark mode toggle
- Shopping cart icon with item count
- User account menu
- Mobile-responsive hamburger menu

#### Footer.tsx
- Multi-column footer layout
- Company information and links
- Customer service section
- Contact information
- Social media links
- Copyright notice

#### ProductCard.tsx
- Product image with hover effect
- Product name, material, price
- Star rating and review count
- Quantity selector
- Add to cart button
- Wishlist heart button
- View details link

### Context Providers (`src/context/`)

#### AuthContext.tsx
- User authentication state
- Login, signup, logout functions
- Error handling
- Loading states
- User data persistence

#### CartContext.tsx
- Shopping cart state management
- Add/remove/update item quantities
- Cart total calculation
- Item count calculation
- localStorage persistence
- Clear cart function

#### ThemeContext.tsx
- Dark mode toggle
- Theme persistence in localStorage
- Automatic system preference detection
- DOM class management for dark mode

### Pages (`src/pages/`)

#### Home.tsx
- Hero section with background image
- Call-to-action button
- Category showcase (Bags, Scarfs, Watches)
- Features section
- Responsive layout

#### Shop.tsx
- Product grid with filtering
- Price range slider
- Sort options (price, rating)
- Pagination-ready structure
- Category filtering from URL params
- Mock product data (ready for database integration)

#### Cart.tsx
- Cart items list with images
- Quantity adjusters
- Remove item buttons
- Order summary with pricing
- Shipping and tax calculations
- Checkout button
- Continue shopping link

#### Login.tsx
- Email and password form
- Remember me option
- Error messages
- Loading states
- Link to signup page
- Forgot password link (placeholder)

#### Signup.tsx
- First name and last name fields
- Email and password fields
- Password confirmation
- Email validation
- Password strength requirements
- Error handling
- Link to login page

#### Contact.tsx
- Contact form with name, email, subject, message
- EmailJS integration
- Success/error notifications
- Form validation
- Responsive layout

#### About.tsx
- Company mission statement
- Quality and authenticity section
- Customer commitment
- Why choose LUXE section
- Rich text content with highlights

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  description TEXT,
  material TEXT,
  dimensions TEXT,
  inStock BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3, 1),
  reviews INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID REFERENCES users(id),
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Styling System

### Color Palette

```javascript
// Luxury Theme Colors
luxury: {
  dark: '#0f0f0f',      // Deep black
  gold: '#d4af37',      // Luxury gold
  silver: '#c0c0c0',    // Silver accent
  cream: '#f5f1e8',     // Cream background
  charcoal: '#2a2a2a',  // Dark gray
}
```

### Typography

- **Headings**: Playfair Display (serif) - elegant, luxury feel
- **Body**: Lato (sans-serif) - clean, modern readability

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Customization

### Adding New Languages

Edit `src/lib/i18n.ts`:

```typescript
const resources = {
  en: { translation: { /* ... */ } },
  es: { translation: { /* ... */ } },
  fr: { translation: { /* ... */ } }, // Add French
};
```

### Changing Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  luxury: {
    dark: '#1a1a1a',      // Customize colors
    gold: '#ffd700',      // Bright gold
    silver: '#e8e8e8',    // Light silver
    cream: '#fffef0',     // Warmer cream
    charcoal: '#333333',  // Lighter charcoal
  },
}
```

### Adding New Routes

Edit `src/App.tsx`:

```typescript
<Routes>
  <Route path="/new-page" element={<NewPage />} />
</Routes>
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### GitHub Pages

Configure `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/luxury-ecommerce/',
  // ...
});
```

## Troubleshooting

### Module Not Found Errors

These are normal until `npm install` completes. The TypeScript errors will resolve once all dependencies are installed.

### Styles Not Applying

- Clear browser cache
- Restart dev server (`npm run dev`)
- Check Tailwind CSS is properly configured in `tailwind.config.js`

### Supabase Connection Issues

- Verify environment variables in `.env.local`
- Check Supabase project is active
- Verify network connectivity

### Dark Mode Not Working

- Check localStorage for 'theme' key
- Verify `ThemeProvider` wraps entire app in `App.tsx`
- Clear browser localStorage: `localStorage.clear()`

## Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Configure environment variables (`.env.local`)
3. ⬜ Set up Supabase database tables
4. ⬜ Configure EmailJS for contact form
5. ⬜ Implement product API integration
6. ⬜ Add payment processing (Stripe/PayPal)
7. ⬜ Create admin dashboard
8. ⬜ Deploy to production

## Support & Documentation

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [i18next Documentation](https://www.i18next.com)

## License

MIT License - Feel free to use this project for personal and commercial purposes.
