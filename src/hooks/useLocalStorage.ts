'use client';

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

/**
 * LocalStorageと同期する状態管理フック
 * @param key - LocalStorageのキー
 * @param initialValue - 初期値
 * @returns [値, 値を設定する関数, 値を削除する関数]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>, () => void] {
  // 初期値を取得する関数
  const readValue = useCallback((): T => {
    // SSRの場合は初期値を返す
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // 状態の初期化
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 値を設定する関数
  const setValue: SetValue<T> = useCallback(
    (value) => {
      // SSRの場合は何もしない
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key "${key}" even though environment is not a client`
        );
        return;
      }

      try {
        // 関数が渡された場合は前の値を使って新しい値を計算
        const newValue = value instanceof Function ? value(storedValue) : value;

        // LocalStorageに保存
        window.localStorage.setItem(key, JSON.stringify(newValue));

        // 状態を更新
        setStoredValue(newValue);

        // カスタムイベントを発火（他のタブとの同期用）
        window.dispatchEvent(
          new CustomEvent('local-storage', { detail: { key, newValue } })
        );
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // 値を削除する関数
  const removeValue = useCallback(() => {
    // SSRの場合は何もしない
    if (typeof window === 'undefined') {
      console.warn(
        `Tried removing localStorage key "${key}" even though environment is not a client`
      );
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);

      // カスタムイベントを発火（他のタブとの同期用）
      window.dispatchEvent(
        new CustomEvent('local-storage', {
          detail: { key, newValue: initialValue },
        })
      );
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // LocalStorageの変更を監視（他のタブでの変更も含む）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== localStorage) return;

      try {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      } catch (error) {
        console.warn(`Error parsing localStorage value for key "${key}":`, error);
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; newValue: T }>;
      if (customEvent.detail.key === key) {
        setStoredValue(customEvent.detail.newValue);
      }
    };

    // イベントリスナーを登録
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleCustomEvent);

    // 初期値を読み込み
    setStoredValue(readValue());

    // クリーンアップ
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleCustomEvent);
    };
  }, [key, initialValue, readValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * LocalStorageから値を読み取る関数
 * @param key - LocalStorageのキー
 * @param initialValue - デフォルト値
 * @returns 保存されている値またはデフォルト値
 */
export function getLocalStorageItem<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

/**
 * LocalStorageに値を保存する関数
 * @param key - LocalStorageのキー
 * @param value - 保存する値
 */
export function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    console.warn(
      `Tried setting localStorage key "${key}" even though environment is not a client`
    );
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(
      new CustomEvent('local-storage', { detail: { key, newValue: value } })
    );
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
}

/**
 * LocalStorageから値を削除する関数
 * @param key - LocalStorageのキー
 */
export function removeLocalStorageItem(key: string): void {
  if (typeof window === 'undefined') {
    console.warn(
      `Tried removing localStorage key "${key}" even though environment is not a client`
    );
    return;
  }

  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(
      new CustomEvent('local-storage', { detail: { key, newValue: null } })
    );
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * LocalStorageをクリアする関数
 */
export function clearLocalStorage(): void {
  if (typeof window === 'undefined') {
    console.warn(
      'Tried clearing localStorage even though environment is not a client'
    );
    return;
  }

  try {
    window.localStorage.clear();
  } catch (error) {
    console.warn('Error clearing localStorage:', error);
  }
}
