# 🚀 Quick Start Guide - LUXE

## ⚡ Get Running in 60 Seconds

### 1. Navigate to Project
```powershell
cd c:\Repos\react\luxury-ecommerce
```

### 2. Start Development Server
```powershell
npm run dev
```

Your app will open at: **http://localhost:5173**

---

## 🎯 What You Can Do Right Now

### 🏠 Homepage
- Beautiful hero section with call-to-action
- Category showcases (Bags, Scarfs, Watches)
- Features section highlighting store benefits

### 🛍️ Shopping
- Browse products with filtering
- Filter by price range
- Sort by price or rating
- Responsive product cards
- Hover effects and animations

### 🛒 Shopping Cart
- Add items to cart
- Adjust quantities
- View cart totals
- Shipping & tax calculation
- Persistent storage (survives page refresh)

### 👤 Authentication
- Sign up with email
- Login to account
- User profile in header
- Secure logout

### 🌍 Internationalization
- **Click flag icon** in header to switch languages
- **English** ↔ **Spanish**
- All content translated

### 🌙 Dark Mode
- **Click moon/sun icon** in header
- Smooth theme transition
- Preference saved

### 📧 Contact
- Fill contact form
- Send messages (placeholder)
- Get success feedback

---

## 📋 Available Pages

| Page | URL | Features |
|------|-----|----------|
| Home | `/` | Hero, categories, benefits |
| Shop | `/shop` | Products, filters, sorting |
| Cart | `/cart` | Cart items, totals, checkout |
| Login | `/login` | Email/password login |
| Sign Up | `/signup` | User registration |
| Contact | `/contact` | Contact form |
| About | `/about` | Company info |

---

## 🎨 Try These Features

1. **Language Switch**
   - Click language code in top right
   - Watch entire UI change to Spanish

2. **Dark Mode**
   - Click moon icon
   - Notice color transitions
   - Refresh page - theme persists

3. **Add to Cart**
   - Browse products on `/shop`
   - Select quantity
   - Click "Add to Cart"
   - See count update in header

4. **View Cart**
   - Click shopping bag icon
   - See persisted items
   - Adjust quantities
   - See price calculations

5. **Sign Up**
   - Go to `/signup`
   - Fill in details
   - Submit (uses mock auth for now)
   - See user name in header

---

## 📱 Responsive Testing

```
Mobile (< 768px):  Press F12, toggle device toolbar
Tablet (768px+):   Resize browser window
Desktop (1024px+): Full screen experience
```

---

## 🔧 Customization Tips

### Change Colors
Edit `tailwind.config.js`:
```javascript
luxury: {
  gold: '#ffd700',    // Change gold
  dark: '#1a1a1a',    // Change dark
}
```

### Add New Product
Edit `src/pages/Shop.tsx` → `MOCK_PRODUCTS` array

### Change Translations
Edit `src/lib/i18n.ts` → add text to `resources`

### New Route/Page
1. Create page in `src/pages/NewPage.tsx`
2. Import in `src/App.tsx`
3. Add route: `<Route path="/new" element={<NewPage />} />`

---

## 🐛 Troubleshooting

### Page not loading?
```powershell
npm run dev  # Restart dev server
```

### Styles not showing?
- Hard refresh: `Ctrl + Shift + R`
- Check browser console for errors

### Cart not persisting?
- Check if localStorage is enabled
- Try `localStorage.clear()` in console

### Language not changing?
- Refresh page
- Check i18n.ts has translations

---

## 📦 Build for Production

```powershell
npm run build
# Creates 'dist' folder with optimized build
# Ready to deploy to Vercel, Netlify, etc.
```

---

## 🎓 Project Architecture

```
User Interface (Components + Pages)
        ↓
    App.tsx (Routes)
        ↓
Context Providers (Auth, Cart, Theme)
        ↓
Supabase Backend & LocalStorage
```

---

## 💡 Key Files to Know

- **src/App.tsx** - App structure & routes
- **src/components/Header.tsx** - Navigation
- **src/pages/Shop.tsx** - Main shopping page
- **src/context/CartContext.tsx** - Cart logic
- **tailwind.config.js** - Colors & styling
- **src/lib/i18n.ts** - Translations

---

## 🚀 Next Steps

1. ✅ Run `npm run dev`
2. ✅ Explore the app
3. ✅ Test all features
4. ✅ Check different languages
5. ✅ Try dark mode
6. ⬜ Connect to Supabase
7. ⬜ Add real products
8. ⬜ Implement payments
9. ⬜ Deploy to Vercel

---

## 📚 Full Documentation

- **README.md** - Feature list
- **SETUP.md** - Detailed setup
- **PROJECT_SUMMARY.md** - Complete overview

---

## ⚠️ Important Notes

- Mock products are placeholder data
- Contact form uses placeholder email
- Database features ready but need Supabase setup
- Payment processing not yet configured

---

## 🎉 You're All Set!

Your modern luxury ecommerce platform is ready to explore.

**Run this now:**
```powershell
cd c:\Repos\react\luxury-ecommerce
npm run dev
```

**Enjoy! 🌟**
