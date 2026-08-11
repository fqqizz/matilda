export interface ProductReview {
  id: string;
  author: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  location?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  category: string; // 'Necklaces & Pendants' | 'Bracelets' | 'Bangles' | 'Waist Chains' | 'Nose Rings' | 'MATILDA MEN'
  price: number;
  originalPrice?: number;
  description: string;
  longDescription?: string;
  details: string[];
  materials: string; // editable inferred specification
  images: string[];
  variants?: {
    name: string;
    options: {
      label: string;
      priceModifier?: number;
      inStock: boolean;
    }[];
  }[];
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isPublished: boolean;
  sku: string;
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount?: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: Record<string, string>;
  unitPrice: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedVariant?: Record<string, string>;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
}

export interface Order {
  id: string; // e.g. "MTL-84920"
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid (Test Mode)' | 'Paid' | 'Pending' | 'Failed';
  paymentMethod: 'Razorpay (Cards / UPI / NetBanking)' | 'Cash on Delivery (COD)';
  paymentTransactionId?: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  notes?: string;
}

export interface SiteSettings {
  brandName: string;
  founderName: string;
  tagline: string;
  bio: string;
  instagramHandle: string;
  instagramUrl: string;
  phone: string;
  whatsappNumber: string;
  deliveryNotice: string;
  announcementText: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  razorpayKeyId: string;
  isTestMode: boolean;
}
