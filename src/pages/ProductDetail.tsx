import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ShoppingBag, Heart, ArrowLeft, Share2, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../lib/types';
import { MOCK_PRODUCTS } from './Shop';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Find the product
  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-luxury mb-4">{t('common.notFound')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Product not found</p>
        <Link to="/shop" className="text-luxury-gold hover:text-opacity-80 transition">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  // Generate multiple images for gallery (using same image for now)
  const images = [product.image, product.image, product.image, product.image];

  // Related products - find similar items
  const relatedProducts = MOCK_PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-luxury py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-luxury-gold hover:text-opacity-80 transition mb-4"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <nav className="text-sm text-gray-600 dark:text-gray-400">
            <Link to="/" className="hover:text-luxury-gold transition">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-luxury-gold transition">Shop</Link>
            <span className="mx-2">/</span>
            <span className="capitalize">{product.category}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-gray-100 font-semibold">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-luxury py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 aspect-square">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition ${activeImageIndex === idx
                      ? 'border-luxury-gold'
                      : 'border-gray-300 dark:border-gray-700 hover:border-luxury-gold'
                    }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-luxury-gold uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">⭐ {product.rating}</span>
                  <span className="text-gray-600 dark:text-gray-400"> ({product.reviews} reviews)</span>
                </div>
                <button
                  onClick={handleFavorite}
                  className={`p-2 rounded-full transition ${isFavorited
                      ? 'bg-luxury-gold text-luxury-dark'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-luxury-gold hover:text-luxury-dark'
                    }`}
                >
                  <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="font-luxury text-4xl mb-2 text-gray-900 dark:text-gray-100">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Price</p>
              <p className="text-4xl font-luxury text-luxury-gold">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-8">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg w-fit ${product.inStock
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                {product.inStock ? (
                  <>
                    <Check size={18} />
                    <span className="font-semibold">In Stock</span>
                  </>
                ) : (
                  <span className="font-semibold">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Material</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{product.material}</p>
              </div>
              {product.dimensions && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dimensions</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{product.dimensions}</p>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                    className="w-20 px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded text-center"
                    disabled={!product.inStock}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    (max 10 per order)
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-4 px-6 rounded-lg flex items-center justify-center gap-3 font-semibold text-lg transition ${product.inStock
                    ? 'bg-luxury-gold text-luxury-dark hover:bg-opacity-90'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
              >
                {showAdded ? (
                  <>
                    <Check size={24} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={24} />
                    Add to Cart
                  </>
                )}
              </button>

              <button className="w-full py-4 px-6 rounded-lg border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark transition font-semibold flex items-center justify-center gap-2">
                <Share2 size={20} />
                Share Product
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-4 text-sm">
              <div className="flex items-start gap-4">
                <div className="text-luxury-gold">✓</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Free Shipping</p>
                  <p className="text-gray-600 dark:text-gray-400">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-luxury-gold">✓</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Easy Returns</p>
                  <p className="text-gray-600 dark:text-gray-400">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-luxury-gold">✓</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Authentic</p>
                  <p className="text-gray-600 dark:text-gray-400">100% original products</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-700">
            <h2 className="section-title mb-12">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map(relProduct => (
                <Link
                  key={relProduct.id}
                  to={`/product/${relProduct.id}`}
                  className="group card-luxury rounded-lg overflow-hidden cursor-pointer"
                >
                  <div className="relative h-64 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <img
                      src={relProduct.image}
                      alt={relProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-luxury text-lg text-gray-900 dark:text-gray-100 mb-2">
                      {relProduct.name}
                    </h3>
                    <p className="text-2xl font-luxury text-luxury-gold">
                      ${relProduct.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
