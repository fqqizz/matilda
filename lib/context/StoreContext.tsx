"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, Category, CartItem, Order, OrderItem, SiteSettings, ProductReview, ShippingAddress } from "../types";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from "../data/seed-products";

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  settings: SiteSettings;
  
  // UI States
  isPreloaderComplete: boolean;
  setIsPreloaderComplete: (complete: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number, selectedVariant?: Record<string, string>, unitPrice?: number) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedVariant?: Record<string, string>) => void;
  removeFromCart: (productId: string, selectedVariant?: Record<string, string>) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  cartTotal: number;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Order Actions
  createOrder: (data: {
    customer: { fullName: string; email: string; phone: string };
    shippingAddress: ShippingAddress;
    paymentMethod: 'Razorpay (Cards / UPI / NetBanking)' | 'Cash on Delivery (COD)';
    paymentTransactionId?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string) => void;
  
  // Admin & Product Actions
  addProduct: (product: Omit<Product, "id" | "reviews" | "rating" | "reviewCount" | "createdAt">) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addReview: (productId: string, review: Omit<ProductReview, "id" | "date" | "verifiedPurchase">) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: "matilda_store_products_v1",
  CATEGORIES: "matilda_store_categories_v1",
  CART: "matilda_store_cart_v1",
  WISHLIST: "matilda_store_wishlist_v1",
  ORDERS: "matilda_store_orders_v1",
  SETTINGS: "matilda_store_settings_v1",
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Hydrate from localStorage safely on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      }

      const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }

      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.error("Failed to load store data from localStorage", e);
    }
  }, []);

  // Sync back to localStorage whenever state changes
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings, isMounted]);

  // Cart operations
  const getVariantKey = (v?: Record<string, string>) => (v ? JSON.stringify(v) : "");

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedVariant?: Record<string, string>,
    unitPrice?: number
  ) => {
    const finalPrice = unitPrice !== undefined ? unitPrice : product.price;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.productId === product.id &&
          getVariantKey(item.selectedVariant) === getVariantKey(selectedVariant)
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            productId: product.id,
            product,
            quantity,
            selectedVariant,
            unitPrice: finalPrice,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
    selectedVariant?: Record<string, string>
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.productId === productId &&
          getVariantKey(item.selectedVariant) === getVariantKey(selectedVariant)
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (
    productId: string,
    selectedVariant?: Record<string, string>
  ) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.productId === productId &&
            getVariantKey(item.selectedVariant) === getVariantKey(selectedVariant)
          )
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );
  const shippingFee =
    cartSubtotal >= settings.freeShippingThreshold || cartSubtotal === 0
      ? 0
      : settings.standardShippingFee;
  const cartTotal = cartSubtotal + shippingFee;

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = ({
    customer,
    shippingAddress,
    paymentMethod,
    paymentTransactionId,
  }: {
    customer: { fullName: string; email: string; phone: string };
    shippingAddress: ShippingAddress;
    paymentMethod: 'Razorpay (Cards / UPI / NetBanking)' | 'Cash on Delivery (COD)';
    paymentTransactionId?: string;
  }): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `MTL-${randomNum}`;

    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      productImage: item.product.images[0] || "/images/golden-waist-chain.png",
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
      selectedVariant: item.selectedVariant,
    }));

    // Estimate delivery date (4 days from now)
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 4);
    const estimatedDelivery = estDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer,
      shippingAddress,
      items: orderItems,
      subtotal: cartSubtotal,
      shippingFee,
      discount: 0,
      total: cartTotal,
      status: "Processing",
      paymentStatus: paymentMethod.includes("Razorpay") ? "Paid (Test Mode)" : "Pending",
      paymentMethod,
      paymentTransactionId: paymentTransactionId || `pay_test_${Date.now()}`,
      trackingNumber: `EXP${randomNum}IN`,
      estimatedDelivery,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: Order["status"],
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
            trackingNumber: trackingNumber || order.trackingNumber,
          };
        }
        return order;
      })
    );
  };

  // Product CRUD
  const addProduct = (
    newProductData: Omit<Product, "id" | "reviews" | "rating" | "reviewCount" | "createdAt">
  ): Product => {
    const newId = `mtl-${Date.now().toString().slice(-4)}`;
    const newProduct: Product = {
      ...newProductData,
      id: newId,
      reviews: [],
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Customer Star Reviews
  const addReview = (
    productId: string,
    reviewData: Omit<ProductReview, "id" | "date" | "verifiedPurchase">
  ) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: "Just now",
      verifiedPurchase: true,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const avgRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
            updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            rating: Number(avgRating.toFixed(1)),
            reviewCount: updatedReviews.length,
          };
        }
        return p;
      })
    );
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        orders,
        settings,
        isPreloaderComplete,
        setIsPreloaderComplete,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
        toggleWishlist,
        isInWishlist,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
