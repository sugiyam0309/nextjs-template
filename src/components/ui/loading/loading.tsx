import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  color?: 'primary' | 'secondary' | 'gray';
  fullScreen?: boolean;
  text?: string;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ 
    className, 
    size = 'md', 
    variant = 'spinner', 
    color = 'primary',
    fullScreen = false,
    text,
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };

    const colorClasses = {
      primary: 'text-blue-600',
      secondary: 'text-gray-600',
      gray: 'text-gray-400',
    };

    const spinnerBorderColors = {
      primary: 'border-blue-600',
      secondary: 'border-gray-600',
      gray: 'border-gray-400',
    };

    const renderLoader = () => {
      switch (variant) {
        case 'spinner':
          return (
            <div
              className={cn(
                'animate-spin rounded-full border-2 border-t-transparent',
                sizeClasses[size],
                spinnerBorderColors[color]
              )}
            />
          );
        case 'dots':
          return (
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-full bg-current animate-bounce',
                    size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5',
                    colorClasses[color]
                  )}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          );
        case 'pulse':
          return (
            <div
              className={cn(
                'rounded-full bg-current animate-pulse',
                sizeClasses[size],
                colorClasses[color]
              )}
            />
          );
        case 'skeleton':
          return (
            <div className="w-full space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
            </div>
          );
        default:
          return null;
      }
    };

    const content = (
      <div className={cn('flex flex-col items-center justify-center', className)} ref={ref} {...props}>
        {renderLoader()}
        {text && (
          <p className={cn('mt-4 text-sm', colorClasses[color])}>{text}</p>
        )}
      </div>
    );

    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
          {content}
        </div>
      );
    }

    return content;
  }
);

Loading.displayName = 'Loading';

// Skeleton Loading Component for content placeholders
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  circle?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, rounded = true, circle = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-gray-200',
          rounded && !circle && 'rounded-md',
          circle && 'rounded-full',
          className
        )}
        style={{
          width: width || '100%',
          height: height || '1rem',
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Loading Overlay Component
export interface LoadingOverlayProps extends LoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  ...loadingProps
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
          <Loading {...loadingProps} />
        </div>
      )}
    </div>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';

export { Loading, Skeleton, LoadingOverlay };
