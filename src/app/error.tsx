'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをログサービスに記録
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          {/* エラーアイコン */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-xl"></div>
              <div className="relative bg-white rounded-full p-6 shadow-lg">
                <AlertTriangle className="h-16 w-16 text-red-500" />
              </div>
            </div>
          </div>

          {/* エラーメッセージ */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            500 - エラーが発生しました
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            申し訳ございません。予期しないエラーが発生しました。
            <br />
            問題が解決しない場合は、サポートまでお問い合わせください。
          </p>

          {/* エラー詳細（開発環境のみ） */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 rounded-lg p-4 mb-8 text-left">
              <p className="text-sm font-mono text-gray-700 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={reset}
              size="lg"
              className="group"
            >
              <RefreshCw className="mr-2 h-4 w-4 group-hover:animate-spin" />
              もう一度試す
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                ホームに戻る
              </Link>
            </Button>
          </div>

          {/* その他のリンク */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500 mb-4">その他のオプション</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                variant="ghost"
                size="sm"
              >
                <Link href="/dashboard">
                  ダッシュボード
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
              >
                <Link href="/search">
                  検索
                </Link>
              </Button>
              <Button
                onClick={() => window.history.back()}
                variant="ghost"
                size="sm"
              >
                <ChevronLeft className="mr-1 h-3 w-3" />
                前のページに戻る
              </Button>
            </div>
          </div>

          {/* サポート情報 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>サポートが必要ですか？</strong>
              <br />
              お問い合わせ: support@example.com
              <br />
              営業時間: 平日 9:00-18:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
