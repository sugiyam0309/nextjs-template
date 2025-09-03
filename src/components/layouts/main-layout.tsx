import * as React from 'react';
import { Header } from '@/components/common/header/header';
import { Footer } from '@/components/common/footer/footer';
import { cn } from '@/lib/utils/cn';

export interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  headerProps?: React.ComponentProps<typeof Header>;
  footerProps?: React.ComponentProps<typeof Footer>;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  showHeader = true,
  showFooter = true,
  headerProps,
  footerProps,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header {...headerProps} />}
      <main className={cn('flex-1', className)}>{children}</main>
      {showFooter && <Footer {...footerProps} />}
    </div>
  );
};

MainLayout.displayName = 'MainLayout';

export { MainLayout };
