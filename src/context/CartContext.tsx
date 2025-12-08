import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../lib/types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  showModal: boolean;
  lastAddedProduct: string;
  closeModal: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState('');
  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        // Fetch taxes for items that don't have it
        const fetchTaxes = async () => {
          const updatedItems = await Promise.all(cartItems.map(async (item: CartItem) => {
            if (item.taxes === undefined) {
              const { data } = await supabase
                .from('Products')
                .select('Taxes')
                .eq('Id', item.id)
                .single();
              return { ...item, taxes: data?.Taxes || 0 };
            }
            return item;
          }));
          setItems(updatedItems);
        };
        fetchTaxes();
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Load cart from Supabase when user logs in
  useEffect(() => {
    if (user?.id) {
      loadCartFromSupabase();
    }
  }, [user?.id]);

  const loadCartFromSupabase = async () => {
    if (!user?.id) return;

    try {
      const { data: cartItems } = await supabase
        .from('CartItems')
        .select('*, Products(*)')
        .eq('UserId', user.id);

      if (cartItems && cartItems.length > 0) {
        const mappedItems: CartItem[] = cartItems.map(item => ({
          id: String(item.ProductId),
          name: item.Products.Name,
          price: item.Products.Price,
          image: item.Products.ImageUrl,
          description: item.Products.Description,
          category: '',
          material: '',
          inStock: item.Products.StockQuantity > 0,
          rating: 4.5,
          reviews: 0,
          quantity: item.Quantity,
          taxes: item.Products.Taxes || 0,
          dimensions: ''
        }));
        setItems(mappedItems);
      }
    } catch (error) {
      console.error('Error loading cart from Supabase:', error);
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = async (product: Product, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    setLastAddedProduct(product.name);
    setShowModal(true);

    // Save to Supabase if user is logged in
    if (user?.id) {
      try {
        const { data: existingItem, error: fetchError } = await supabase
          .from('CartItems')
          .select('*')
          .eq('UserId', user.id)
          .eq('ProductId', parseInt(product.id))
          .maybeSingle();

        if (existingItem) {
          await supabase
            .from('CartItems')
            .update({ Quantity: existingItem.Quantity + quantity })
            .eq('Id', existingItem.Id);
        } else {
          await supabase
            .from('CartItems')
            .insert([{ UserId: user.id, ProductId: parseInt(product.id), Quantity: quantity }]);
        }
      } catch (error) {
        console.error('Error saving to cart:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const removeItem = async (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));

    // Remove from Supabase if user is logged in
    if (user?.id) {
      try {
        await supabase
          .from('CartItems')
          .delete()
          .eq('UserId', user.id)
          .eq('ProductId', parseInt(productId));
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );

      // Update in Supabase if user is logged in
      if (user?.id) {
        try {
          await supabase
            .from('CartItems')
            .update({ Quantity: quantity })
            .eq('UserId', user.id)
            .eq('ProductId', parseInt(productId));
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    localStorage.removeItem('cart');

    // Clear from Supabase if user is logged in
    if (user?.id) {
      try {
        await supabase
          .from('CartItems')
          .delete()
          .eq('UserId', user.id);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, showModal, lastAddedProduct, closeModal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
