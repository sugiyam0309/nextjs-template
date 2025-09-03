'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * メディアクエリの状態を監視するフック
 * @param query - メディアクエリ文字列（例: '(min-width: 768px)'）
 * @returns メディアクエリがマッチするかどうかの真偽値
 */
export function useMediaQuery(query: string): boolean {
  // SSR対応: 初期値をfalseに設定
  const [matches, setMatches] = useState<boolean>(false);

  // メディアクエリの評価関数
  const getMatches = useCallback((query: string): boolean => {
    // SSRの場合はfalseを返す
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  }, []);

  useEffect(() => {
    // SSRの場合は何もしない
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    
    // 初期値を設定
    setMatches(mediaQueryList.matches);

    // メディアクエリの変更を監視
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // リスナーを登録（古いブラウザ対応）
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // 古いブラウザ用のフォールバック
      mediaQueryList.addListener(handleChange);
    }

    // クリーンアップ
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // 古いブラウザ用のフォールバック
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query, getMatches]);

  return matches;
}

/**
 * よく使用されるブレークポイント用のカスタムフック
 */
export function useBreakpoint() {
  // Tailwind CSSのデフォルトブレークポイントに基づく
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isSm = useMediaQuery('(min-width: 640px)');
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  const is2xl = useMediaQuery('(min-width: 1536px)');

  return {
    isMobile,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    // 便利なヘルパー
    isDesktop: isLg,
    isTablet: isMd && !isLg,
    isPhone: !isMd,
  };
}

/**
 * デバイスの向きを検出するフック
 */
export function useOrientation() {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return {
    isPortrait,
    isLandscape,
    orientation: isPortrait ? 'portrait' : 'landscape',
  };
}

/**
 * ユーザーの環境設定を検出するフック
 */
export function usePreferences() {
  // ダークモードの設定
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersLight = useMediaQuery('(prefers-color-scheme: light)');
  
  // 動きの削減設定
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // コントラストの設定
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');
  const prefersLowContrast = useMediaQuery('(prefers-contrast: low)');
  
  // 透明度の削減設定
  const prefersReducedTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');

  return {
    colorScheme: prefersDark ? 'dark' : prefersLight ? 'light' : 'no-preference',
    prefersDark,
    prefersLight,
    prefersReducedMotion,
    prefersHighContrast,
    prefersLowContrast,
    prefersReducedTransparency,
  };
}

/**
 * デバイスの能力を検出するフック
 */
export function useDeviceCapabilities() {
  // タッチデバイスかどうか
  const isTouch = useMediaQuery('(any-hover: none) and (any-pointer: coarse)');
  
  // ホバー機能があるかどうか
  const canHover = useMediaQuery('(any-hover: hover)');
  
  // 精密なポインティングデバイスがあるかどうか
  const hasFinePointer = useMediaQuery('(any-pointer: fine)');
  
  // 高解像度ディスプレイかどうか
  const isHighDensity = useMediaQuery('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)');

  return {
    isTouch,
    canHover,
    hasFinePointer,
    isHighDensity,
  };
}

/**
 * 画面サイズを取得するフック
 */
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 初期値を設定
    handleResize();

    // リサイズイベントを監視
    window.addEventListener('resize', handleResize);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
}

/**
 * 特定の要素が表示可能な幅を持つかチェックするフック
 * @param minWidth - 最小幅（ピクセル）
 * @returns 要素が表示可能かどうか
 */
export function useMinWidth(minWidth: number): boolean {
  return useMediaQuery(`(min-width: ${minWidth}px)`);
}

/**
 * 特定の要素が表示可能な高さを持つかチェックするフック
 * @param minHeight - 最小高さ（ピクセル）
 * @returns 要素が表示可能かどうか
 */
export function useMinHeight(minHeight: number): boolean {
  return useMediaQuery(`(min-height: ${minHeight}px)`);
}
