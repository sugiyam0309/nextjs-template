import React, { ReactElement } from 'react';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';

// Create a custom render function that includes providers
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface ProvidersProps {
  children: React.ReactNode;
}

export function AllTheProviders({ children }: ProvidersProps) {
  const testQueryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, userEvent };

// Utility functions for common test scenarios
export const waitForLoadingToFinish = () =>
  waitFor(
    () => {
      const loaders = [
        ...screen.queryAllByTestId(/loading/i),
        ...screen.queryAllByText(/loading/i),
      ];
      loaders.forEach((loader) => {
        expect(loader).not.toBeInTheDocument();
      });
    },
    { timeout: 3000 }
  );

export const waitForElementToBeRemoved = (element: HTMLElement | null) => {
  if (!element) return Promise.resolve();
  return waitFor(() => {
    expect(element).not.toBeInTheDocument();
  });
};


// Mock data generators
export const generateMockUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: '/avatar.jpg',
  ...overrides,
});

export const generateMockProduct = (overrides = {}) => ({
  id: '1',
  name: 'Test Product',
  description: 'Test description',
  price: 100,
  image: '/product.jpg',
  ...overrides,
});

export const generateMockSearchResult = (overrides = {}) => ({
  id: '1',
  title: 'Test Result',
  description: 'Test description',
  url: '/result/1',
  category: 'Test Category',
  ...overrides,
});

// Custom matchers
export const expectToHaveBeenCalledWithPartial = (
  mock: ReturnType<typeof vi.fn>,
  partial: Record<string, any>
) => {
  const calls = mock.mock.calls;
  const hasMatchingCall = calls.some((call: any[]) => {
    const arg = call[0];
    return Object.keys(partial).every((key) => arg[key] === partial[key]);
  });
  if (!hasMatchingCall) {
    throw new Error(
      `Expected mock to have been called with partial object ${JSON.stringify(
        partial
      )}`
    );
  }
};
