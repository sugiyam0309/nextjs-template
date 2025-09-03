'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card/card';
import { Button } from '@/components/ui/button/button';
import { cn } from '@/lib/utils/cn';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  showActions = true,
  onAddToCart,
  onAddToWishlist,
  className,
}) => {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const discountPercentage = product.discount 
    ? Math.round(product.discount * 100) 
    : product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart?.(product);
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToWishlist?.(product);
  };
  
  if (variant === 'compact') {
    return (
      <Link href={`/products/${product.id}`}>
        <Card className={cn('group hover:shadow-lg transition-shadow', className)}>
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            )}
            {discountPercentage > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                -{discountPercentage}%
              </span>
            )}
          </div>
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-semibold">
                ¥{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ¥{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }
  
  if (variant === 'detailed') {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <Link href={`/products/${product.id}`}>
          <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            )}
            {discountPercentage > 0 && (
              <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 text-sm rounded">
                {discountPercentage}% OFF
              </span>
            )}
            {product.status === 'out_of_stock' && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-semibold">在庫切れ</span>
              </div>
            )}
          </div>
        </Link>
        <div className="p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.brand && (
            <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
          )}
          {product.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xl font-bold text-gray-900">
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
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'text-sm',
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    )}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.rating.toFixed(1)})
              </span>
              {product.reviewCount !== undefined && (
                <span className="text-sm text-gray-500">
                  {product.reviewCount}件のレビュー
                </span>
              )}
            </div>
          )}
          {showActions && (
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.status === 'out_of_stock'}
                className="flex-1"
              >
                カートに追加
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                className="px-3"
                aria-label="お気に入りに追加"
              >
                ♡
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }
  
  // Default variant
  return (
    <Card className={cn('group overflow-hidden hover:shadow-lg transition-shadow', className)}>
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          )}
          {discountPercentage > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
              -{discountPercentage}%
            </span>
          )}
          {product.status === 'out_of_stock' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">在庫切れ</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <p className="text-sm text-gray-600 mt-1">{product.category}</p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold">
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
              {product.rating.toFixed(1)} ({product.reviewCount || 0})
            </span>
          </div>
        )}
        {showActions && (
          <div className="mt-3">
            <Button
              onClick={handleAddToCart}
              disabled={product.status === 'out_of_stock'}
              size="sm"
              className="w-full"
            >
              カートに追加
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
