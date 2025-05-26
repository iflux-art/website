'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Search, Tag, Calculator } from 'lucide-react';
import Link from 'next/link';

export default function ShoppingToolkitPage() {
  const [activeTab, setActiveTab] = useState<'compare' | 'coupons' | 'list' | 'budget'>('compare');

  // 价格比较
  const PriceComparison = () => {
    const [product, setProduct] = useState('iPhone 15');
    const [results, setResults] = useState<any[]>([]);

    const searchPrices = () => {
      // 模拟价格比较结果
      const mockResults = [
        { store: '京东', price: 5999, shipping: 0, rating: 4.8, stock: '有货' },
        { store: '天猫', price: 6099, shipping: 0, rating: 4.7, stock: '有货' },
        { store: '苏宁', price: 5899, shipping: 15, rating: 4.6, stock: '有货' },
        { store: '拼多多', price: 5699, shipping: 0, rating: 4.5, stock: '有货' },
        { store: '国美', price: 6199, shipping: 20, rating: 4.4, stock: '缺货' }
      ].sort((a, b) => (a.price + a.shipping) - (b.price + b.shipping));
      
      setResults(mockResults);
    };

    return (
      <Card>
        <CardHeader><CardTitle>价格比较</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="输入商品名称"
            />
            <Button onClick={searchPrices}>搜索价格</Button>
          </div>

          {results.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">价格对比结果</h4>
              {results.map((result, index) => (
                <div key={index} className={`p-4 border rounded-lg ${index === 0 ? 'border-green-500 bg-green-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {result.store}
                        {index === 0 && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">最低价</span>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        评分: {result.rating} | 库存: {result.stock}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">¥{result.price}</div>
                      {result.shipping > 0 && (
                        <div className="text-sm text-muted-foreground">+运费 ¥{result.shipping}</div>
                      )}
                      <div className="text-sm font-medium">
                        总计: ¥{result.price + result.shipping}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">比价小贴士</h4>
            <div className="text-sm space-y-1">
              <div>• 注意运费和税费，计算总成本</div>
              <div>• 查看商家信誉和用户评价</div>
              <div>• 关注促销活动和优惠券</div>
              <div>• 比较售后服务和退换政策</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 优惠券查找
  const CouponFinder = () => {
    const [store, setStore] = useState('');
    const [coupons, setCoupons] = useState<any[]>([]);

    const searchCoupons = () => {
      // 模拟优惠券数据
      const mockCoupons = [
        { title: '满300减50', code: 'SAVE50', expiry: '2024-12-31', type: '满减', condition: '满300元可用' },
        { title: '新用户专享9折', code: 'NEW10', expiry: '2024-12-25', type: '折扣', condition: '新用户专享' },
        { title: '免运费券', code: 'FREESHIP', expiry: '2024-12-20', type: '免运费', condition: '无门槛' },
        { title: '满500减100', code: 'BIG100', expiry: '2024-12-15', type: '满减', condition: '满500元可用' }
      ];
      setCoupons(mockCoupons);
    };

    const copyCouponCode = (code: string) => {
      navigator.clipboard.writeText(code);
    };

    return (
      <Card>
        <CardHeader><CardTitle>优惠券查找</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="输入商店名称"
            />
            <Button onClick={searchCoupons}>查找优惠券</Button>
          </div>

          {coupons.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">可用优惠券</h4>
              {coupons.map((coupon, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-red-50 to-pink-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-red-600">{coupon.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {coupon.condition} | 有效期至: {coupon.expiry}
                      </div>
                      <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded mt-2 inline-block">
                        {coupon.type}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded mb-2">
                        {coupon.code}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => copyCouponCode(coupon.code)}
                      >
                        复制代码
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h4 className="font-medium mb-2">优惠券类型</h4>
              <div className="text-sm space-y-1">
                <div>• 满减券: 满额立减</div>
                <div>• 折扣券: 按比例优惠</div>
                <div>• 免运费券: 免除运费</div>
                <div>• 品类券: 特定商品可用</div>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-2">使用技巧</h4>
              <div className="text-sm space-y-1">
                <div>• 叠加使用多张优惠券</div>
                <div>• 关注有效期，及时使用</div>
                <div>• 凑单达到使用门槛</div>
                <div>• 关注店铺活动页面</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 购物清单
  const ShoppingList = () => {
    const [items, setItems] = useState([
      { name: '苹果', price: 8, quantity: 2, category: '水果', checked: false },
      { name: '牛奶', price: 15, quantity: 1, category: '乳制品', checked: false }
    ]);
    const [newItem, setNewItem] = useState({ name: '', price: 0, quantity: 1, category: '其他' });

    const categories = ['水果', '蔬菜', '肉类', '乳制品', '日用品', '电子产品', '其他'];

    const addItem = () => {
      if (newItem.name.trim()) {
        setItems([...items, { ...newItem, checked: false }]);
        setNewItem({ name: '', price: 0, quantity: 1, category: '其他' });
      }
    };

    const toggleItem = (index: number) => {
      const newItems = [...items];
      newItems[index].checked = !newItems[index].checked;
      setItems(newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      setItems(newItems);
    };

    const removeItem = (index: number) => {
      setItems(items.filter((_, i) => i !== index));
    };

    const totalCost = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const checkedCost = items.filter(item => item.checked).reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
      <Card>
        <CardHeader><CardTitle>购物清单</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-2">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="p-2 border rounded-lg"
              placeholder="商品名称"
            />
            <input
              type="number"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
              className="p-2 border rounded-lg"
              placeholder="单价"
              min="0"
              step="0.01"
            />
            <input
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              className="p-2 border rounded-lg"
              placeholder="数量"
              min="1"
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="p-2 border rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Button onClick={addItem}>添加</Button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(index)}
                  className="w-4 h-4"
                />
                <div className={`flex-1 grid grid-cols-4 gap-2 ${item.checked ? 'opacity-50' : ''}`}>
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    className="p-1 border rounded text-sm"
                    disabled={item.checked}
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                    className="p-1 border rounded text-sm"
                    disabled={item.checked}
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                    className="p-1 border rounded text-sm"
                    disabled={item.checked}
                    min="1"
                  />
                  <span className="text-sm font-medium p-1">
                    ¥{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeItem(index)}
                  className="text-xs"
                >
                  删除
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-600">{items.length}</div>
              <div className="text-sm text-muted-foreground">总商品数</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-lg font-bold text-green-600">¥{checkedCost.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">已购买</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-lg font-bold text-purple-600">¥{totalCost.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">预计总价</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 预算管理
  const BudgetManager = () => {
    const [budget, setBudget] = useState(1000);
    const [expenses, setExpenses] = useState([
      { name: '食品', amount: 300, category: '生活必需' },
      { name: '服装', amount: 200, category: '服饰' },
      { name: '电子产品', amount: 150, category: '电子' }
    ]);
    const [newExpense, setNewExpense] = useState({ name: '', amount: 0, category: '其他' });

    const categories = ['生活必需', '服饰', '电子', '娱乐', '其他'];

    const addExpense = () => {
      if (newExpense.name.trim() && newExpense.amount > 0) {
        setExpenses([...expenses, newExpense]);
        setNewExpense({ name: '', amount: 0, category: '其他' });
      }
    };

    const removeExpense = (index: number) => {
      setExpenses(expenses.filter((_, i) => i !== index));
    };

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = budget - totalSpent;
    const spentPercentage = (totalSpent / budget) * 100;

    return (
      <Card>
        <CardHeader><CardTitle>预算管理</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">月度预算</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
              min="0"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <input
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              className="p-2 border rounded-lg"
              placeholder="支出项目"
            />
            <input
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
              className="p-2 border rounded-lg"
              placeholder="金额"
              min="0"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="p-2 border rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Button onClick={addExpense}>添加</Button>
          </div>

          <div className="space-y-2">
            {expenses.map((expense, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <span className="font-medium">{expense.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">({expense.category})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">¥{expense.amount}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeExpense(index)}
                    className="text-xs"
                  >
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>预算使用情况</span>
                <span className="font-medium">{spentPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${spentPercentage > 100 ? 'bg-red-500' : spentPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-600">¥{budget}</div>
                <div className="text-sm text-muted-foreground">总预算</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <div className="text-lg font-bold text-red-600">¥{totalSpent}</div>
                <div className="text-sm text-muted-foreground">已支出</div>
              </div>
              <div className={`p-3 rounded-lg text-center ${remaining >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`text-lg font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ¥{remaining}
                </div>
                <div className="text-sm text-muted-foreground">
                  {remaining >= 0 ? '剩余' : '超支'}
                </div>
              </div>
            </div>
          </div>

          {spentPercentage > 80 && (
            <div className={`p-3 rounded-lg ${spentPercentage > 100 ? 'bg-red-50' : 'bg-yellow-50'}`}>
              <div className={`font-medium ${spentPercentage > 100 ? 'text-red-600' : 'text-yellow-600'}`}>
                {spentPercentage > 100 ? '⚠️ 预算超支！' : '⚠️ 预算即将用完！'}
              </div>
              <div className="text-sm mt-1">
                建议控制支出或调整预算计划
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { key: 'compare', name: '价格比较', icon: Search },
    { key: 'coupons', name: '优惠券', icon: Tag },
    { key: 'list', name: '购物清单', icon: ShoppingCart },
    { key: 'budget', name: '预算管理', icon: Calculator },
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
          购物工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          购物助手工具，包括价格比较、优惠券查找、购物清单、预算管理
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

      {activeTab === 'compare' && <PriceComparison />}
      {activeTab === 'coupons' && <CouponFinder />}
      {activeTab === 'list' && <ShoppingList />}
      {activeTab === 'budget' && <BudgetManager />}
    </div>
  );
}
