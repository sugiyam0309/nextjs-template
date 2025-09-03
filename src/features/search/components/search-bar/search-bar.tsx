'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input/input';
import { Button } from '@/components/ui/button/button';
import { cn } from '@/lib/utils/cn';

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
  className?: string;
  showButton?: boolean;
}

export function SearchBar({
  placeholder = '検索...',
  defaultValue = '',
  onSearch,
  onClear,
  isLoading = false,
  className,
  showButton = true,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onClear?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // リアルタイム検索の場合
    if (!showButton) {
      onSearch(newQuery);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex gap-2', className)}
    >
      <div className="relative flex-1">
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={isLoading}
          className="pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="検索をクリア"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      {showButton && (
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          loading={isLoading}
        >
          検索
        </Button>
      )}
    </form>
  );
}
