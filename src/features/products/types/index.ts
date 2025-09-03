/**
 * Product Types
 */

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  tags: string[];
  images: ProductImage[];
  stock: number;
  sku: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  specifications?: Record<string, string>;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'created' | 'updated' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  status?: 'active' | 'inactive' | 'out_of_stock';
  inStock?: boolean;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  hasMore?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  order: number;
  productCount: number;
}
