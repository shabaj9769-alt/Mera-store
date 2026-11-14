import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Product,
  CategoryItem,
  BannerSlide,
  StoreSettings,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BANNERS,
  DEFAULT_STORE_SETTINGS,
} from '../data/products';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  mrp: number;
  quantity: number;
  imageUrl?: string;
  illustrationType: Product['illustrationType'];
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
}

export type OrderStatus = 'Placed' | 'Confirmed' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  createdAt: string;
  createdTimestamp: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  pincode: string;
  paymentMethod: 'Cash on Delivery';
  orderType: 'Daily' | 'Advance';
  items: OrderItem[];
  subtotal: number;
  totalMrp: number;
  totalDiscount: number;
  deliveryFee: number;
  finalAmount: number;
  status: OrderStatus;
}

export interface CheckoutInput {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  pincode: string;
  orderType?: 'Daily' | 'Advance';
}

interface StoreContextType {
  // Store data (synced with localStorage)
  products: Product[];
  categories: CategoryItem[];
  banners: BannerSlide[];
  settings: StoreSettings;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];

  // Admin auth
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  allowedAdminEmail: string;
  adminLogin: (email: string, password: string) => { ok: boolean; error?: string };
  adminLogout: () => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Customer actions
  addToCart: (productId: string, qty?: number) => void;
  updateCartQty: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isInCart: (productId: string) => boolean;
  cartCount: number;
  placeOrder: (input: CheckoutInput) => Order | null;
  getProductById: (id: string) => Product | undefined;

  // Admin CRUD actions
  saveProduct: (product: Omit<Product, 'id' | 'createdAt' | 'discount'> & { id?: string }) => void;
  deleteProduct: (id: string) => void;
  toggleProductBestSeller: (id: string) => void;
  toggleProductActive: (id: string) => void;
  saveCategory: (cat: CategoryItem, originalSlug?: string) => void;
  deleteCategory: (slug: string) => void;
  saveBanners: (banners: BannerSlide[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateSettings: (newSettings: StoreSettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'singlestore_products_v2',
  CATEGORIES: 'singlestore_categories_v2',
  BANNERS: 'singlestore_banners_v2',
  SETTINGS: 'singlestore_settings_v2',
  CART: 'singlestore_cart_v2',
  WISHLIST: 'singlestore_wishlist_v2',
  ORDERS: 'singlestore_orders_v2',
  ADMIN_AUTH: 'singlestore_admin_auth_v2',
};

const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-1042',
    createdAt: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    createdTimestamp: Date.now() - 3600 * 1000,
    customerName: 'Rahul Verma',
    customerPhone: '9876543210',
    customerAddress: 'Flat 302, Green Residency, Sector 18, Noida',
    pincode: '201301',
    paymentMethod: 'Cash on Delivery',
    orderType: 'Daily',
    items: [
      {
        productId: 'elec-1',
        name: 'SonicPods Air Pro ANC True Wireless Earbuds (Matte Slate)',
        price: 899,
        mrp: 2499,
        quantity: 1,
        illustrationType: 'earbuds',
        gradientFrom: '#ede9fe',
        gradientTo: '#ddd6fe',
        accentColor: '#6d28d9',
      },
    ],
    subtotal: 899,
    totalMrp: 2499,
    totalDiscount: 1600,
    deliveryFee: 0,
    finalAmount: 899,
    status: 'Confirmed',
  },
];

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const allowedAdminEmail = (
    import.meta.env.VITE_ADMIN_EMAIL || 'admin@merastore.com'
  )
    .trim()
    .toLowerCase();

  const [products, setProducts] = useState<Product[]>(() =>
    safeRead<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS)
  );
  const [categories, setCategories] = useState<CategoryItem[]>(() =>
    safeRead<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
  );
  const [banners, setBanners] = useState<BannerSlide[]>(() =>
    safeRead<BannerSlide[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS)
  );
  const [settings, setSettings] = useState<StoreSettings>(() =>
    safeRead<StoreSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_STORE_SETTINGS)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    safeRead<CartItem[]>(STORAGE_KEYS.CART, [{ productId: 'elec-1', quantity: 1 }])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    safeRead<string[]>(STORAGE_KEYS.WISHLIST, ['mob-1', 'fash-2'])
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    safeRead<Order[]>(STORAGE_KEYS.ORDERS, SEED_ORDERS)
  );
  const [adminEmail, setAdminEmail] = useState<string | null>(() =>
    safeRead<string | null>(STORAGE_KEYS.ADMIN_AUTH, null)
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
    } catch {
      // ignore
    }
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      document.title = `${settings.storeName} - ${settings.productTypeTagline}`;
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (adminEmail) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(adminEmail));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      }
    } catch {
      // ignore
    }
  }, [adminEmail]);

  // Single toast at a time, auto-hides after 2000ms
  const showToast = (msg: string) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2000);
  };

  const getProductById = (id: string) => products.find((p) => p.id === id);

  const addToCart = (productId: string, qty = 1) => {
    const product = getProductById(productId);
    if (!product) return;
    if (product.stock <= 0) {
      showToast('This item is currently Out of Stock');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(product.stock, item.quantity + qty) }
            : item
        );
      }
      return [...prev, { productId, quantity: Math.min(product.stock, qty) }];
    });
    showToast(`Added "${product.name}" to Cart`);
  };

  const updateCartQty = (productId: string, delta: number) => {
    const product = getProductById(productId);
    const maxStock = product ? Math.max(1, product.stock) : 10;
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, Math.min(maxStock, item.quantity + delta)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Removed from Cart');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const isInCart = (productId: string) => cart.some((item) => item.productId === productId);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = (input: CheckoutInput): Order | null => {
    if (cart.length === 0) return null;

    const orderItems: OrderItem[] = [];
    let totalMrp = 0;
    let subtotal = 0;

    for (const c of cart) {
      const prod = getProductById(c.productId);
      if (!prod) continue;
      orderItems.push({
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        mrp: prod.mrp,
        quantity: c.quantity,
        imageUrl: prod.images?.[0],
        illustrationType: prod.illustrationType,
        gradientFrom: prod.gradientFrom,
        gradientTo: prod.gradientTo,
        accentColor: prod.accentColor,
      });
      totalMrp += prod.mrp * c.quantity;
      subtotal += prod.price * c.quantity;
    }

    const deliveryFee = subtotal >= settings.freeDeliveryAmount ? 0 : settings.deliveryFee;
    const finalAmount = subtotal + deliveryFee;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      createdTimestamp: Date.now(),
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      customerAddress: input.customerAddress.trim(),
      pincode: input.pincode.trim(),
      paymentMethod: 'Cash on Delivery',
      orderType: input.orderType || 'Daily',
      items: orderItems,
      subtotal,
      totalMrp,
      totalDiscount: Math.max(0, totalMrp - subtotal),
      deliveryFee,
      finalAmount,
      status: 'Placed',
    };

    // Decrement product stock
    setProducts((prev) =>
      prev.map((p) => {
        const bought = cart.find((c) => c.productId === p.id);
        if (!bought) return p;
        return { ...p, stock: Math.max(0, p.stock - bought.quantity) };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    showToast(`Order ${newOrder.id} placed!`);
    return newOrder;
  };

  // Admin Login (Strictly checks VITE_ADMIN_EMAIL)
  const adminLogin = (email: string, password: string) => {
    const cleanedEmail = email.trim().toLowerCase();
    if (cleanedEmail !== allowedAdminEmail) {
      return {
        ok: false,
        error: `Access denied. Only the store owner email (${allowedAdminEmail}) is allowed.`,
      };
    }
    if (password.trim().length < 4) {
      return {
        ok: false,
        error: 'Please enter a valid password (at least 4 characters).',
      };
    }
    setAdminEmail(cleanedEmail);
    showToast('Welcome back, Store Owner!');
    return { ok: true };
  };

  const adminLogout = () => {
    setAdminEmail(null);
    showToast('Logged out of Admin Panel');
  };

  // Admin CRUD: Products
  const saveProduct = (
    prodInput: Omit<Product, 'id' | 'createdAt' | 'discount'> & { id?: string }
  ) => {
    const discount =
      prodInput.mrp > prodInput.price
        ? Math.round(((prodInput.mrp - prodInput.price) / prodInput.mrp) * 100)
        : 0;

    if (prodInput.id) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === prodInput.id
            ? {
                ...p,
                ...prodInput,
                id: prodInput.id,
                discount,
              }
            : p
        )
      );
      showToast('Product updated');
    } else {
      const newProduct: Product = {
        ...prodInput,
        id: `prod-${Date.now()}`,
        discount,
        createdAt: Date.now(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast('New product added to store');
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted');
  };

  const toggleProductBestSeller = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBestSeller: !p.isBestSeller } : p))
    );
  };

  const toggleProductActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Admin CRUD: Categories
  const saveCategory = (cat: CategoryItem, originalSlug?: string) => {
    setCategories((prev) => {
      const targetSlug = originalSlug || cat.slug;
      const exists = prev.some((c) => c.slug === targetSlug);
      if (exists) {
        return prev.map((c) => (c.slug === targetSlug ? cat : c));
      }
      return [...prev, cat];
    });
    showToast('Category saved');
  };

  const deleteCategory = (slug: string) => {
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
    showToast('Category removed');
  };

  // Admin CRUD: Banners
  const saveBanners = (newBanners: BannerSlide[]) => {
    setBanners(newBanners.slice(0, 3));
    showToast('Banners updated');
  };

  // Admin CRUD: Orders
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order ${orderId} marked as ${status}`);
  };

  // Admin CRUD: Settings
  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    showToast('Store settings saved');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        banners,
        settings,
        cart,
        wishlist,
        orders,
        isAdminLoggedIn: Boolean(adminEmail && adminEmail === allowedAdminEmail),
        adminEmail,
        allowedAdminEmail,
        adminLogin,
        adminLogout,
        toastMessage,
        showToast,
        addToCart,
        updateCartQty,
        removeFromCart,
        toggleWishlist,
        isInWishlist,
        isInCart,
        cartCount,
        placeOrder,
        getProductById,
        saveProduct,
        deleteProduct,
        toggleProductBestSeller,
        toggleProductActive,
        saveCategory,
        deleteCategory,
        saveBanners,
        updateOrderStatus,
        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
};
