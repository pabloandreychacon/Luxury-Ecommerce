import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { defaultSettings } from '../data/settings';
import heroImage from '../assets/img/main-luxe-hero.jpg';
import ProductCard from '../components/ProductCard';
import { Product } from '../lib/types';

interface Category {
  Id: string;
  Name: string;
  DisplayName: string;
  Active: boolean;
}

export default function Home() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: categoriesData } = await supabase
      .from('Categories')
      .select('*')
      .eq('IdBusiness', defaultSettings.id)
      .eq('Active', true);
    setCategories(categoriesData || []);

    const { data: productsData } = await supabase
      .from('Products')
      .select('*')
      .eq('IdBusiness', defaultSettings.id)
      .eq('Active', true)
      .gt('StockQuantity', 0)
      .limit(6);
    
    if (productsData && categoriesData) {
      const mappedProducts: Product[] = productsData.map(p => {
        const cat = categoriesData.find(c => c.Id === p.CategoryId);
        return {
          id: String(p.Id),
          name: p.Name,
          category: cat?.Name?.toLowerCase() || '',
          price: p.Price,
          image: p.ImageUrl,
          description: p.Description,
          material: '',
          inStock: p.StockQuantity > 0,
          rating: 4.5,
          reviews: 0
        };
      });
      setProducts(mappedProducts);
    }
  };

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
            {categories.map((category) => (
              <Link
                key={category.Id}
                to={`/shop?category=${category.Name.toLowerCase()}`}
                className="group relative h-96 rounded-lg overflow-hidden cursor-pointer bg-luxury-charcoal dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-luxury-gold transition-all duration-300"
              >
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <h3 className="text-3xl font-luxury text-luxury-gold group-hover:scale-110 transition duration-300">
                    {category.DisplayName}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-luxury">
          <h2 className="section-title">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              View All Products <ArrowRight size={20} />
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
