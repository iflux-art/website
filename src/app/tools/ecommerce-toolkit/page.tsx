'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Calculator, TrendingUp, Package } from 'lucide-react';
import Link from 'next/link';

export default function EcommerceToolkitPage() {
  const [activeTab, setActiveTab] = useState<'profit' | 'pricing' | 'inventory' | 'conversion'>('profit');

  // 利润计算器
  const ProfitCalculator = () => {
    const [cost, setCost] = useState(100);
    const [sellingPrice, setSellingPrice] = useState(150);
    const [quantity, setQuantity] = useState(10);
    const [shippingCost, setShippingCost] = useState(10);
    const [platformFee, setPlatformFee] = useState(5);
    const [result, setResult] = useState<any>(null);

    const calculateProfit = () => {
      const totalCost = (cost + shippingCost) * quantity;
      const totalRevenue = sellingPrice * quantity;
      const totalFees = platformFee * quantity;
      const netProfit = totalRevenue - totalCost - totalFees;
      const profitMargin = ((netProfit / totalRevenue) * 100);
      const profitPerUnit = netProfit / quantity;

      setResult({
        totalRevenue: totalRevenue.toFixed(2),
        totalCost: totalCost.toFixed(2),
        totalFees: totalFees.toFixed(2),
        netProfit: netProfit.toFixed(2),
        profitMargin: profitMargin.toFixed(1),
        profitPerUnit: profitPerUnit.toFixed(2)
      });
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>利润计算</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">成本价格 (元)</label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">销售价格 (元)</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">销售数量</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">运费 (元/件)</label>
                <input
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">平台费用 (元/件)</label>
                <input
                  type="number"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <Button onClick={calculateProfit} className="w-full">
              计算利润
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>利润分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">总收入</div>
                  <div className="text-2xl font-bold text-green-600">¥{result.totalRevenue}</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">总成本</div>
                  <div className="text-2xl font-bold text-red-600">¥{result.totalCost}</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">净利润</div>
                  <div className="text-2xl font-bold text-blue-600">¥{result.netProfit}</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">利润率</div>
                  <div className="text-2xl font-bold text-purple-600">{result.profitMargin}%</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">单件利润</div>
                  <div className="text-2xl font-bold text-orange-600">¥{result.profitPerUnit}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">平台费用</div>
                  <div className="text-2xl font-bold text-gray-600">¥{result.totalFees}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // 定价策略
  const PricingStrategy = () => {
    const [cost, setCost] = useState(100);
    const [targetMargin, setTargetMargin] = useState(30);
    const [competitorPrice, setCompetitorPrice] = useState(180);
    const [strategies, setStrategies] = useState<any>(null);

    const calculatePricing = () => {
      const costPlusPrice = cost / (1 - targetMargin / 100);
      const competitivePrice = competitorPrice * 0.95; // 比竞争对手低5%
      const premiumPrice = competitorPrice * 1.1; // 比竞争对手高10%
      const psychologicalPrice = Math.ceil(costPlusPrice / 10) * 10 - 0.01; // 心理定价

      setStrategies({
        costPlus: {
          price: costPlusPrice.toFixed(2),
          margin: targetMargin,
          description: '基于成本加成的定价'
        },
        competitive: {
          price: competitivePrice.toFixed(2),
          margin: (((competitivePrice - cost) / competitivePrice) * 100).toFixed(1),
          description: '竞争性定价策略'
        },
        premium: {
          price: premiumPrice.toFixed(2),
          margin: (((premiumPrice - cost) / premiumPrice) * 100).toFixed(1),
          description: '高端定价策略'
        },
        psychological: {
          price: psychologicalPrice.toFixed(2),
          margin: (((psychologicalPrice - cost) / psychologicalPrice) * 100).toFixed(1),
          description: '心理定价策略'
        }
      });
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>定价策略分析</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">产品成本 (元)</label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">目标利润率 (%)</label>
                <input
                  type="number"
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">竞争对手价格 (元)</label>
                <input
                  type="number"
                  value={competitorPrice}
                  onChange={(e) => setCompetitorPrice(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <Button onClick={calculatePricing} className="w-full">
              分析定价策略
            </Button>
          </CardContent>
        </Card>

        {strategies && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(strategies).map(([key, strategy]: [string, PricingStrategy]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="text-base">{strategy.description}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">¥{strategy.price}</div>
                    <div className="text-sm text-muted-foreground">利润率: {strategy.margin}%</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 库存管理
  const InventoryManager = () => {
    const [products, setProducts] = useState([
      { name: '产品A', current: 50, min: 20, max: 100, dailySales: 5 },
      { name: '产品B', current: 15, min: 10, max: 80, dailySales: 3 },
      { name: '产品C', current: 80, min: 30, max: 120, dailySales: 8 }
    ]);

    const getStockStatus = (product: any) => {
      const daysLeft = Math.floor(product.current / product.dailySales);
      
      if (product.current <= product.min) {
        return { status: '库存不足', color: 'text-red-600', days: daysLeft };
      } else if (product.current <= product.min * 1.5) {
        return { status: '库存偏低', color: 'text-orange-600', days: daysLeft };
      } else {
        return { status: '库存充足', color: 'text-green-600', days: daysLeft };
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>库存状态监控</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product, index) => {
              const status = getStockStatus(product);
              return (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{product.name}</h4>
                    <span className={`text-sm font-medium ${status.color}`}>
                      {status.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">当前库存:</span>
                      <div className="font-semibold">{product.current}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">日销量:</span>
                      <div className="font-semibold">{product.dailySales}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">可售天数:</span>
                      <div className="font-semibold">{status.days}天</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">建议补货:</span>
                      <div className="font-semibold">{Math.max(0, product.max - product.current)}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          product.current <= product.min ? 'bg-red-500' :
                          product.current <= product.min * 1.5 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((product.current / product.max) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // 转化率分析
  const ConversionAnalysis = () => {
    const [visitors, setVisitors] = useState(1000);
    const [addToCart, setAddToCart] = useState(150);
    const [purchases, setPurchases] = useState(45);
    const [result, setResult] = useState<any>(null);

    const analyzeConversion = () => {
      const cartConversion = ((addToCart / visitors) * 100);
      const purchaseConversion = ((purchases / visitors) * 100);
      const checkoutConversion = ((purchases / addToCart) * 100);

      // 行业基准
      const benchmarks = {
        cartConversion: 15,
        purchaseConversion: 2.5,
        checkoutConversion: 25
      };

      setResult({
        cartConversion: cartConversion.toFixed(2),
        purchaseConversion: purchaseConversion.toFixed(2),
        checkoutConversion: checkoutConversion.toFixed(2),
        benchmarks,
        improvements: {
          cart: cartConversion < benchmarks.cartConversion ? '优化产品页面和价格展示' : '表现良好',
          purchase: purchaseConversion < benchmarks.purchaseConversion ? '改善用户体验和信任度' : '表现良好',
          checkout: checkoutConversion < benchmarks.checkoutConversion ? '简化结账流程' : '表现良好'
        }
      });
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>转化率分析</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">网站访客数</label>
                <input
                  type="number"
                  value={visitors}
                  onChange={(e) => setVisitors(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">加购人数</label>
                <input
                  type="number"
                  value={addToCart}
                  onChange={(e) => setAddToCart(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">购买人数</label>
                <input
                  type="number"
                  value={purchases}
                  onChange={(e) => setPurchases(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                  min="0"
                />
              </div>
            </div>
            <Button onClick={analyzeConversion} className="w-full">
              分析转化率
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>转化率报告</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{result.cartConversion}%</div>
                  <div className="text-sm text-muted-foreground">加购转化率</div>
                  <div className="text-xs text-muted-foreground">基准: {result.benchmarks.cartConversion}%</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{result.purchaseConversion}%</div>
                  <div className="text-sm text-muted-foreground">购买转化率</div>
                  <div className="text-xs text-muted-foreground">基准: {result.benchmarks.purchaseConversion}%</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{result.checkoutConversion}%</div>
                  <div className="text-sm text-muted-foreground">结账转化率</div>
                  <div className="text-xs text-muted-foreground">基准: {result.benchmarks.checkoutConversion}%</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">优化建议</h4>
                <div className="space-y-2 text-sm">
                  <div>• <strong>加购转化:</strong> {result.improvements.cart}</div>
                  <div>• <strong>购买转化:</strong> {result.improvements.purchase}</div>
                  <div>• <strong>结账转化:</strong> {result.improvements.checkout}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const tabs = [
    { key: 'profit', name: '利润计算', icon: Calculator },
    { key: 'pricing', name: '定价策略', icon: TrendingUp },
    { key: 'inventory', name: '库存管理', icon: Package },
    { key: 'conversion', name: '转化分析', icon: ShoppingCart },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/tools">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回工具列表
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          电商工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          电商运营工具，包括利润计算、定价策略、库存管理和转化分析
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 p-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {activeTab === 'profit' && <ProfitCalculator />}
      {activeTab === 'pricing' && <PricingStrategy />}
      {activeTab === 'inventory' && <InventoryManager />}
      {activeTab === 'conversion' && <ConversionAnalysis />}
    </div>
  );
}