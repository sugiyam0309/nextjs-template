'use client';

import * as React from 'react';
import { Header } from '@/components/common/header/header';
import { Sidebar } from '@/components/common/sidebar/sidebar';
import { cn } from '@/lib/utils/cn';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  headerProps?: React.ComponentProps<typeof Header>;
  sidebarProps?: React.ComponentProps<typeof Sidebar>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className,
  showHeader = true,
  headerProps,
  sidebarProps,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        collapsible={true}
        {...sidebarProps}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {showHeader && (
          <Header
            {...headerProps}
            className={cn('lg:hidden', headerProps?.className)}
          />
        )}

        {/* Mobile Menu Button */}
        <div className="lg:hidden p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-label="Open sidebar"
          >
            <svg
              className="block h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Page Content */}
        <main className={cn('flex-1 overflow-y-auto', className)}>
          <div className="container mx-auto px-4 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

DashboardLayout.displayName = 'DashboardLayout';

export { DashboardLayout };
