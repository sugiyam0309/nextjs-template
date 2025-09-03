'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layouts/main-layout';
import { SearchBar, SearchFilters as SearchFiltersComponent, SearchResults } from '@/features/search/components';
import { Button } from '@/components/ui/button/button';
import { useSearch } from '@/features/search/hooks/useSearch';
import { FilterIcon, XIcon } from 'lucide-react';
import type { SearchFilters } from '@/features/search/types';
import { Loading } from '@/components/ui/loading/loading';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortByParam = searchParams.get('sortBy') || 'relevance';
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [filters, setFilters] = useState<SearchFilters>({
    category,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    sortBy: sortByParam as SearchFilters['sortBy'],
  });

  // 検索実行
  const {
    searchResults,
    isLoading,
    error,
    handleSearch: performSearch,
    handleFilterChange,
    refetch,
  } = useSearch(searchQuery);

  // URLパラメータの更新
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.sortBy && filters.sortBy !== 'relevance') params.set('sortBy', filters.sortBy);
    
    const newUrl = params.toString() ? `/search?${params.toString()}` : '/search';
    window.history.replaceState(null, '', newUrl);
  }, [searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const handleApplyFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    handleFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: SearchFilters = {
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'relevance',
    };
    setFilters(resetFilters);
    refetch();
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.sortBy !== 'relevance';

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* ヘッダー */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {/* 検索バー */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <SearchBar 
                    onSearch={handleSearch}
                    placeholder="商品を検索..."
                    className="w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <FilterIcon className="h-4 w-4" />
                  フィルター
                  {hasActiveFilters && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                      {Object.values(filters).filter(v => v).length}
                    </span>
                  )}
                </Button>
              </div>

              {/* 検索情報 */}
              <div className="flex justify-between items-center">
                <div>
                  {searchQuery && (
                    <p className="text-sm text-gray-600">
                      「<span className="font-semibold">{searchQuery}</span>」の検索結果
                      {searchResults && (
                        <span className="ml-2">
                          ({searchResults.total}件)
                        </span>
                      )}
                    </p>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <XIcon className="h-3 w-3" />
                    フィルターをクリア
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* サイドバーフィルター（デスクトップ） */}
            <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-32">
                <h2 className="text-lg font-semibold mb-4">絞り込み</h2>
                <SearchFiltersComponent
                  filters={filters}
                  onFiltersChange={handleApplyFilters}
                />
              </div>
            </div>

            {/* 検索結果 */}
            <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              {!searchQuery ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <svg
                      className="mx-auto h-24 w-24 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      検索を開始してください
                    </h3>
                    <p className="text-gray-500">
                      上の検索バーにキーワードを入力して、商品を検索してください。
                    </p>
                  </div>
                </div>
              ) : (
                <SearchResults
                  results={searchResults?.results || []}
                  loading={isLoading}
                  error={error}
                />
              )}
            </div>
          </div>
        </div>

        {/* モバイル用フィルターモーダル */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">フィルター</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                <SearchFiltersComponent
                  filters={filters}
                  onFiltersChange={(newFilters: SearchFilters) => {
                    handleApplyFilters(newFilters);
                    setShowFilters(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchPageContent />
    </Suspense>
  );
}
