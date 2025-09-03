import {
  SearchQuery,
  SearchResponse,
  SearchHistoryItem,
  SearchSuggestion,
} from '@/features/search/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Execute a search query
 */
export async function searchItems(params: SearchQuery): Promise<SearchResponse> {
  const queryParams = new URLSearchParams({
    q: params.query,
    page: (params.page || 1).toString(),
    limit: (params.limit || 10).toString(),
  });

  if (params.filters) {
    if (params.filters.category) {
      queryParams.append('category', params.filters.category);
    }
    if (params.filters.tags) {
      params.filters.tags.forEach(tag => queryParams.append('tags', tag));
    }
    if (params.filters.dateFrom) {
      queryParams.append('dateFrom', params.filters.dateFrom);
    }
    if (params.filters.dateTo) {
      queryParams.append('dateTo', params.filters.dateTo);
    }
    if (params.filters.sortBy) {
      queryParams.append('sortBy', params.filters.sortBy);
    }
    if (params.filters.sortOrder) {
      queryParams.append('sortOrder', params.filters.sortOrder);
    }
  }

  const response = await fetch(`${API_BASE_URL}/search?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get search suggestions based on partial query
 */
export async function getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  const response = await fetch(
    `${API_BASE_URL}/search/suggestions?q=${encodeURIComponent(query)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get suggestions: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get user's search history
 */
export async function getSearchHistory(limit = 10): Promise<SearchHistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/search/history?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get search history: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Add item to search history
 */
export async function addToSearchHistory(
  query: string,
  resultsCount: number
): Promise<SearchHistoryItem> {
  const response = await fetch(`${API_BASE_URL}/search/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      resultsCount,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add to search history: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Clear search history
 */
export async function clearSearchHistory(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/search/history`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to clear search history: ${response.statusText}`);
  }
}

/**
 * Get available categories for filtering
 */
export async function getSearchCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/search/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get categories: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get popular tags for filtering
 */
export async function getPopularTags(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/search/tags`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get tags: ${response.statusText}`);
  }

  return response.json();
}
