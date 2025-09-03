export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
  tags?: string[];
  relevance?: number;
  score?: number;
  price?: number;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'suggested';
}
