'use client';

import React from 'react';
import { ProductCard } from '../product-card/product-card';
import { Loading } from '@/components/ui/loading/loading';
import { Button } from '@/components/ui/button/button';
import { cn } from '@/lib/utils/cn';
import type { Product } from '../../types';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: Error | null;
  variant?: 'grid' | 'list';
  cardVariant?: 'default' | 'compact' | 'detailed';
  columns?: 2 | 3 | 4 | 5 | 6;
  showActions?: boolean;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  loading = false,
  error = null,
  variant = 'grid',
  cardVariant = 'default',
  columns = 4,
  showActions = true,
  onAddToCart,
  onAddToWishlist,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  emptyMessage = '商品が見つかりませんでした',
  className,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold">エラーが発生しました</p>
        <p className="text-sm text-gray-500 mt-2">{error.message}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const gridClassName = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  if (variant === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        {products.map((product) => (
          <div key={product.id} className="border-b pb-4 last:border-b-0">
            <div className="flex gap-4">
              <div className="w-32 h-32 relative flex-shrink-0">
                {product.images[0] && (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl font-bold">
                    ¥{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ¥{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.rating !== undefined && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">
                      {product.rating.toFixed(1)} ({product.reviewCount || 0}件)
                    </span>
                  </div>
                )}
                {showActions && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => onAddToCart?.(product)}
                      disabled={product.status === 'out_of_stock'}
                      size="sm"
                    >
                      カートに追加
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onAddToWishlist?.(product)}
                      size="sm"
                    >
                      お気に入り
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {hasMore && onLoadMore && (
          <div className="text-center pt-4">
            <Button
              onClick={onLoadMore}
              loading={loadingMore}
              variant="outline"
            >
              もっと見る
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={cn('grid gap-4', gridClassName[columns])}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant={cardVariant}
            showActions={showActions}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
          />
        ))}
      </div>
      {hasMore && onLoadMore && (
        <div className="text-center mt-8">
          <Button
            onClick={onLoadMore}
            loading={loadingMore}
            variant="outline"
            size="lg"
          >
            もっと見る
          </Button>
        </div>
      )}
    </div>
  );
};
