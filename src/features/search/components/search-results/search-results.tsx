'use client';

import React from 'react';
import { Card } from '@/components/ui/card/card';
import { Loading } from '@/components/ui/loading/loading';
import { cn } from '@/lib/utils/cn';
import type { SearchResult } from '../../types';

interface SearchResultsProps {
  results: SearchResult[];
  loading?: boolean;
  error?: Error | null;
  className?: string;
  onItemClick?: (item: SearchResult) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading = false,
  error = null,
  className,
  onItemClick,
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
        <p className="text-red-500">エラーが発生しました</p>
        <p className="text-sm text-gray-500 mt-2">{error.message}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">検索結果が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4', className)}>
      {results.map((result) => (
        <Card
          key={result.id}
          className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onItemClick?.(result)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {result.title}
              </h3>
              {result.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {result.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {result.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {result.category}
                  </span>
                )}
                {result.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end ml-4">
              {result.score !== undefined && (
                <div className="text-sm text-gray-500">
                  スコア: {result.score.toFixed(2)}
                </div>
              )}
              {result.price !== undefined && (
                <div className="text-lg font-semibold text-gray-900 mt-1">
                  ¥{result.price.toLocaleString()}
                </div>
              )}
              {result.date && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(result.date).toLocaleDateString('ja-JP')}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
