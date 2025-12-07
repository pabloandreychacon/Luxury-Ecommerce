import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroImage from '../assets/img/main-luxe-hero.jpg';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen bg-luxury-dark text-white flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center animate-zoom"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />

        {/* Content */}
        <div className="container-luxury relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-luxury mb-6 text-luxury-gold">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            {t('hero.cta')} <ArrowRight size={20} />
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-luxury-gold text-sm">↓</div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-luxury">
          <h2 className="section-title">{t('shop.title')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bags */}
            <Link
              to="/shop?category=bag"
              className="group relative h-96 rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop"
                alt="Luxury Bags"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-start p-6">
                <h3 className="text-3xl font-luxury text-white">{t('nav.bags')}</h3>
              </div>
            </Link>

            {/* Scarfs */}
            <Link
              to="/shop?category=scarf"
              className="group relative h-96 rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&h=600&fit=crop"
                alt="Luxury Scarfs"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-start p-6">
                <h3 className="text-3xl font-luxury text-white">{t('nav.scarfs')}</h3>
              </div>
            </Link>

            {/* Watches */}
            <Link
              to="/shop?category=watch"
              className="group relative h-96 rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=600&fit=crop"
                alt="Luxury Watches"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-start p-6">
                <h3 className="text-3xl font-luxury text-white">{t('nav.watches')}</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-luxury">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-gray-600 dark:text-gray-400">Handpicked items just for you</p>
            </div>
            <Link to="/shop" className="text-luxury-gold hover:text-opacity-80 transition flex items-center gap-1">
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Premium Wireless Headphones */}
            <Link to="/product/1" className="group card-luxury rounded-lg overflow-hidden">
              <div className="relative h-56 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=450&fit=crop"
                  alt="Premium Wireless Headphones"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-luxury-gold uppercase tracking-wider">Electronics</span>
                <h3 className="font-luxury text-base mt-2 mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
                  Premium Wireless Headphones
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">High-quality wireless headphones with noise cancellation</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-luxury text-luxury-gold">$299.99</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm transition flex items-center gap-1">
                    Add
                  </button>
                </div>
              </div>
            </Link>

            {/* Smart Watch Pro */}
            <Link to="/product/6" className="group card-luxury rounded-lg overflow-hidden">
              <div className="relative h-56 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=450&fit=crop"
                  alt="Smart Watch Pro"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-luxury-gold uppercase tracking-wider">Watch</span>
                <h3 className="font-luxury text-base mt-2 mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
                  Smart Watch Pro
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Advanced fitness tracking and notifications</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-luxury text-luxury-gold">$399.99</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm transition flex items-center gap-1">
                    Add
                  </button>
                </div>
              </div>
            </Link>

            {/* Mechanical Keyboard */}
            <Link to="/product/3" className="group card-luxury rounded-lg overflow-hidden">
              <div className="relative h-56 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1587829191301-4c2ec8a9d4d2?w=400&h=450&fit=crop"
                  alt="Mechanical Keyboard"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-luxury-gold uppercase tracking-wider">Electronics</span>
                <h3 className="font-luxury text-base mt-2 mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
                  Mechanical Keyboard
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">RGB backlit mechanical keyboard</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-luxury text-luxury-gold">$129.99</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm transition flex items-center gap-1">
                    Add
                  </button>
                </div>
              </div>
            </Link>

            {/* Wireless Earbuds */}
            <Link to="/product/2" className="group card-luxury rounded-lg overflow-hidden">
              <div className="relative h-56 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1606841837239-c5a1a2a01220?w=400&h=450&fit=crop"
                  alt="Wireless Earbuds"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-luxury-gold uppercase tracking-wider">Electronics</span>
                <h3 className="font-luxury text-base mt-2 mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
                  Wireless Earbuds
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">True wireless earbuds with charging case</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-luxury text-luxury-gold">$179.99</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm transition flex items-center gap-1">
                    Add
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-luxury text-xl mb-2">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Handpicked luxury items from the finest designers worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-luxury text-xl mb-2">Fast Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Discreet packaging and worldwide delivery in 2-5 business days.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="font-luxury text-xl mb-2">Secure Checkout</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Protected transactions with encrypted payment processing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
