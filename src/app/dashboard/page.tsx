'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card/card';
import { Button } from '@/components/ui/button/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table/table';
import {
  UsersIcon, 
  ShoppingBagIcon, 
  TrendingUpIcon, 
  DollarSignIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BarChartIcon,
  ActivityIcon,
  PackageIcon,
  SearchIcon
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

interface Activity {
  id: string;
  type: 'order' | 'user' | 'product' | 'search';
  title: string;
  description: string;
  time: string;
}

const statsData: StatCard[] = [
  {
    title: '総売上',
    value: '¥1,234,567',
    change: 12.5,
    icon: <DollarSignIcon className="h-6 w-6" />,
    trend: 'up',
  },
  {
    title: '注文数',
    value: '456',
    change: 8.2,
    icon: <ShoppingBagIcon className="h-6 w-6" />,
    trend: 'up',
  },
  {
    title: 'ユーザー数',
    value: '1,234',
    change: -2.4,
    icon: <UsersIcon className="h-6 w-6" />,
    trend: 'down',
  },
  {
    title: 'コンバージョン率',
    value: '3.2%',
    change: 4.1,
    icon: <TrendingUpIcon className="h-6 w-6" />,
    trend: 'up',
  },
];

const recentOrders = [
  { id: 'ORD-001', customer: '山田太郎', amount: '¥12,500', status: '処理中', date: '2024-01-15' },
  { id: 'ORD-002', customer: '佐藤花子', amount: '¥8,900', status: '配送中', date: '2024-01-15' },
  { id: 'ORD-003', customer: '鈴木一郎', amount: '¥24,300', status: '完了', date: '2024-01-14' },
  { id: 'ORD-004', customer: '田中美咲', amount: '¥15,700', status: '処理中', date: '2024-01-14' },
  { id: 'ORD-005', customer: '渡辺健太', amount: '¥9,800', status: '完了', date: '2024-01-13' },
];

const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'order',
    title: '新規注文',
    description: '山田太郎様が商品を購入しました',
    time: '5分前',
  },
  {
    id: '2',
    type: 'user',
    title: '新規ユーザー登録',
    description: '新しいユーザーが登録しました',
    time: '15分前',
  },
  {
    id: '3',
    type: 'product',
    title: '商品追加',
    description: '新商品「サンプル商品」が追加されました',
    time: '1時間前',
  },
  {
    id: '4',
    type: 'search',
    title: '人気検索ワード',
    description: '「新商品」が多く検索されています',
    time: '2時間前',
  },
  {
    id: '5',
    type: 'order',
    title: '注文完了',
    description: '注文#ORD-003が完了しました',
    time: '3時間前',
  },
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'order':
      return <ShoppingBagIcon className="h-4 w-4" />;
    case 'user':
      return <UsersIcon className="h-4 w-4" />;
    case 'product':
      return <PackageIcon className="h-4 w-4" />;
    case 'search':
      return <SearchIcon className="h-4 w-4" />;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'order':
      return 'text-blue-600 bg-blue-100';
    case 'user':
      return 'text-green-600 bg-green-100';
    case 'product':
      return 'text-purple-600 bg-purple-100';
    case 'search':
      return 'text-orange-600 bg-orange-100';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case '完了':
      return 'text-green-600 bg-green-100';
    case '処理中':
      return 'text-yellow-600 bg-yellow-100';
    case '配送中':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600 mt-1">ビジネスの概要とパフォーマンス</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={selectedPeriod === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('day')}
          >
            日次
          </Button>
          <Button
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('week')}
          >
            週次
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            月次
          </Button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">前期比</span>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                  {stat.icon}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最近の注文 */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">最近の注文</h2>
                <Button variant="ghost" size="sm">
                  すべて表示
                </Button>
              </div>
            </div>
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>注文ID</TableHead>
                    <TableHead>顧客</TableHead>
                    <TableHead>金額</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>日付</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <span className="font-mono text-sm">{order.id}</span>
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <span className="font-semibold">{order.amount}</span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* 最近のアクティビティ */}
        <div>
          <Card className="h-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  アクティビティ
                </h2>
                <ActivityIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* グラフエリア（プレースホルダー） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">売上推移</h2>
              <BarChartIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">グラフエリア（実装予定）</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                カテゴリ別売上
              </h2>
              <BarChartIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">グラフエリア（実装予定）</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
