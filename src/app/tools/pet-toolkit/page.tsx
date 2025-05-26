'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Calendar, Stethoscope, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function PetToolkitPage() {
  const [activeTab, setActiveTab] = useState<'feeding' | 'health' | 'schedule' | 'supplies'>('feeding');

  // 喂养计划
  const FeedingPlan = () => {
    const [petType, setPetType] = useState('dog');
    const [age, setAge] = useState('adult');
    const [weight, setWeight] = useState(10);
    const [activity, setActivity] = useState('normal');

    const calculateFeeding = () => {
      let baseAmount = 0;
      if (petType === 'dog') {
        baseAmount = weight * 30; // 基础卡路里需求
      } else if (petType === 'cat') {
        baseAmount = weight * 70;
      }

      // 根据年龄调整
      if (age === 'puppy' || age === 'kitten') baseAmount *= 2;
      if (age === 'senior') baseAmount *= 0.8;

      // 根据活动量调整
      if (activity === 'low') baseAmount *= 0.8;
      if (activity === 'high') baseAmount *= 1.4;

      return Math.round(baseAmount);
    };

    const dailyCalories = calculateFeeding();
    const feedingTimes = age === 'puppy' || age === 'kitten' ? 3 : 2;
    const perMealAmount = Math.round(dailyCalories / feedingTimes);

    return (
      <Card>
        <CardHeader><CardTitle>喂养计划</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">宠物类型</label>
              <select
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="dog">狗狗</option>
                <option value="cat">猫咪</option>
                <option value="rabbit">兔子</option>
                <option value="bird">鸟类</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">年龄阶段</label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="puppy">幼体</option>
                <option value="adult">成年</option>
                <option value="senior">老年</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">体重 (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="0.5"
                max="100"
                step="0.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">活动量</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="low">低</option>
                <option value="normal">正常</option>
                <option value="high">高</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-600">{dailyCalories}</div>
              <div className="text-sm text-muted-foreground">日需卡路里</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-lg font-bold text-green-600">{feedingTimes}</div>
              <div className="text-sm text-muted-foreground">每日餐数</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-lg font-bold text-purple-600">{perMealAmount}</div>
              <div className="text-sm text-muted-foreground">每餐卡路里</div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium mb-2">喂养建议</h4>
            <div className="text-sm space-y-1">
              {petType === 'dog' && (
                <>
                  <div>• 成犬每天喂食2次，幼犬3-4次</div>
                  <div>• 避免喂食巧克力、洋葱、葡萄等有毒食物</div>
                  <div>• 保持充足的饮水</div>
                </>
              )}
              {petType === 'cat' && (
                <>
                  <div>• 成猫每天喂食2次，幼猫3-4次</div>
                  <div>• 猫咪需要牛磺酸，选择专用猫粮</div>
                  <div>• 避免喂食牛奶，可能导致腹泻</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 健康记录
  const HealthRecord = () => {
    const [records, setRecords] = useState([
      { date: '2024-01-15', type: '疫苗', description: '狂犬病疫苗', nextDate: '2025-01-15' },
      { date: '2024-02-01', type: '体检', description: '常规体检', nextDate: '2024-08-01' }
    ]);
    const [newRecord, setNewRecord] = useState({ date: '', type: '疫苗', description: '', nextDate: '' });

    const recordTypes = ['疫苗', '体检', '驱虫', '洗澡', '美容', '治疗', '其他'];

    const addRecord = () => {
      if (newRecord.date && newRecord.description) {
        setRecords([...records, newRecord]);
        setNewRecord({ date: '', type: '疫苗', description: '', nextDate: '' });
      }
    };

    const removeRecord = (index: number) => {
      setRecords(records.filter((_, i) => i !== index));
    };

    const getUpcomingReminders = () => {
      const today = new Date();
      const upcoming = records.filter(record => {
        if (!record.nextDate) return false;
        const nextDate = new Date(record.nextDate);
        const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays >= 0;
      });
      return upcoming;
    };

    const upcomingReminders = getUpcomingReminders();

    return (
      <Card>
        <CardHeader><CardTitle>健康记录</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <input
              type="date"
              value={newRecord.date}
              onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
              className="p-2 border rounded-lg"
            />
            <select
              value={newRecord.type}
              onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
              className="p-2 border rounded-lg"
            >
              {recordTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              value={newRecord.description}
              onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
              className="p-2 border rounded-lg"
              placeholder="描述"
            />
            <input
              type="date"
              value={newRecord.nextDate}
              onChange={(e) => setNewRecord({ ...newRecord, nextDate: e.target.value })}
              className="p-2 border rounded-lg"
              placeholder="下次日期"
            />
          </div>
          <Button onClick={addRecord} className="w-full">添加记录</Button>

          {upcomingReminders.length > 0 && (
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium mb-2 text-red-600">⚠️ 即将到期提醒</h4>
              {upcomingReminders.map((reminder, index) => (
                <div key={index} className="text-sm">
                  {reminder.type}: {reminder.description} - {reminder.nextDate}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {records.map((record, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{record.type}: {record.description}</div>
                    <div className="text-sm text-muted-foreground">
                      日期: {record.date}
                      {record.nextDate && ` | 下次: ${record.nextDate}`}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeRecord(index)}
                    className="text-xs"
                  >
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">健康提醒</h4>
            <div className="text-sm space-y-1">
              <div>• 疫苗: 每年接种狂犬病疫苗</div>
              <div>• 驱虫: 每3个月进行一次体内外驱虫</div>
              <div>• 体检: 每年进行一次全面体检</div>
              <div>• 牙齿: 定期检查和清洁牙齿</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 日程安排
  const PetSchedule = () => {
    const [events, setEvents] = useState([
      { time: '07:00', activity: '晨间喂食', type: 'feeding' },
      { time: '08:00', activity: '晨间散步', type: 'exercise' },
      { time: '19:00', activity: '晚间喂食', type: 'feeding' },
      { time: '20:00', activity: '晚间散步', type: 'exercise' }
    ]);
    const [newEvent, setNewEvent] = useState({ time: '', activity: '', type: 'feeding' });

    const eventTypes = [
      { value: 'feeding', label: '喂食', color: 'bg-green-100 text-green-800' },
      { value: 'exercise', label: '运动', color: 'bg-blue-100 text-blue-800' },
      { value: 'grooming', label: '美容', color: 'bg-purple-100 text-purple-800' },
      { value: 'play', label: '玩耍', color: 'bg-yellow-100 text-yellow-800' },
      { value: 'medical', label: '医疗', color: 'bg-red-100 text-red-800' },
      { value: 'other', label: '其他', color: 'bg-gray-100 text-gray-800' }
    ];

    const addEvent = () => {
      if (newEvent.time && newEvent.activity) {
        setEvents([...events, newEvent].sort((a, b) => a.time.localeCompare(b.time)));
        setNewEvent({ time: '', activity: '', type: 'feeding' });
      }
    };

    const removeEvent = (index: number) => {
      setEvents(events.filter((_, i) => i !== index));
    };

    const getTypeInfo = (type: string) => {
      return eventTypes.find(t => t.value === type) || eventTypes[0];
    };

    return (
      <Card>
        <CardHeader><CardTitle>日程安排</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              className="p-2 border rounded-lg"
            />
            <input
              value={newEvent.activity}
              onChange={(e) => setNewEvent({ ...newEvent, activity: e.target.value })}
              className="p-2 border rounded-lg"
              placeholder="活动内容"
            />
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              className="p-2 border rounded-lg"
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <Button onClick={addEvent}>添加</Button>
          </div>

          <div className="space-y-2">
            {events.map((event, index) => {
              const typeInfo = getTypeInfo(event.type);
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {event.time}
                    </div>
                    <div className="font-medium">{event.activity}</div>
                    <span className={`text-xs px-2 py-1 rounded ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeEvent(index)}
                    className="text-xs"
                  >
                    删除
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-2">日常护理</h4>
              <div className="text-sm space-y-1">
                <div>• 每日梳毛，保持毛发整洁</div>
                <div>• 定期修剪指甲</div>
                <div>• 清洁耳朵和牙齿</div>
                <div>• 观察精神状态</div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">运动建议</h4>
              <div className="text-sm space-y-1">
                <div>• 小型犬: 每日30分钟</div>
                <div>• 中型犬: 每日60分钟</div>
                <div>• 大型犬: 每日90分钟</div>
                <div>• 猫咪: 每日15-30分钟</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 用品购买
  const PetSupplies = () => {
    const [category, setCategory] = useState('food');
    const [supplies, setSupplies] = useState([
      { name: '狗粮', category: 'food', price: 150, brand: '皇家', rating: 4.8 },
      { name: '猫砂', category: 'hygiene', price: 80, brand: '蓝钻', rating: 4.6 },
      { name: '宠物玩具球', category: 'toys', price: 25, brand: '通用', rating: 4.5 }
    ]);

    const categories = [
      { value: 'food', label: '食品' },
      { value: 'toys', label: '玩具' },
      { value: 'hygiene', label: '清洁用品' },
      { value: 'medical', label: '医疗用品' },
      { value: 'accessories', label: '配件' }
    ];

    const filteredSupplies = supplies.filter(supply => supply.category === category);

    return (
      <Card>
        <CardHeader><CardTitle>用品购买</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {filteredSupplies.map((supply, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{supply.name}</div>
                    <div className="text-sm text-muted-foreground">
                      品牌: {supply.brand} | 评分: {supply.rating}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">¥{supply.price}</div>
                    <Button size="sm">加入购物车</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium mb-2">购买建议</h4>
            <div className="text-sm space-y-1">
              <div>• 选择适合宠物年龄和体型的产品</div>
              <div>• 查看产品成分和营养标签</div>
              <div>• 关注用户评价和专业推荐</div>
              <div>• 比较不同品牌的性价比</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const tabs = [
    { key: 'feeding', name: '喂养计划', icon: Heart },
    { key: 'health', name: '健康记录', icon: Stethoscope },
    { key: 'schedule', name: '日程安排', icon: Calendar },
    { key: 'supplies', name: '用品购买', icon: ShoppingBag },
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
          <Heart className="h-8 w-8" />
          宠物工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          宠物护理工具，包括喂养计划、健康记录、疫苗提醒、用品购买
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

      {activeTab === 'feeding' && <FeedingPlan />}
      {activeTab === 'health' && <HealthRecord />}
      {activeTab === 'schedule' && <PetSchedule />}
      {activeTab === 'supplies' && <PetSupplies />}
    </div>
  );
}
