'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import {
  searchItems,
  getSearchSuggestions,
  getSearchHistory,
  addToSearchHistory,
  clearSearchHistory,
  getSearchCategories,
  getPopularTags,
} from '@/features/search/api/search';
import {
  SearchQuery,
  SearchResponse,
  SearchFilters,
  SearchSuggestion,
  SearchHistoryItem,
} from '@/features/search/types';

/**
 * Hook for managing search functionality
 */
export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 300);
  const queryClient = useQueryClient();

  const searchParams: SearchQuery = {
    query: debouncedQuery,
    filters,
    page,
    limit: 10,
  };

  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useQuery<SearchResponse, Error>({
    queryKey: ['search', searchParams],
    queryFn: () => searchItems(searchParams),
    enabled: debouncedQuery.length > 0,
  });

  const { mutate: saveToHistory } = useMutation({
    mutationFn: ({ query, resultsCount }: { query: string; resultsCount: number }) =>
      addToSearchHistory(query, resultsCount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
  });

  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
    setPage(1);
  }, []);

  // Save to history when search is successful
  useEffect(() => {
    if (searchResults && debouncedQuery) {
      saveToHistory({
        query: debouncedQuery,
        resultsCount: searchResults.total,
      });
    }
  }, [searchResults, debouncedQuery, saveToHistory]);

  return {
    query,
    filters,
    page,
    searchResults,
    isLoading,
    error,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    clearSearch,
    refetch,
  };
}

/**
 * Hook for search suggestions
 */
export function useSearchSuggestions(query: string, enabled = true) {
  const debouncedQuery = useDebounce(query, 200);

  return useQuery<SearchSuggestion[], Error>({
    queryKey: ['searchSuggestions', debouncedQuery],
    queryFn: () => getSearchSuggestions(debouncedQuery),
    enabled: enabled && debouncedQuery.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for search history
 */
export function useSearchHistory(limit = 10) {
  const queryClient = useQueryClient();

  const { data: history, ...rest } = useQuery<SearchHistoryItem[], Error>({
    queryKey: ['searchHistory', limit],
    queryFn: () => getSearchHistory(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { mutate: clearHistory } = useMutation({
    mutationFn: clearSearchHistory,
    onSuccess: () => {
      queryClient.setQueryData(['searchHistory', limit], []);
    },
  });

  return {
    history,
    clearHistory,
    ...rest,
  };
}

/**
 * Hook for search categories
 */
export function useSearchCategories() {
  return useQuery<string[], Error>({
    queryKey: ['searchCategories'],
    queryFn: getSearchCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook for popular tags
 */
export function usePopularTags() {
  return useQuery<string[], Error>({
    queryKey: ['popularTags'],
    queryFn: getPopularTags,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
