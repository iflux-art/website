'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Calculator, ShoppingCart, Timer } from 'lucide-react';
import { ToolLayout } from '@/components/layout/tool-layout';

interface FoodItem {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function CookingToolkitPage() {
  const [activeTab, setActiveTab] = useState<'recipes' | 'nutrition' | 'shopping' | 'timer'>(
    'recipes'
  );

  // 菜谱搜索
  const RecipeSearch = () => {
    const [ingredient, setIngredient] = useState('');
    const [cuisine, setCuisine] = useState('all');
    const [difficulty, setDifficulty] = useState('all');

    const recipes = [
      {
        name: '宫保鸡丁',
        cuisine: '川菜',
        difficulty: '中等',
        time: '30分钟',
        ingredients: ['鸡肉', '花生', '辣椒'],
      },
      {
        name: '红烧肉',
        cuisine: '鲁菜',
        difficulty: '简单',
        time: '60分钟',
        ingredients: ['五花肉', '生抽', '老抽'],
      },
      {
        name: '麻婆豆腐',
        cuisine: '川菜',
        difficulty: '简单',
        time: '20分钟',
        ingredients: ['豆腐', '肉末', '豆瓣酱'],
      },
      {
        name: '糖醋里脊',
        cuisine: '鲁菜',
        difficulty: '中等',
        time: '25分钟',
        ingredients: ['里脊肉', '醋', '糖'],
      },
      {
        name: '蒸蛋羹',
        cuisine: '家常菜',
        difficulty: '简单',
        time: '15分钟',
        ingredients: ['鸡蛋', '温水', '盐'],
      },
    ];

    const filteredRecipes = recipes.filter(recipe => {
      const ingredientMatch =
        !ingredient || recipe.ingredients.some(ing => ing.includes(ingredient));
      const cuisineMatch = cuisine === 'all' || recipe.cuisine === cuisine;
      const difficultyMatch = difficulty === 'all' || recipe.difficulty === difficulty;
      return ingredientMatch && cuisineMatch && difficultyMatch;
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle>菜谱搜索</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">食材</label>
              <input
                value={ingredient}
                onChange={e => setIngredient(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="输入食材名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">菜系</label>
              <select
                value={cuisine}
                onChange={e => setCuisine(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">全部</option>
                <option value="川菜">川菜</option>
                <option value="鲁菜">鲁菜</option>
                <option value="粤菜">粤菜</option>
                <option value="家常菜">家常菜</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">难度</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">全部</option>
                <option value="简单">简单</option>
                <option value="中等">中等</option>
                <option value="困难">困难</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredRecipes.map((recipe, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{recipe.name}</h4>
                  <span className="text-sm text-muted-foreground">{recipe.time}</span>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                  <span>菜系: {recipe.cuisine}</span>
                  <span>难度: {recipe.difficulty}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">主要食材: </span>
                  {recipe.ingredients.join('、')}
                </div>
              </div>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">没有找到匹配的菜谱</div>
          )}
        </CardContent>
      </Card>
    );
  };

  // 营养计算
  const NutritionCalculator = () => {
    const [foods, setFoods] = useState<FoodItem[]>([
      { name: '米饭', amount: 100, calories: 116, protein: 2.6, carbs: 25.9, fat: 0.3 },
    ]);

    const addFood = () => {
      setFoods([...foods, { name: '', amount: 100, calories: 0, protein: 0, carbs: 0, fat: 0 }]);
    };

    const updateFood = (index: number, field: keyof FoodItem, value: string | number) => {
      const newFoods = [...foods];
      newFoods[index] = {
        ...newFoods[index],
        [field]: field === 'name' ? String(value) : Number(value)
      };
      setFoods(newFoods);
    };

    const removeFood = (index: number) => {
      setFoods(foods.filter((_, i) => i !== index));
    };

    const totalNutrition = foods.reduce(
      (total, food) => {
        const ratio = food.amount / 100;
        return {
          calories: total.calories + food.calories * ratio,
          protein: total.protein + food.protein * ratio,
          carbs: total.carbs + food.carbs * ratio,
          fat: total.fat + food.fat * ratio,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle>营养计算</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {foods.map((food, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-2 items-center p-3 border rounded-lg"
              >
                <input
                  value={food.name}
                  onChange={e => updateFood(index, 'name', e.target.value)}
                  className="p-1 border rounded text-sm"
                  placeholder="食物名称"
                />
                <input
                  type="number"
                  value={food.amount}
                  onChange={e => updateFood(index, 'amount', Number(e.target.value))}
                  className="p-1 border rounded text-sm"
                  placeholder="重量(g)"
                />
                <input
                  type="number"
                  value={food.calories}
                  onChange={e => updateFood(index, 'calories', Number(e.target.value))}
                  className="p-1 border rounded text-sm"
                  placeholder="卡路里"
                />
                <input
                  type="number"
                  value={food.protein}
                  onChange={e => updateFood(index, 'protein', Number(e.target.value))}
                  className="p-1 border rounded text-sm"
                  placeholder="蛋白质"
                />
                <input
                  type="number"
                  value={food.carbs}
                  onChange={e => updateFood(index, 'carbs', Number(e.target.value))}
                  className="p-1 border rounded text-sm"
                  placeholder="碳水"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeFood(index)}
                  className="text-xs"
                >
                  删除
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={addFood} variant="outline" className="w-full">
            添加食物
          </Button>

          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <div className="text-lg font-bold text-red-600">
                {totalNutrition.calories.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">卡路里</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-600">
                {totalNutrition.protein.toFixed(1)}g
              </div>
              <div className="text-sm text-muted-foreground">蛋白质</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-lg font-bold text-green-600">
                {totalNutrition.carbs.toFixed(1)}g
              </div>
              <div className="text-sm text-muted-foreground">碳水化合物</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-center">
              <div className="text-lg font-bold text-yellow-600">
                {totalNutrition.fat.toFixed(1)}g
              </div>
              <div className="text-sm text-muted-foreground">脂肪</div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">营养建议</h4>
            <div className="text-sm space-y-1">
              <div>• 成年人每日推荐摄入: 2000-2500卡路里</div>
              <div>• 蛋白质: 体重(kg) × 0.8-1.2g</div>
              <div>• 碳水化合物: 总热量的45-65%</div>
              <div>• 脂肪: 总热量的20-35%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 购物清单
  const ShoppingList = () => {
    const [items, setItems] = useState([
      { name: '鸡蛋', quantity: '1盒', category: '蛋类', checked: false },
      { name: '牛奶', quantity: '1瓶', category: '乳制品', checked: false },
    ]);
    const [newItem, setNewItem] = useState({ name: '', quantity: '', category: '蔬菜' });

    const categories = ['蔬菜', '肉类', '蛋类', '乳制品', '调料', '主食', '水果', '其他'];

    const addItem = () => {
      if (newItem.name.trim()) {
        setItems([...items, { ...newItem, checked: false }]);
        setNewItem({ name: '', quantity: '', category: '蔬菜' });
      }
    };

    const toggleItem = (index: number) => {
      const newItems = [...items];
      newItems[index].checked = !newItems[index].checked;
      setItems(newItems);
    };

    const removeItem = (index: number) => {
      setItems(items.filter((_, i) => i !== index));
    };

    const groupedItems = categories.reduce((groups, category) => {
      groups[category] = items.filter(item => item.category === category);
      return groups;
    }, {} as { [key: string]: typeof items });

    return (
      <Card>
        <CardHeader>
          <CardTitle>购物清单</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <input
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              className="p-2 border rounded-lg"
              placeholder="商品名称"
            />
            <input
              value={newItem.quantity}
              onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
              className="p-2 border rounded-lg"
              placeholder="数量"
            />
            <select
              value={newItem.category}
              onChange={e => setNewItem({ ...newItem, category: e.target.value })}
              className="p-2 border rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Button onClick={addItem}>添加</Button>
          </div>

          <div className="space-y-4">
            {categories.map(category => {
              const categoryItems = groupedItems[category];
              if (categoryItems.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="font-medium mb-2 text-sm text-muted-foreground">{category}</h4>
                  <div className="space-y-2">
                    {categoryItems.map((item, _index) => { // index 重命名为 _index
                      const globalIndex = items.findIndex(i => i === item);
                      return (
                        <div
                          key={globalIndex}
                          className="flex items-center gap-3 p-2 border rounded-lg"
                        >
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleItem(globalIndex)}
                            className="w-4 h-4"
                          />
                          <div
                            className={`flex-1 ${
                              item.checked ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            <span className="font-medium">{item.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {item.quantity}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeItem(globalIndex)}
                            className="text-xs"
                          >
                            删除
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm">
              总计: {items.length} 项商品，已完成: {items.filter(item => item.checked).length} 项
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 定时提醒
  const CookingTimer = () => {
    const [timers, setTimers] = useState<
      Array<{
        id: number;
        name: string;
        duration: number;
        remaining: number;
        isRunning: boolean;
      }>
    >([]);
    const [newTimer, setNewTimer] = useState({ name: '', minutes: 10 });

    const addTimer = () => {
      if (newTimer.name.trim()) {
        const timer = {
          id: Date.now(),
          name: newTimer.name,
          duration: newTimer.minutes * 60,
          remaining: newTimer.minutes * 60,
          isRunning: false,
        };
        setTimers([...timers, timer]);
        setNewTimer({ name: '', minutes: 10 });
      }
    };

    const startTimer = (id: number) => {
      setTimers(timers.map(timer => (timer.id === id ? { ...timer, isRunning: true } : timer)));
    };

    const pauseTimer = (id: number) => {
      setTimers(timers.map(timer => (timer.id === id ? { ...timer, isRunning: false } : timer)));
    };

    const resetTimer = (id: number) => {
      setTimers(
        timers.map(timer =>
          timer.id === id ? { ...timer, remaining: timer.duration, isRunning: false } : timer
        )
      );
    };

    const removeTimer = (id: number) => {
      setTimers(timers.filter(timer => timer.id !== id));
    };

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 模拟计时器倒计时
    React.useEffect(() => {
      const interval = setInterval(() => {
        setTimers(
          timers.map(timer => {
            if (timer.isRunning && timer.remaining > 0) {
              return { ...timer, remaining: timer.remaining - 1 };
            }
            return timer;
          })
        );
      }, 1000);

      return () => clearInterval(interval);
    }, [timers]);

    return (
      <Card>
        <CardHeader>
          <CardTitle>定时提醒</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <input
              value={newTimer.name}
              onChange={e => setNewTimer({ ...newTimer, name: e.target.value })}
              className="p-2 border rounded-lg"
              placeholder="定时器名称"
            />
            <input
              type="number"
              value={newTimer.minutes}
              onChange={e => setNewTimer({ ...newTimer, minutes: Number(e.target.value) })}
              className="p-2 border rounded-lg"
              placeholder="分钟"
              min="1"
            />
            <Button onClick={addTimer}>添加定时器</Button>
          </div>

          <div className="space-y-3">
            {timers.map(timer => (
              <div key={timer.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{timer.name}</h4>
                  <div
                    className={`text-2xl font-mono ${
                      timer.remaining === 0 ? 'text-red-600' : 'text-blue-600'
                    }`}
                  >
                    {formatTime(timer.remaining)}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!timer.isRunning ? (
                    <Button size="sm" onClick={() => startTimer(timer.id)}>
                      开始
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => pauseTimer(timer.id)}>
                      暂停
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => resetTimer(timer.id)}>
                    重置
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => removeTimer(timer.id)}>
                    删除
                  </Button>
                </div>
                {timer.remaining === 0 && (
                  <div className="mt-2 text-red-600 font-medium">⏰ 时间到！</div>
                )}
              </div>
            ))}
          </div>

          {timers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">暂无定时器</div>
          )}

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium mb-2">常用烹饪时间</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>• 煮蛋: 6-8分钟</div>
              <div>• 蒸蛋羹: 10-15分钟</div>
              <div>• 煮面条: 8-12分钟</div>
              <div>• 蒸米饭: 20-25分钟</div>
              <div>• 炖汤: 60-120分钟</div>
              <div>• 烤鸡翅: 25-30分钟</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { key: 'recipes', name: '菜谱搜索', icon: ChefHat },
    { key: 'nutrition', name: '营养计算', icon: Calculator },
    { key: 'shopping', name: '购物清单', icon: ShoppingCart },
    { key: 'timer', name: '定时提醒', icon: Timer },
  ] as const;

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">功能介绍</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <strong>菜谱搜索</strong>：根据食材、菜系、难度搜索菜谱
          </li>
          <li>
            • <strong>营养计算</strong>：计算食物的营养成分和热量
          </li>
          <li>
            • <strong>购物清单</strong>：管理购买食材的清单
          </li>
          <li>
            • <strong>定时提醒</strong>：设置烹饪过程中的定时器
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">使用建议</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 合理搭配营养，保持饮食均衡</li>
          <li>• 提前规划购物清单，避免遗漏</li>
          <li>• 使用定时器确保烹饪时间准确</li>
          <li>• 根据个人口味调整菜谱配方</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="烹饪工具集"
      description="烹饪助手工具，包括菜谱搜索、营养计算、购物清单、定时提醒"
      icon={ChefHat}
      helpContent={helpContent}
    >
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
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

      {activeTab === 'recipes' && <RecipeSearch />}
      {activeTab === 'nutrition' && <NutritionCalculator />}
      {activeTab === 'shopping' && <ShoppingList />}
      {activeTab === 'timer' && <CookingTimer />}
    </ToolLayout>
  );
}