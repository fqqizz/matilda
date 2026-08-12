"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, Category, CartItem, Order, OrderItem, SiteSettings, ProductReview, ShippingAddress } from "../types";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from "../data/seed-products";
import { supabase, isSupabaseConfigured } from "../supabase/client";

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  settings: SiteSettings;
  isDatabaseConnected: boolean;
  
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
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string) => Promise<void>;
  
  // Admin & Product Actions
  addProduct: (product: Omit<Product, "id" | "reviews" | "rating" | "reviewCount" | "createdAt">) => Promise<Product>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addReview: (productId: string, review: Omit<ProductReview, "id" | "date" | "verifiedPurchase">) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: "matilda_store_products_v2",
  CATEGORIES: "matilda_store_categories_v2",
  CART: "matilda_store_cart_v2",
  WISHLIST: "matilda_store_wishlist_v2",
  ORDERS: "matilda_store_orders_v2",
  SETTINGS: "matilda_store_settings_v2",
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

  // ── 1. HYDRATION FROM SUPABASE OR LOCAL STORAGE ───────
  useEffect(() => {
    setIsMounted(true);

    async function loadStoreData() {
      // 1. If Supabase is connected, fetch live data from database
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: dbProducts, error: prodErr } = await supabase
            .from("products")
            .select(`
              id, slug, name, subtitle, category, price, original_price,
              description, long_description, materials, stock, stock_quantity,
              is_featured, is_new_arrival, is_best_seller, is_published,
              sku, rating, review_count, created_at,
              product_images (
                image_url, sort_order, is_primary
              )
            `)
            .order("created_at", { ascending: false });

          if (!prodErr && dbProducts && dbProducts.length > 0) {
            const mappedProducts: Product[] = dbProducts.map((p: any) => {
              const sortedImages = (p.product_images || [])
                .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
                .map((img: any) => img.image_url);

              return {
                id: p.id,
                slug: p.slug,
                name: p.name,
                subtitle: p.subtitle || "",
                category: p.category || "Necklaces & Pendants",
                price: Number(p.price),
                originalPrice: p.original_price ? Number(p.original_price) : undefined,
                description: p.description || "",
                longDescription: p.long_description || p.description,
                materials: p.materials || "Polished fashion alloy with protective coating",
                details: [
                  "Crafted with signature MATILDA finish",
                  "Comfort-tested for daily wear",
                  "Dispatches within 24 hours across India",
                ],
                images: sortedImages.length > 0 ? sortedImages : ["/images/golden-waist-chain.png"],
                stock: p.stock ?? p.stock_quantity ?? 10,
                isFeatured: Boolean(p.is_featured),
                isNewArrival: Boolean(p.is_new_arrival),
                isBestSeller: Boolean(p.is_best_seller),
                isPublished: Boolean(p.is_published),
                sku: p.sku || `MTL-${p.id.slice(0, 4)}`,
                reviews: [],
                rating: Number(p.rating) || 5.0,
                reviewCount: Number(p.review_count) || 0,
                createdAt: p.created_at || new Date().toISOString(),
              };
            });
            setProducts(mappedProducts);
          }

          // Fetch categories from DB
          const { data: dbCategories, error: catErr } = await supabase
            .from("categories")
            .select("*")
            .order("sort_order", { ascending: true });

          if (!catErr && dbCategories && dbCategories.length > 0) {
            setCategories(
              dbCategories.map((c: any) => ({
                id: c.id,
                slug: c.slug,
                name: c.name,
                description: c.description || "",
                image: c.image_url || "/images/silver-waist-chain.png",
              }))
            );
          }

          // Fetch site settings from DB
          const { data: dbSettings } = await supabase.from("site_settings").select("*").limit(1).single();
          if (dbSettings) {
            setSettings({
              brandName: dbSettings.brand_name || "MATILDA",
              founderName: dbSettings.founder_name || "Duha Ajaz Pandith",
              tagline: dbSettings.tagline || INITIAL_SETTINGS.tagline,
              bio: dbSettings.bio || INITIAL_SETTINGS.bio,
              instagramHandle: dbSettings.instagram_handle || "@matilldaaa._",
              instagramUrl: dbSettings.instagram_url || INITIAL_SETTINGS.instagramUrl,
              phone: dbSettings.phone || "+91 95411 98330",
              whatsappNumber: dbSettings.whatsapp_number || "919541198330",
              deliveryNotice: dbSettings.delivery_notice || INITIAL_SETTINGS.deliveryNotice,
              announcementText: dbSettings.announcement_text || INITIAL_SETTINGS.announcementText,
              freeShippingThreshold: dbSettings.free_shipping_threshold || 499,
              standardShippingFee: dbSettings.standard_shipping_fee || 49,
              razorpayKeyId: dbSettings.razorpay_key_id || "",
              isTestMode: dbSettings.is_test_mode ?? true,
            });
          }
        } catch (err) {
          console.warn("Supabase fetch fallback to local storage:", err);
        }
      }

      // 2. LocalStorage fallback & client cache
      try {
        const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (savedProducts && (!isSupabaseConfigured || !supabase)) {
          setProducts(JSON.parse(savedProducts));
        }

        const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

        const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
        if (savedOrders) setOrders(JSON.parse(savedOrders));

        const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (savedSettings && (!isSupabaseConfigured || !supabase)) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (e) {
        console.error("Local storage error", e);
      }
    }

    loadStoreData();
  }, []);

  // Sync to local cache
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [products, cart, wishlist, orders, settings, isMounted]);

  // ── CART CALCULATIONS ────────────────────────────────
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const shippingFee = cartSubtotal >= settings.freeShippingThreshold || cartSubtotal === 0 ? 0 : settings.standardShippingFee;
  const cartTotal = cartSubtotal + shippingFee;

  const addToCart = (product: Product, quantity = 1, selectedVariant?: Record<string, string>, unitPrice?: number) => {
    const finalPrice = unitPrice ?? product.price;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          JSON.stringify(item.selectedVariant || {}) === JSON.stringify(selectedVariant || {})
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          product,
          quantity,
          selectedVariant,
          unitPrice: finalPrice,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number, selectedVariant?: Record<string, string>) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.productId === productId &&
          JSON.stringify(item.selectedVariant || {}) === JSON.stringify(selectedVariant || {})
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, selectedVariant?: Record<string, string>) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            JSON.stringify(item.selectedVariant || {}) === JSON.stringify(selectedVariant || {})
          )
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // ── WISHLIST ─────────────────────────────────────────
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // ── ORDERS WITH HISTORICAL SNAPSHOTS ─────────────────
  const createOrder = async (data: {
    customer: { fullName: string; email: string; phone: string };
    shippingAddress: ShippingAddress;
    paymentMethod: 'Razorpay (Cards / UPI / NetBanking)' | 'Cash on Delivery (COD)';
    paymentTransactionId?: string;
  }): Promise<Order> => {
    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      productImage: item.product.images[0] || "/images/golden-waist-chain.png",
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
      selectedVariant: item.selectedVariant,
    }));

    const orderId = `MTL-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      createdAt: now,
      customer: data.customer,
      shippingAddress: data.shippingAddress,
      items: orderItems,
      subtotal: cartSubtotal,
      shippingFee,
      discount: 0,
      total: cartTotal,
      status: "Pending",
      paymentStatus:
        data.paymentMethod === "Cash on Delivery (COD)"
          ? "Pending"
          : settings.isTestMode
          ? "Paid (Test Mode)"
          : "Paid",
      paymentMethod: data.paymentMethod,
      paymentTransactionId: data.paymentTransactionId,
      estimatedDelivery: "3–6 Business Days (Express Pan-India)",
    };

    // Save to Supabase if connected
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: insertedOrder, error: orderErr } = await supabase.from("orders").insert({
          order_number: orderId,
          customer_name: data.customer.fullName,
          email: data.customer.email,
          phone: data.customer.phone,
          shipping_address: data.shippingAddress,
          subtotal: cartSubtotal,
          shipping_amount: shippingFee,
          shipping_fee: shippingFee,
          total_amount: cartTotal,
          total: cartTotal,
          payment_status: newOrder.paymentStatus.toLowerCase(),
          order_status: "pending",
          status: "pending",
          payment_method: data.paymentMethod,
          payment_reference: data.paymentTransactionId,
        }).select().single();

        if (!orderErr && insertedOrder && orderItems.length > 0) {
          const dbOrderItems = orderItems.map((item) => ({
            order_id: insertedOrder.id,
            product_id: item.productId,
            product_name: item.productName,
            product_image_url: item.productImage,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            line_total: item.totalPrice,
            selected_variant: item.selectedVariant,
          }));

          await supabase.from("order_items").insert(dbOrderItems);
        }
      } catch (err) {
        console.warn("Supabase order creation warning:", err);
      }
    }

    // Decrement stock in store
    cart.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.productId
            ? { ...p, stock: Math.max(0, p.stock - item.quantity) }
            : p
        )
      );
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              trackingNumber: trackingNumber ?? order.trackingNumber,
            }
          : order
      )
    );

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("orders")
          .update({
            status: status.toLowerCase(),
            order_status: status.toLowerCase(),
            tracking_number: trackingNumber,
          })
          .eq("order_number", orderId);
      } catch (err) {
        console.warn("Supabase order update warning:", err);
      }
    }
  };

  // ── ADMIN PRODUCT CRUD ───────────────────────────────
  const addProduct = async (
    productData: Omit<Product, "id" | "reviews" | "rating" | "reviewCount" | "createdAt">
  ): Promise<Product> => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      reviews: [],
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };

    // If Supabase is connected, insert into database
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbProduct, error: prodErr } = await supabase
          .from("products")
          .insert({
            name: productData.name,
            slug: productData.slug,
            sku: productData.sku,
            subtitle: productData.subtitle,
            category: productData.category,
            price: productData.price,
            original_price: productData.originalPrice,
            description: productData.description,
            long_description: productData.longDescription,
            materials: productData.materials,
            stock: productData.stock,
            stock_quantity: productData.stock,
            is_featured: productData.isFeatured,
            is_new_arrival: productData.isNewArrival,
            is_best_seller: productData.isBestSeller,
            is_published: productData.isPublished,
            status: productData.isPublished ? "published" : "draft",
          })
          .select()
          .single();

        if (!prodErr && dbProduct) {
          newProduct.id = dbProduct.id;

          // Insert images into product_images table
          if (productData.images && productData.images.length > 0) {
            const dbImages = productData.images.map((url, i) => ({
              product_id: dbProduct.id,
              image_url: url,
              storage_path: url.includes("/product-images/") ? url.split("/product-images/")[1] : undefined,
              sort_order: i,
              is_primary: i === 0,
            }));
            await supabase.from("product_images").insert(dbImages);
          }
        }
      } catch (err) {
        console.warn("Supabase add product warning:", err);
      }
    }

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = async (updatedProduct: Product): Promise<void> => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("products")
          .update({
            name: updatedProduct.name,
            slug: updatedProduct.slug,
            sku: updatedProduct.sku,
            subtitle: updatedProduct.subtitle,
            category: updatedProduct.category,
            price: updatedProduct.price,
            original_price: updatedProduct.originalPrice,
            description: updatedProduct.description,
            long_description: updatedProduct.longDescription,
            materials: updatedProduct.materials,
            stock: updatedProduct.stock,
            stock_quantity: updatedProduct.stock,
            is_featured: updatedProduct.isFeatured,
            is_new_arrival: updatedProduct.isNewArrival,
            is_best_seller: updatedProduct.isBestSeller,
            is_published: updatedProduct.isPublished,
            status: updatedProduct.isPublished ? "published" : "draft",
          })
          .eq("id", updatedProduct.id);

        // Update product images
        await supabase.from("product_images").delete().eq("product_id", updatedProduct.id);

        if (updatedProduct.images && updatedProduct.images.length > 0) {
          const dbImages = updatedProduct.images.map((url, i) => ({
            product_id: updatedProduct.id,
            image_url: url,
            storage_path: url.includes("/product-images/") ? url.split("/product-images/")[1] : undefined,
            sort_order: i,
            is_primary: i === 0,
          }));
          await supabase.from("product_images").insert(dbImages);
        }
      } catch (err) {
        console.warn("Supabase update product warning:", err);
      }
    }
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").delete().eq("id", productId);
      } catch (err) {
        console.warn("Supabase delete product warning:", err);
      }
    }
  };

  const addReview = (productId: string, reviewData: Omit<ProductReview, "id" | "date" | "verifiedPurchase">) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      verifiedPurchase: true,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newReviews = [newReview, ...p.reviews];
        const avg = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return {
          ...p,
          reviews: newReviews,
          rating: Number(avg.toFixed(1)),
          reviewCount: newReviews.length,
        };
      })
    );
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<void> => {
    setSettings((prev) => ({ ...prev, ...newSettings }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("site_settings").update({
          brand_name: newSettings.brandName,
          founder_name: newSettings.founderName,
          tagline: newSettings.tagline,
          bio: newSettings.bio,
          instagram_handle: newSettings.instagramHandle,
          instagram_url: newSettings.instagramUrl,
          phone: newSettings.phone,
          whatsapp_number: newSettings.whatsappNumber,
          delivery_notice: newSettings.deliveryNotice,
          announcement_text: newSettings.announcementText,
          free_shipping_threshold: newSettings.freeShippingThreshold,
          standard_shipping_fee: newSettings.standardShippingFee,
          razorpay_key_id: newSettings.razorpayKeyId,
          is_test_mode: newSettings.isTestMode,
        }).limit(1);
      } catch (err) {
        console.warn("Supabase update settings warning:", err);
      }
    }
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
        isDatabaseConnected: isSupabaseConfigured,
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
