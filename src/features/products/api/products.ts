import type {
  Product,
  ProductListParams,
  ProductListResponse,
  ProductCategory,
  ProductReview,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Build query string from params
 */
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Fetch list of products
 */
export async function fetchProducts(
  params: ProductListParams = {}
): Promise<ProductListResponse> {
  const queryString = buildQueryString(params);
  const response = await fetch(`${API_BASE_URL}/products${queryString}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}

/**
 * Fetch single product by ID
 */
export async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    throw new Error('Failed to fetch product');
  }
  
  return response.json();
}

/**
 * Fetch product categories
 */
export async function fetchCategories(): Promise<ProductCategory[]> {
  const response = await fetch(`${API_BASE_URL}/products/categories`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  
  return response.json();
}

/**
 * Fetch category by slug
 */
export async function fetchCategory(slug: string): Promise<ProductCategory> {
  const response = await fetch(`${API_BASE_URL}/products/categories/${slug}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Category not found');
    }
    throw new Error('Failed to fetch category');
  }
  
  return response.json();
}

/**
 * Fetch product reviews
 */
export async function fetchProductReviews(
  productId: string,
  params: {
    page?: number;
    limit?: number;
    sortBy?: 'rating' | 'helpful' | 'created';
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  reviews: ProductReview[];
  total: number;
  page: number;
  limit: number;
}> {
  const queryString = buildQueryString(params);
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/reviews${queryString}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch product reviews');
  }
  
  return response.json();
}

/**
 * Fetch related products
 */
export async function fetchRelatedProducts(
  productId: string,
  limit: number = 4
): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/related?limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch related products');
  }
  
  return response.json();
}

/**
 * Search products by query
 */
export async function searchProducts(
  query: string,
  params: Omit<ProductListParams, 'search'> = {}
): Promise<ProductListResponse> {
  return fetchProducts({ ...params, search: query });
}

/**
 * Fetch featured products
 */
export async function fetchFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/featured?limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch featured products');
  }
  
  return response.json();
}

/**
 * Fetch best selling products
 */
export async function fetchBestSellingProducts(limit: number = 8): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/best-selling?limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch best selling products');
  }
  
  return response.json();
}

/**
 * Fetch new arrival products
 */
export async function fetchNewArrivals(limit: number = 8): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/new-arrivals?limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch new arrivals');
  }
  
  return response.json();
}
