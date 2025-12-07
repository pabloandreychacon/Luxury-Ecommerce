import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../lib/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Leather Tote',
    category: 'bag',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop',
    description: 'Timeless Italian leather tote with gold hardware',
    material: 'Premium Italian Leather',
    inStock: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: '2',
    name: 'Silk Luxury Scarf',
    category: 'scarf',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&h=600&fit=crop',
    description: 'Hand-painted silk scarf from French artisans',
    material: '100% Pure Silk',
    inStock: true,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: '3',
    name: 'Chronograph Watch',
    category: 'watch',
    price: 2499.99,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=600&fit=crop',
    description: 'Swiss precision with sapphire crystal',
    material: 'Stainless Steel',
    dimensions: '42mm diameter',
    inStock: true,
    rating: 4.9,
    reviews: 156,
  },
  {
    id: '4',
    name: 'Crossbody Bag',
    category: 'bag',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1576995853950-4282b45e68e8?w=500&h=600&fit=crop',
    description: 'Elegant crossbody with adjustable strap',
    material: 'Vegan Leather',
    inStock: true,
    rating: 4.7,
    reviews: 67,
  },
  {
    id: '5',
    name: 'Cashmere Wrap',
    category: 'scarf',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=600&fit=crop',
    description: 'Luxurious cashmere wrap from Kashmir',
    material: '100% Cashmere',
    inStock: false,
    rating: 4.8,
    reviews: 45,
  },
  {
    id: '6',
    name: 'Dress Watch',
    category: 'watch',
    price: 1899.99,
    image: 'https://images.unsplash.com/photo-1509048191080-d2984a20e132?w=500&h=600&fit=crop',
    description: 'Minimalist dress watch with automatic movement',
    material: 'Rose Gold',
    dimensions: '36mm diameter',
    inStock: true,
    rating: 4.8,
    reviews: 92,
  },
];

export default function Shop() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(5000);

  const category = searchParams.get('category');

  const filteredProducts = useMemo(() => {
    let filtered = MOCK_PRODUCTS;

    // Filter by category if specified
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filter by price
    filtered = filtered.filter(p => p.price <= maxPrice);

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [category, maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-8 pb-20">
      <div className="container-luxury">
        {/* Header */}
        <div className="mb-12">
          <h1 className="section-title">{t('shop.title')}</h1>
          <p className="text-center text-gray-600 dark:text-gray-400">
            {category && `Showing ${category.charAt(0).toUpperCase() + category.slice(1)}s`}
            {filteredProducts.length} products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="font-luxury text-lg mb-6">{t('shop.filters')}</h3>

              {/* Price Range */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-4">{t('shop.priceRange')}</label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Up to ${maxPrice.toLocaleString()}
                </p>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold mb-4">{t('shop.sortBy')}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">{t('common.noResults')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
