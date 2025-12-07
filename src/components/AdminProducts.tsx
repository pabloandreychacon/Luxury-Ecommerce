import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { defaultSettings, getSettings } from '../data/settings';

interface Product {
  Id: string;
  Name: string;
  CategoryId: number;
  Price: number;
  ImageUrl: string;
  Description: string;
  StockQuantity: number;
  ProductId: number;
  BusinessEmail: string;
  Taxes: number;
  Active: boolean;
  IsService: boolean;
}

interface Category {
  Id: string;
  Name: string;
  DisplayName: string;
  CategoryId: number;
}

export default function AdminProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    categoryId: 0,
    description: '',
    imageUrl: '',
    stockQuantity: 0
  });
  const [uploading, setUploading] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [errors, setErrors] = useState({ name: '', price: '', category: '' });
  const [productImages, setProductImages] = useState<{ [productId: string]: string[] }>({});

  useEffect(() => {
    loadBusinessName();
  }, []);

  const loadBusinessName = async () => {
    const settings = await getSettings();
    setBusinessName(settings.businessName.replace(/\s+/g, ''));
  };

  const uploadImage = async (file: File, productId?: string | number) => {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // Remove spaces from business name for folder structure
    const cleanBusinessName = businessName.replace(/\s+/g, '');

    // If productId is provided, create folder structure: businessName/ProductId/fileName
    // Otherwise, use old structure: businessName/fileName
    const filePath = productId
      ? `${cleanBusinessName}/${String(productId).replace(/\s+/g, '')}/${fileName}`
      : `${cleanBusinessName}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('postore')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      alert('Error uploading image');
      setUploading(false);
      return null;
    }

    const { data } = supabase.storage.from('postore').getPublicUrl(filePath);
    setUploading(false);
    return data.publicUrl;
  };

  useEffect(() => {
    if (businessName) {
      loadProducts();
      loadCategories();
    }
  }, [businessName]);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('Products')
      .select('*')
      .eq('IdBusiness', defaultSettings.id);
    setProducts(data || []);

    // Load images for each product
    if (data && businessName) {
      const imagesMap: { [productId: string]: string[] } = {};
      for (const product of data) {
        const images = await loadProductImages(product.Id);
        imagesMap[product.Id] = images;
      }
      setProductImages(imagesMap);
    }
  };

  const loadProductImages = async (productId: string | number): Promise<string[]> => {
    try {
      const cleanBusinessName = businessName.replace(/\s+/g, '');
      const productIdStr = String(productId).replace(/\s+/g, '');
      const { data, error } = await supabase.storage
        .from('postore')
        .list(`${cleanBusinessName}/${productIdStr}`);

      if (error || !data) return [];

      const images = data
        .filter(file => !file.name.startsWith('.'))
        .map(file => {
          const { data: publicUrl } = supabase.storage.from('postore').getPublicUrl(
            `${cleanBusinessName}/${productIdStr}/${file.name}`
          );
          return publicUrl.publicUrl;
        });

      return images;
    } catch (error) {
      console.error('Error loading images:', error);
      return [];
    }
  };

  const deleteProductImage = async (productId: string | number, fileName: string) => {
    try {
      const cleanBusinessName = businessName.replace(/\s+/g, '');
      const productIdStr = String(productId).replace(/\s+/g, '');
      const filePath = `${cleanBusinessName}/${productIdStr}/${fileName}`;

      const { error } = await supabase.storage
        .from('postore')
        .remove([filePath]);

      if (error) {
        alert('Error deleting image');
        return;
      }

      // Reload product images
      const images = await loadProductImages(productId);
      setProductImages(prev => ({ ...prev, [productId]: images }));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('Categories')
      .select('*')
      .eq('IdBusiness', defaultSettings.id)
      .eq('Active', true);

    if (error) {
      console.error('Error loading categories:', error);
    }
    setCategories(data || []);
  };

  const handleAddProduct = async () => {
    const newErrors = { name: '', price: '', category: '' };

    if (!newProduct.name) {
      newErrors.name = 'Please enter a product name';
    }
    if (!newProduct.price || newProduct.price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    if (!newProduct.categoryId || newProduct.categoryId === 0) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);

    if (newErrors.name || newErrors.price || newErrors.category) {
      return;
    }

    const { error } = await supabase.from('Products').insert([{
      Name: newProduct.name,
      CategoryId: newProduct.categoryId,
      Price: newProduct.price,
      ImageUrl: newProduct.imageUrl || '',
      Description: newProduct.description || '',
      StockQuantity: newProduct.stockQuantity || 0,
      ProductId: 0,
      BusinessEmail: defaultSettings.email,
      Taxes: 0,
      Active: true,
      IsService: false,
      IdBusiness: defaultSettings.id
    }]);

    if (error) {
      alert(`Error adding product: ${error.message}`);
      return;
    }

    setNewProduct({ name: '', price: 0, categoryId: 0, description: '', imageUrl: '', stockQuantity: 0 });
    setErrors({ name: '', price: '', category: '' });
    await loadProducts();
    alert('Product added successfully!');
  };

  const handleUpdateProduct = async (id: string, field: string, value: any) => {
    await supabase.from('Products').update({ [field]: value }).eq('Id', id);
    loadProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    await supabase.from('Products').delete().eq('Id', id);
    loadProducts();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-luxury text-gray-900 dark:text-white">
          {t('admin.addProduct')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder={t('common.name')}
              value={newProduct.name}
              onChange={(e) => {
                setNewProduct({ ...newProduct, name: e.target.value });
                setErrors({ ...errors, name: '' });
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-luxury-gold ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('product.price')}
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={newProduct.price}
              onChange={(e) => {
                setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 });
                setErrors({ ...errors, price: '' });
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-luxury-gold ${errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('product.category')}
            </label>
            <select
              value={newProduct.categoryId}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setNewProduct({ ...newProduct, categoryId: value });
                setErrors({ ...errors, category: '' });
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-luxury-gold ${errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
            >
              <option value="0">-- {t('product.category')} --</option>
              {categories.map((cat) => (
                <option key={cat.Id} value={cat.Id}>{cat.DisplayName}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.stock')}
            </label>
            <input
              type="number"
              placeholder="0"
              value={newProduct.stockQuantity}
              onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.productImage')}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = await uploadImage(file);
                  if (url) setNewProduct({ ...newProduct, imageUrl: url });
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
            />
            {newProduct.imageUrl && (
              <img src={newProduct.imageUrl} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
            )}
          </div>
          <textarea
            placeholder={t('product.description')}
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
            rows={2}
          />
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          {t('admin.add')}
        </button>
      </div>

      {products.map((product) => (
        <div key={product.Id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('common.name')}
                  </label>
                  <input
                    type="text"
                    defaultValue={product.Name}
                    onBlur={(e) => handleUpdateProduct(product.Id, 'Name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('product.price')}
                  </label>
                  <input
                    type="number"
                    value={product.Price}
                    onChange={(e) => handleUpdateProduct(product.Id, 'Price', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('product.category')}
                  </label>
                  <select
                    value={product.CategoryId}
                    onChange={(e) => handleUpdateProduct(product.Id, 'CategoryId', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
                  >
                    {categories.map((cat) => (
                      <option key={cat.Id} value={cat.Id}>{cat.DisplayName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('admin.stock')}
                  </label>
                  <input
                    type="number"
                    value={product.StockQuantity}
                    onChange={(e) => handleUpdateProduct(product.Id, 'StockQuantity', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('admin.productImage')}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await uploadImage(file, product.Id);
                        if (url) handleUpdateProduct(product.Id, 'ImageUrl', url);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold text-sm"
                  />
                  {product.ImageUrl && (
                    <img src={product.ImageUrl} alt={product.Name} className="mt-2 h-20 w-20 object-cover rounded" />
                  )}
                </div>
              </div>

              {/* Product Gallery - Extra Images */}
              <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('admin.productGallery') || 'Product Gallery'}
                  </h3>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {t('admin.uploadAdditionalImages') || 'Upload Additional Images'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files) {
                        for (let i = 0; i < files.length; i++) {
                          const url = await uploadImage(files[i], product.Id);
                          if (url) {
                            // Reload product images after each upload
                            const images = await loadProductImages(product.Id);
                            setProductImages(prev => ({ ...prev, [product.Id]: images }));
                          }
                        }
                      }
                    }}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold text-sm disabled:opacity-50"
                  />
                </div>

                {/* Display uploaded images */}
                {productImages[product.Id] && productImages[product.Id].length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {t('admin.uploadedImages') || 'Uploaded Images'} ({productImages[product.Id].length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {productImages[product.Id].map((imageUrl, index) => {
                        const fileName = imageUrl.split('/').pop() || `image-${index}`;
                        return (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Product ${index}`}
                              className="h-24 w-24 object-cover rounded border border-gray-300 dark:border-gray-600"
                            />
                            <button
                              onClick={() => deleteProductImage(product.Id, fileName)}
                              className="absolute inset-0 bg-red-600 bg-opacity-0 hover:bg-opacity-70 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('product.description')}
                </label>
                <textarea
                  defaultValue={product.Description}
                  onBlur={(e) => handleUpdateProduct(product.Id, 'Description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-luxury-gold"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={product.Active}
                  onChange={(e) => handleUpdateProduct(product.Id, 'Active', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('admin.active')}
                </label>
              </div>
            </div>
            <button
              onClick={() => handleDeleteProduct(product.Id)}
              className="ml-4 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
