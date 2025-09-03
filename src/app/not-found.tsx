'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button/button';
import { HomeIcon, SearchIcon, ArrowLeftIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404イラスト */}
        <div className="mb-8">
          <svg
            className="mx-auto h-48 w-48 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={0.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* エラーコード */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

        {/* エラーメッセージ */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 mb-8">
          お探しのページは存在しないか、移動した可能性があります。
          URLをご確認いただくか、以下のリンクからお進みください。
        </p>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="default" className="w-full sm:w-auto">
              <HomeIcon className="mr-2 h-4 w-4" />
              ホームへ戻る
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="w-full sm:w-auto">
              <SearchIcon className="mr-2 h-4 w-4" />
              検索する
            </Button>
          </Link>
        </div>

        {/* 追加のヘルプ */}
        <div className="mt-12 p-4 bg-white rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 mb-3">
            よくアクセスされるページ：
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/products"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              商品一覧
            </Link>
            <span className="text-gray-400">・</span>
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              ダッシュボード
            </Link>
            <span className="text-gray-400">・</span>
            <Link
              href="/search"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              検索
            </Link>
          </div>
        </div>

        {/* 戻るリンク */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          前のページに戻る
        </button>
      </div>
    </div>
  );
}
