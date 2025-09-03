'use client';

import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layouts/main-layout';
import { ProductList } from '@/features/products/components';
import { SearchBar } from '@/features/search/components';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';
import { useFeaturedProducts, useNewArrivals, useBestSellingProducts } from '@/features/products/hooks/useProducts';

export default function HomePage() {
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProducts(8);
  const { data: newArrivalsData, isLoading: newArrivalsLoading } = useNewArrivals(4);
  const { data: bestSellingData, isLoading: bestSellingLoading } = useBestSellingProducts(4);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Next.js テンプレートショップへようこそ
            </h1>
            <p className="text-xl mb-8">
              最高品質の商品を最高の価格でお届けします
            </p>
            <div className="max-w-xl mx-auto mb-8">
              <SearchBar 
                placeholder="商品を検索..." 
                className="w-full"
                onSearch={(query) => {
                  // Navigate to search page with query
                  window.location.href = `/search?q=${encodeURIComponent(query)}`;
                }}
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" variant="secondary">
                  商品を見る
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                  詳細検索
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-lg font-semibold mb-2">送料無料</h3>
              <p className="text-gray-600">
                5,000円以上のご購入で全国送料無料
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold mb-2">安全な決済</h3>
              <p className="text-gray-600">
                SSL暗号化で安全なオンライン決済
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">↩️</div>
              <h3 className="text-lg font-semibold mb-2">返品保証</h3>
              <p className="text-gray-600">
                30日間の返品・交換保証付き
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">おすすめ商品</h2>
            <Link href="/products?featured=true">
              <Button variant="outline">すべて見る →</Button>
            </Link>
          </div>
          <ProductList
            products={featuredData || []}
            loading={featuredLoading}
            columns={4}
            cardVariant="default"
          />
        </div>
      </section>

      {/* New Arrivals & Best Selling */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* New Arrivals */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">新着商品</h3>
                <Link href="/products?sort=newest">
                  <Button variant="outline" size="sm">もっと見る</Button>
                </Link>
              </div>
              <ProductList
                products={newArrivalsData || []}
                loading={newArrivalsLoading}
                columns={2}
                cardVariant="compact"
              />
            </div>

            {/* Best Selling */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">ベストセラー</h3>
                <Link href="/products?sort=bestselling">
                  <Button variant="outline" size="sm">もっと見る</Button>
                </Link>
              </div>
              <ProductList
                products={bestSellingData || []}
                loading={bestSellingLoading}
                columns={2}
                cardVariant="compact"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            メンバー限定特典
          </h2>
          <p className="text-xl mb-8">
            今すぐ登録して、限定クーポンとセール情報を受け取りましょう
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary">
                無料登録
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                ログイン
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
