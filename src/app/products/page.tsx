'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layouts/main-layout';
import { ProductList } from '@/features/products/components';
import { Select } from '@/components/ui/select/select';
import { Input } from '@/components/ui/input/input';
import { Button } from '@/components/ui/button/button';
import { useProducts, useCategories } from '@/features/products/hooks/useProducts';
import { SearchIcon, FilterIcon, GridIcon, ListIcon } from 'lucide-react';

const sortOptions = [
  { value: 'relevance', label: '関連性' },
  { value: 'price-asc', label: '価格: 低→高' },
  { value: 'price-desc', label: '価格: 高→低' },
  { value: 'rating', label: '評価順' },
  { value: 'newest', label: '新着順' },
];

const pageSizeOptions = [
  { value: '12', label: '12件' },
  { value: '24', label: '24件' },
  { value: '48', label: '48件' },
  { value: '96', label: '96件' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // フィルター状態
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [sortBy, setSortBy] = useState<'relevance' | 'name' | 'price' | 'rating' | 'created' | 'updated'>(
    (searchParams.get('sortBy') as any) || 'relevance'
  );
  const [pageSize, setPageSize] = useState(searchParams.get('pageSize') || '24');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // データ取得
  const { data: categories } = useCategories();
  const { 
    data: productsData, 
    isLoading, 
    error,
    refetch 
  } = useProducts({
    category,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    inStock: inStock || undefined,
    sortBy,
    limit: parseInt(pageSize),
    search: searchQuery,
  });

  // URLパラメータの更新
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (inStock) params.set('inStock', 'true');
    if (sortBy && sortBy !== 'relevance') params.set('sortBy', sortBy);
    if (pageSize !== '24') params.set('pageSize', pageSize);
    if (searchQuery) params.set('q', searchQuery);
    
    const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
    window.history.replaceState(null, '', newUrl);
  }, [category, minPrice, maxPrice, inStock, sortBy, pageSize, searchQuery]);

  const handleSearch = () => {
    refetch();
  };

  const handleReset = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setSortBy('relevance');
    setSearchQuery('');
    refetch();
  };

  const categoryOptions = categories?.map(cat => ({
    value: cat.id,
    label: cat.name,
  })) || [];

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* ヘッダー */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">商品一覧</h1>
            
            {/* 検索バー */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="商品を検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>検索</Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <FilterIcon className="h-4 w-4" />
                フィルター
              </Button>
            </div>

            {/* フィルターパネル */}
            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      カテゴリー
                    </label>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      options={[{ value: '', label: 'すべて' }, ...categoryOptions]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      最低価格
                    </label>
                    <Input
                      type="number"
                      placeholder="¥0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      最高価格
                    </label>
                    <Input
                      type="number"
                      placeholder="¥999,999"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex gap-2 w-full">
                      <Button onClick={handleSearch} className="flex-1">
                        適用
                      </Button>
                      <Button onClick={handleReset} variant="outline" className="flex-1">
                        リセット
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">在庫ありのみ表示</span>
                  </label>
                </div>
              </div>
            )}

            {/* ソート・表示オプション */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {productsData?.products.length || 0}件の商品
              </div>
              <div className="flex gap-2 items-center">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  options={sortOptions}
                  className="w-40"
                />
                <Select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  options={pageSizeOptions}
                  className="w-24"
                />
                <div className="flex border rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                  >
                    <GridIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                  >
                    <ListIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 商品リスト */}
        <div className="container mx-auto px-4 py-8">
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600">エラーが発生しました。</p>
            </div>
          ) : (
            <ProductList
              products={productsData?.products || []}
              loading={isLoading}
              variant={viewMode}
              cardVariant={viewMode === 'list' ? 'detailed' : 'default'}
              columns={viewMode === 'list' ? 2 : 4}
              hasMore={productsData?.hasMore || false}
              onLoadMore={() => {
                // Load more implementation
                console.log('Load more products');
              }}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
