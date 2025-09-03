/**
 * 日付・時刻のフォーマット関数
 */

/**
 * 日付を指定されたフォーマットで文字列に変換
 * @param date - 日付オブジェクトまたは日付文字列
 * @param format - フォーマット形式（'YYYY-MM-DD', 'YYYY/MM/DD', 'MM/DD/YYYY' など）
 * @returns フォーマットされた日付文字列
 */
export function formatDate(
  date: Date | string | number,
  format: 'YYYY-MM-DD' | 'YYYY/MM/DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY' = 'YYYY-MM-DD'
): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'YYYY/MM/DD':
      return `${year}/${month}/${day}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * 日付を日本語形式でフォーマット
 * @param date - 日付オブジェクトまたは日付文字列
 * @param includeWeekday - 曜日を含めるかどうか
 * @returns フォーマットされた日付文字列
 */
export function formatDateJapanese(
  date: Date | string | number,
  includeWeekday = false
): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return '無効な日付';
  }

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  
  let result = `${year}年${month}月${day}日`;
  
  if (includeWeekday) {
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[d.getDay()];
    result += `(${weekday})`;
  }
  
  return result;
}

/**
 * 時刻をフォーマット
 * @param date - 日付オブジェクトまたは日付文字列
 * @param includeSeconds - 秒を含めるかどうか
 * @returns フォーマットされた時刻文字列
 */
export function formatTime(
  date: Date | string | number,
  includeSeconds = false
): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Time';
  }

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  if (includeSeconds) {
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  
  return `${hours}:${minutes}`;
}

/**
 * 日時を相対的な表現でフォーマット（例: 3時間前、昨日）
 * @param date - 日付オブジェクトまたは日付文字列
 * @returns 相対的な時間表現
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  
  if (isNaN(d.getTime())) {
    return '無効な日付';
  }

  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 0) {
    // 未来の日付
    const absDiffInSeconds = Math.abs(diffInSeconds);
    const absDiffInMinutes = Math.floor(absDiffInSeconds / 60);
    const absDiffInHours = Math.floor(absDiffInMinutes / 60);
    const absDiffInDays = Math.floor(absDiffInHours / 24);

    if (absDiffInSeconds < 60) return `${absDiffInSeconds}秒後`;
    if (absDiffInMinutes < 60) return `${absDiffInMinutes}分後`;
    if (absDiffInHours < 24) return `${absDiffInHours}時間後`;
    return `${absDiffInDays}日後`;
  }

  if (diffInSeconds < 10) return 'たった今';
  if (diffInSeconds < 60) return `${diffInSeconds}秒前`;
  if (diffInMinutes < 60) return `${diffInMinutes}分前`;
  if (diffInHours < 24) return `${diffInHours}時間前`;
  if (diffInDays === 1) return '昨日';
  if (diffInDays < 7) return `${diffInDays}日前`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}週間前`;
  if (diffInMonths < 12) return `${diffInMonths}ヶ月前`;
  if (diffInYears === 1) return '1年前';
  return `${diffInYears}年前`;
}

/**
 * 数値のフォーマット関数
 */

/**
 * 数値を通貨形式でフォーマット
 * @param amount - 金額
 * @param currency - 通貨記号（デフォルト: ¥）
 * @param locale - ロケール（デフォルト: ja-JP）
 * @returns フォーマットされた通貨文字列
 */
export function formatCurrency(
  amount: number,
  currency = 'JPY',
  locale = 'ja-JP'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * 数値を3桁ごとにカンマ区切りでフォーマット
 * @param num - 数値
 * @returns フォーマットされた数値文字列
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ja-JP').format(num);
}

/**
 * 数値をパーセンテージ形式でフォーマット
 * @param value - 数値（0-1の範囲、または0-100の範囲）
 * @param decimal - 小数点以下の桁数
 * @param isRatio - trueの場合、値を0-1の範囲として扱う
 * @returns フォーマットされたパーセンテージ文字列
 */
export function formatPercentage(
  value: number,
  decimal = 0,
  isRatio = false
): string {
  const percentage = isRatio ? value * 100 : value;
  return `${percentage.toFixed(decimal)}%`;
}

/**
 * ファイルサイズをフォーマット
 * @param bytes - バイト数
 * @param decimals - 小数点以下の桁数
 * @returns フォーマットされたファイルサイズ文字列
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * 文字列のフォーマット関数
 */

/**
 * 文字列を指定した長さで切り詰める
 * @param str - 対象の文字列
 * @param maxLength - 最大長
 * @param suffix - 切り詰めた場合に追加する文字列（デフォルト: '...'）
 * @returns 切り詰められた文字列
 */
export function truncate(
  str: string,
  maxLength: number,
  suffix = '...'
): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 文字列をキャピタライズ（最初の文字を大文字に）
 * @param str - 対象の文字列
 * @returns キャピタライズされた文字列
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * スネークケースをキャメルケースに変換
 * @param str - スネークケースの文字列
 * @returns キャメルケースの文字列
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * キャメルケースをスネークケースに変換
 * @param str - キャメルケースの文字列
 * @returns スネークケースの文字列
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * URLのクエリパラメータをオブジェクトに変換
 * @param url - URL文字列
 * @returns クエリパラメータのオブジェクト
 */
export function parseQueryParams(url: string): Record<string, string> {
  const params = new URLSearchParams(new URL(url).search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

/**
 * オブジェクトをURLクエリパラメータ文字列に変換
 * @param params - パラメータオブジェクト
 * @returns クエリパラメータ文字列
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * 電話番号をフォーマット
 * @param phoneNumber - 電話番号文字列
 * @param format - フォーマット形式
 * @returns フォーマットされた電話番号
 */
export function formatPhoneNumber(
  phoneNumber: string,
  format: 'hyphen' | 'parenthesis' = 'hyphen'
): string {
  // 数字以外を除去
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // 日本の電話番号形式（0から始まる10桁または11桁）
  if (cleaned.length === 10) {
    // 固定電話（03-1234-5678形式）
    if (format === 'hyphen') {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
  } else if (cleaned.length === 11) {
    // 携帯電話（090-1234-5678形式）
    if (format === 'hyphen') {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
  }
  
  // フォーマットできない場合はそのまま返す
  return phoneNumber;
}

/**
 * メールアドレスをマスキング
 * @param email - メールアドレス
 * @returns マスキングされたメールアドレス
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  
  if (!domain) return email;
  
  const visibleChars = Math.min(3, Math.floor(localPart.length / 2));
  const maskedLocal = 
    localPart.slice(0, visibleChars) +
    '*'.repeat(Math.max(0, localPart.length - visibleChars * 2)) +
    localPart.slice(-visibleChars);
  
  return `${maskedLocal}@${domain}`;
}

/**
 * 配列をグループ化
 * @param array - 対象の配列
 * @param key - グループ化するキー
 * @returns グループ化されたオブジェクト
 */
export function groupBy<T>(
  array: T[],
  key: keyof T | ((item: T) => string)
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * 配列から重複を除去
 * @param array - 対象の配列
 * @param key - 重複判定に使用するキー（オプション）
 * @returns 重複が除去された配列
 */
export function unique<T>(
  array: T[],
  key?: keyof T | ((item: T) => any)
): T[] {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter((item) => {
    const value = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}
