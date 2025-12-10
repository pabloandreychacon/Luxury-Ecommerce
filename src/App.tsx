import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AddToCartModal from './components/AddToCartModal';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import About from './pages/About';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

function AppContent() {
  const { showModal, lastAddedProduct, closeModal } = useCart();
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = searchParams.get('lang');
    if (lang && (lang === 'en' || lang === 'es')) {
      i18n.changeLanguage(lang);
    }
  }, [searchParams, i18n]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
      <AddToCartModal 
        isOpen={showModal} 
        onClose={closeModal} 
        productName={lastAddedProduct}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <AppContent />
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
