# Costa Rica Luxury - Modern Luxury Ecommerce Platform

A premium ecommerce application for luxury fashion items (bags, scarfs, and watches) built with modern web technologies.

## Features

### 🎨 Design & UX
- Modern, elegant luxury-focused design
- Dark mode support with theme persistence
- Responsive design for all devices
- Smooth animations and transitions
- Professional typography with Playfair Display & Lato fonts

### 🌍 Internationalization
- Full Spanish & English support
- Language switcher in header
- Comprehensive translation system using i18next
- Browser language detection

### 🛍️ E-Commerce Features
- Product catalog with filtering and sorting
- Shopping cart with persistent storage (localStorage)
- Category filtering (Bags, Scarfs, Watches)
- Price range filtering
- Product ratings and reviews
- Stock management

### 🔐 Authentication
- User signup & login with Supabase
- Password hashing with bcryptjs
- Session management
- Protected user areas
- User profile information

### 💳 Backend & Data
- Supabase PostgreSQL database integration
- Real-time data syncing capabilities
- Secure authentication with Supabase Auth
- Email service integration (EmailJS)

### 📧 Communication
- Contact form with EmailJS
- Email notifications

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom luxury theme
- **Routing**: React Router v7
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + bcryptjs
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Internationalization**: i18next + react-i18next
- **Email Service**: EmailJS

## Project Structure

```
luxury-ecommerce/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── Footer.tsx      # Footer component
│   │   └── ProductCard.tsx # Product display card
│   ├── context/           # React context providers
│   │   ├── AuthContext.tsx # Authentication state
│   │   ├── CartContext.tsx # Shopping cart state
│   │   └── ThemeContext.tsx # Dark mode state
│   ├── lib/              # Utilities and configuration
│   │   ├── supabase.ts    # Supabase client
│   │   ├── i18n.ts        # i18next configuration
│   │   └── types.ts       # TypeScript types
│   ├── pages/            # Page components
│   │   ├── Home.tsx       # Homepage
│   │   ├── Shop.tsx       # Product listing
│   │   ├── Cart.tsx       # Shopping cart
│   │   ├── Login.tsx      # Login page
│   │   ├── Signup.tsx     # Registration page
│   │   ├── Contact.tsx    # Contact form
│   │   └── About.tsx      # About page
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Tailwind + global styles
├── index.html            # HTML template
└── package.json          # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd luxury-ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create a `.env.local` file):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

The Supabase credentials are already configured for the lawyer shop project. You can copy them from there.

### Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Building

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Linting

Run ESLint:
```bash
npm run lint
```

## Customization

### Color Scheme
Modify the luxury color palette in `tailwind.config.js`:
```javascript
colors: {
  luxury: {
    dark: '#0f0f0f',
    gold: '#d4af37',
    silver: '#c0c0c0',
    cream: '#f5f1e8',
    charcoal: '#2a2a2a',
  },
}
```

### Languages
Add more languages in `src/lib/i18n.ts` by extending the `resources` object with new language codes and translations.

### Products
Mock products are defined in `src/pages/Shop.tsx`. Connect to your database or CMS by replacing the mock data with API calls to Supabase.

## Database Setup

The application expects the following Supabase tables:

### `users` table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  firstName TEXT,
  lastName TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### `products` table
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL,
  image TEXT,
  description TEXT,
  material TEXT,
  dimensions TEXT,
  inStock BOOLEAN DEFAULT TRUE,
  rating DECIMAL,
  reviews INTEGER DEFAULT 0
);
```

### `orders` table
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  userId UUID REFERENCES users(id),
  total DECIMAL,
  status TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

## Email Configuration

To enable email functionality:

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Get your public key
3. Add it to your `.env.local`:
```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```
4. Update the email service configuration in `src/pages/Contact.tsx`

## Features to Implement

- [ ] Product detail pages
- [ ] User checkout flow
- [ ] Payment integration (Stripe/PayPal)
- [ ] Order tracking
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Email notifications
- [ ] Analytics

## Deployment

The app can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS Amplify

Example Vercel deployment:
```bash
npm install -g vercel
vercel
```

## License

MIT License

## Support

For support, contact us at info@costaricaluxury.com
