import { useEffect, useState } from 'react';

/**
 * デバウンスされた値を返すカスタムフック
 * @param value - デバウンスする値
 * @param delay - デバウンスの遅延時間（ミリ秒）
 * @returns デバウンスされた値
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // タイマーを設定して、指定された遅延後に値を更新
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ関数：値が変更されたら前のタイマーをクリア
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * デバウンスされたコールバック関数を返すカスタムフック
 * @param callback - デバウンスするコールバック関数
 * @param delay - デバウンスの遅延時間（ミリ秒）
 * @returns デバウンスされたコールバック関数
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // クリーンアップ：コンポーネントのアンマウント時にタイマーをクリア
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const debouncedCallback = (...args: Parameters<T>) => {
    // 既存のタイマーがあればクリア
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 新しいタイマーを設定
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };

  return debouncedCallback;
}
