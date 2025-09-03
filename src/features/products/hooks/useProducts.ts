'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProducts,
  fetchProduct,
  fetchCategories,
  fetchCategory,
  fetchProductReviews,
  fetchRelatedProducts,
  fetchFeaturedProducts,
  fetchBestSellingProducts,
  fetchNewArrivals,
} from '../api/products';
import type { ProductListParams } from '../types';

/**
 * Fetch products list
 */
export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
  });
}

/**
 * Fetch single product
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}

/**
 * Fetch product categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Fetch category by slug
 */
export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => fetchCategory(slug),
    enabled: !!slug,
  });
}

/**
 * Fetch product reviews
 */
export function useProductReviews(
  productId: string,
  params: {
    page?: number;
    limit?: number;
    sortBy?: 'rating' | 'helpful' | 'created';
    sortOrder?: 'asc' | 'desc';
  } = {}
) {
  return useQuery({
    queryKey: ['product-reviews', productId, params],
    queryFn: () => fetchProductReviews(productId, params),
    enabled: !!productId,
  });
}

/**
 * Fetch related products
 */
export function useRelatedProducts(productId: string, limit: number = 4) {
  return useQuery({
    queryKey: ['related-products', productId, limit],
    queryFn: () => fetchRelatedProducts(productId, limit),
    enabled: !!productId,
  });
}

/**
 * Fetch featured products
 */
export function useFeaturedProducts(limit: number = 8) {
  return useQuery({
    queryKey: ['featured-products', limit],
    queryFn: () => fetchFeaturedProducts(limit),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Fetch best selling products
 */
export function useBestSellingProducts(limit: number = 8) {
  return useQuery({
    queryKey: ['best-selling-products', limit],
    queryFn: () => fetchBestSellingProducts(limit),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Fetch new arrival products
 */
export function useNewArrivals(limit: number = 8) {
  return useQuery({
    queryKey: ['new-arrivals', limit],
    queryFn: () => fetchNewArrivals(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Custom hook for product search with pagination
 */
export function useProductSearch(
  query: string,
  params: Omit<ProductListParams, 'search'> = {}
) {
  return useQuery({
    queryKey: ['product-search', query, params],
    queryFn: () => fetchProducts({ ...params, search: query }),
    enabled: !!query,
  });
}

/**
 * Custom hook for infinite scroll products
 */
export function useInfiniteProducts(params: ProductListParams = {}) {
  const queryClient = useQueryClient();
  
  const fetchPage = async (page: number) => {
    return fetchProducts({ ...params, page });
  };
  
  return {
    fetchNextPage: async (page: number) => {
      const data = await fetchPage(page);
      queryClient.setQueryData(['infinite-products', params, page], data);
      return data;
    },
    getPageData: (page: number) => {
      return queryClient.getQueryData(['infinite-products', params, page]);
    },
  };
}

/**
 * Prefetch product data
 */
export function usePrefetchProduct(id: string) {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: ['product', id],
      queryFn: () => fetchProduct(id),
    });
  };
}

/**
 * Invalidate product queries
 */
export function useInvalidateProducts() {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    invalidateProduct: (id: string) => 
      queryClient.invalidateQueries({ queryKey: ['product', id] }),
    invalidateCategories: () => 
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
  };
}
