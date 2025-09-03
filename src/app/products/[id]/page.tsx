'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layouts/main-layout';
import { Button } from '@/components/ui/button/button';
import { Loading } from '@/components/ui/loading/loading';
import { Input } from '@/components/ui/input/input';
import { ProductCard } from '@/features/products/components';
import { useProduct, useRelatedProducts } from '@/features/products/hooks/useProducts';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  ShareIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  RefreshCwIcon
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specs' | 'reviews'>('description');
  
  const { data: product, isLoading, error } = useProduct(productId);
  const { data: relatedProducts } = useRelatedProducts(productId);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loading />
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-600 font-semibold">商品が見つかりませんでした</p>
          <Button 
            onClick={() => router.push('/products')}
            className="mt-4"
          >
            商品一覧に戻る
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleAddToCart = () => {
    console.log('Add to cart:', product.id, quantity);
    // カート追加ロジックを実装
  };

  const handleAddToWishlist = () => {
    console.log('Add to wishlist:', product.id);
    // ウィッシュリスト追加ロジックを実装
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('リンクをコピーしました');
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* パンくずリスト */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">ホーム</Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">商品一覧</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 画像セクション */}
            <div className="space-y-4">
              <div className="relative bg-white rounded-lg overflow-hidden aspect-square">
                {product.images.length > 0 && (
                  <>
                    <img
                      src={product.images[selectedImage]?.url}
                      alt={product.images[selectedImage]?.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                        >
                          <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                        >
                          <ChevronRightIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </>
                )}
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discountPercentage}%
                  </div>
                )}
              </div>
              
              {/* サムネイル */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 商品情報セクション */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                {product.brand && (
                  <p className="text-sm text-gray-500 mt-1">ブランド: {product.brand}</p>
                )}
              </div>

              {/* 評価 */}
              {product.rating !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating!) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.reviewCount || 0}件のレビュー)
                  </span>
                </div>
              )}

              {/* 価格 */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ¥{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ¥{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">税込み</p>
              </div>

              {/* 在庫状況 */}
              <div className="space-y-2">
                <p className={`text-sm font-semibold ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stock > 0 ? `在庫あり (残り${product.stock}点)` : '在庫切れ'}
                </p>
                {product.sku && (
                  <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                )}
              </div>

              {/* 数量選択 */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">数量:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0 focus:ring-0"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2"
                    size="lg"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    カートに追加
                  </Button>
                  <Button
                    onClick={handleAddToWishlist}
                    variant="outline"
                    size="lg"
                    className="px-4"
                  >
                    <HeartIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="lg"
                    className="px-4"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* 特典情報 */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <TruckIcon className="h-5 w-5 text-gray-600" />
                  <span>全国送料無料（¥5,000以上のご購入）</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
                  <span>安心の品質保証</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RefreshCwIcon className="h-5 w-5 text-gray-600" />
                  <span>30日間返品可能</span>
                </div>
              </div>
            </div>
          </div>

          {/* タブセクション */}
          <div className="mt-12 bg-white rounded-lg shadow-sm">
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setSelectedTab('description')}
                  className={`px-6 py-3 font-medium ${
                    selectedTab === 'description'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  商品説明
                </button>
                <button
                  onClick={() => setSelectedTab('specs')}
                  className={`px-6 py-3 font-medium ${
                    selectedTab === 'specs'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  仕様
                </button>
                <button
                  onClick={() => setSelectedTab('reviews')}
                  className={`px-6 py-3 font-medium ${
                    selectedTab === 'reviews'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  レビュー
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700">{product.description}</p>
                  {product.features && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">特徴</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="text-gray-700">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'specs' && (
                <div>
                  {product.specifications ? (
                    <table className="w-full">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <tr key={key} className="border-b">
                            <td className="py-2 pr-4 font-medium text-gray-700">{key}</td>
                            <td className="py-2 text-gray-600">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500">仕様情報はありません</p>
                  )}
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div>
                  <p className="text-gray-500">レビューはまだありません</p>
                </div>
              )}
            </div>
          </div>

          {/* 関連商品 */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">関連商品</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
