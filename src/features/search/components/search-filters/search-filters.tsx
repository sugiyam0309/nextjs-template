'use client';

import { useState } from 'react';
import { Select, type SelectOption } from '@/components/ui/select/select';
import { Button } from '@/components/ui/button/button';
import { cn } from '@/lib/utils/cn';
import { SearchFilters as SearchFiltersType } from '../../types';

interface SearchFiltersProps {
  filters?: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onReset?: () => void;
  className?: string;
  categories?: SelectOption[];
  priceRanges?: Array<{ value: string; label: string; min: number; max: number }>;
}

const defaultCategories: SelectOption[] = [
  { value: 'all', label: 'すべてのカテゴリ' },
  { value: 'electronics', label: '電子機器' },
  { value: 'clothing', label: '衣類' },
  { value: 'books', label: '書籍' },
  { value: 'home', label: 'ホーム・キッチン' },
  { value: 'sports', label: 'スポーツ・アウトドア' },
];

const defaultPriceRanges = [
  { value: 'all', label: 'すべての価格', min: 0, max: Infinity },
  { value: '0-1000', label: '〜¥1,000', min: 0, max: 1000 },
  { value: '1000-5000', label: '¥1,000〜¥5,000', min: 1000, max: 5000 },
  { value: '5000-10000', label: '¥5,000〜¥10,000', min: 5000, max: 10000 },
  { value: '10000+', label: '¥10,000〜', min: 10000, max: Infinity },
];

const sortOptions: SelectOption[] = [
  { value: 'relevance', label: '関連度順' },
  { value: 'price_asc', label: '価格: 安い順' },
  { value: 'price_desc', label: '価格: 高い順' },
  { value: 'date_asc', label: '日付: 古い順' },
  { value: 'date_desc', label: '日付: 新しい順' },
];

export function SearchFilters({
  filters = {},
  onFiltersChange,
  onReset,
  className,
  categories = defaultCategories,
  priceRanges = defaultPriceRanges,
}: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFiltersType>(filters);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value === 'all' ? undefined : e.target.value;
    const newFilters = { ...localFilters, category: newCategory };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value as SearchFiltersType['sortBy'];
    const newFilters = { ...localFilters, sortBy: newSort };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRange = priceRanges.find(range => range.value === e.target.value);
    
    if (selectedRange && selectedRange.value !== 'all') {
      const newFilters = {
        ...localFilters,
        minPrice: selectedRange.min,
        maxPrice: selectedRange.max === Infinity ? undefined : selectedRange.max,
      };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    } else {
      const newFilters = {
        ...localFilters,
        minPrice: undefined,
        maxPrice: undefined,
      };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    }
  };

  const handleReset = () => {
    const emptyFilters: SearchFiltersType = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    onReset?.();
  };

  const getCurrentPriceRange = () => {
    if (localFilters.minPrice === undefined && localFilters.maxPrice === undefined) {
      return 'all';
    }
    
    const range = priceRanges.find(r => 
      r.min === localFilters.minPrice && 
      (r.max === localFilters.maxPrice || (r.max === Infinity && localFilters.maxPrice === undefined))
    );
    
    return range?.value || 'all';
  };

  const hasActiveFilters = () => {
    return !!(
      localFilters.category ||
      localFilters.sortBy ||
      localFilters.minPrice !== undefined ||
      localFilters.maxPrice !== undefined
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Select
            id="category"
            label="カテゴリ"
            value={localFilters.category || 'all'}
            onChange={handleCategoryChange}
            options={categories}
            className="w-full"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <Select
            id="price-range"
            label="価格帯"
            value={getCurrentPriceRange()}
            onChange={handlePriceRangeChange}
            options={priceRanges.map(range => ({
              value: range.value,
              label: range.label
            }))}
            className="w-full"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <Select
            id="sort-by"
            label="並び替え"
            value={localFilters.sortBy || 'relevance'}
            onChange={handleSortChange}
            options={sortOptions}
            className="w-full"
          />
        </div>
      </div>

      {hasActiveFilters() && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            フィルターをリセット
          </Button>
        </div>
      )}
    </div>
  );
}
