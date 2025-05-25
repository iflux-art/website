'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Search, Smile } from 'lucide-react';
import Link from 'next/link';

// Emoji 数据
const EMOJI_CATEGORIES = {
  smileys: {
    name: '笑脸与人物',
    emojis: [
      { emoji: '😀', name: '开心', keywords: ['开心', '笑', '高兴'] },
      { emoji: '😃', name: '大笑', keywords: ['大笑', '开心', '兴奋'] },
      { emoji: '😄', name: '笑眯眯', keywords: ['笑眯眯', '开心', '愉快'] },
      { emoji: '😁', name: '咧嘴笑', keywords: ['咧嘴笑', '开心', '满意'] },
      { emoji: '😆', name: '哈哈', keywords: ['哈哈', '大笑', '搞笑'] },
      { emoji: '😅', name: '苦笑', keywords: ['苦笑', '尴尬', '汗'] },
      { emoji: '🤣', name: '笑哭', keywords: ['笑哭', '爆笑', '太好笑'] },
      { emoji: '😂', name: '喜极而泣', keywords: ['喜极而泣', '笑哭', '感动'] },
      { emoji: '🙂', name: '微笑', keywords: ['微笑', '友好', '礼貌'] },
      { emoji: '🙃', name: '倒脸', keywords: ['倒脸', '无奈', '调皮'] },
      { emoji: '😉', name: '眨眼', keywords: ['眨眼', '调皮', '暗示'] },
      { emoji: '😊', name: '害羞', keywords: ['害羞', '开心', '温和'] },
      { emoji: '😇', name: '天使', keywords: ['天使', '纯洁', '善良'] },
      { emoji: '🥰', name: '爱心眼', keywords: ['爱心眼', '喜欢', '爱'] },
      { emoji: '😍', name: '花痴', keywords: ['花痴', '爱慕', '迷恋'] },
      { emoji: '🤩', name: '星星眼', keywords: ['星星眼', '崇拜', '兴奋'] },
      { emoji: '😘', name: '飞吻', keywords: ['飞吻', '亲吻', '爱'] },
      { emoji: '😗', name: '亲亲', keywords: ['亲亲', '亲吻', '温柔'] },
      { emoji: '😚', name: '闭眼亲', keywords: ['闭眼亲', '亲吻', '甜蜜'] },
      { emoji: '😙', name: '微笑亲', keywords: ['微笑亲', '亲吻', '开心'] },
      { emoji: '😋', name: '美味', keywords: ['美味', '好吃', '馋'] },
      { emoji: '😛', name: '吐舌', keywords: ['吐舌', '调皮', '淘气'] },
      { emoji: '😜', name: '眨眼吐舌', keywords: ['眨眼吐舌', '调皮', '搞怪'] },
      { emoji: '🤪', name: '疯狂', keywords: ['疯狂', '搞怪', '兴奋'] },
      { emoji: '😝', name: '闭眼吐舌', keywords: ['闭眼吐舌', '调皮', '开心'] },
    ]
  },
  animals: {
    name: '动物与自然',
    emojis: [
      { emoji: '🐶', name: '狗', keywords: ['狗', '小狗', '宠物'] },
      { emoji: '🐱', name: '猫', keywords: ['猫', '小猫', '宠物'] },
      { emoji: '🐭', name: '老鼠', keywords: ['老鼠', '小鼠', '动物'] },
      { emoji: '🐹', name: '仓鼠', keywords: ['仓鼠', '小动物', '可爱'] },
      { emoji: '🐰', name: '兔子', keywords: ['兔子', '小兔', '可爱'] },
      { emoji: '🦊', name: '狐狸', keywords: ['狐狸', '聪明', '动物'] },
      { emoji: '🐻', name: '熊', keywords: ['熊', '大熊', '动物'] },
      { emoji: '🐼', name: '熊猫', keywords: ['熊猫', '国宝', '可爱'] },
      { emoji: '🐨', name: '考拉', keywords: ['考拉', '树袋熊', '澳洲'] },
      { emoji: '🐯', name: '老虎', keywords: ['老虎', '威猛', '动物'] },
      { emoji: '🦁', name: '狮子', keywords: ['狮子', '威猛', '王者'] },
      { emoji: '🐮', name: '牛', keywords: ['牛', '奶牛', '动物'] },
      { emoji: '🐷', name: '猪', keywords: ['猪', '小猪', '可爱'] },
      { emoji: '🐸', name: '青蛙', keywords: ['青蛙', '绿色', '动物'] },
      { emoji: '🐵', name: '猴子', keywords: ['猴子', '聪明', '调皮'] },
      { emoji: '🙈', name: '非礼勿视', keywords: ['非礼勿视', '害羞', '猴子'] },
      { emoji: '🙉', name: '非礼勿听', keywords: ['非礼勿听', '不听', '猴子'] },
      { emoji: '🙊', name: '非礼勿言', keywords: ['非礼勿言', '不说', '猴子'] },
      { emoji: '🐒', name: '猴脸', keywords: ['猴脸', '猴子', '动物'] },
      { emoji: '🦆', name: '鸭子', keywords: ['鸭子', '小鸭', '水鸟'] },
      { emoji: '🐧', name: '企鹅', keywords: ['企鹅', '南极', '可爱'] },
      { emoji: '🐦', name: '鸟', keywords: ['鸟', '小鸟', '飞行'] },
      { emoji: '🐤', name: '小鸡', keywords: ['小鸡', '幼鸟', '可爱'] },
      { emoji: '🐣', name: '破壳小鸡', keywords: ['破壳小鸡', '新生', '可爱'] },
      { emoji: '🐥', name: '正面小鸡', keywords: ['正面小鸡', '小鸡', '可爱'] },
    ]
  },
  food: {
    name: '食物与饮料',
    emojis: [
      { emoji: '🍎', name: '苹果', keywords: ['苹果', '水果', '健康'] },
      { emoji: '🍊', name: '橙子', keywords: ['橙子', '水果', '维C'] },
      { emoji: '🍋', name: '柠檬', keywords: ['柠檬', '酸', '水果'] },
      { emoji: '🍌', name: '香蕉', keywords: ['香蕉', '水果', '黄色'] },
      { emoji: '🍉', name: '西瓜', keywords: ['西瓜', '夏天', '解暑'] },
      { emoji: '🍇', name: '葡萄', keywords: ['葡萄', '水果', '紫色'] },
      { emoji: '🍓', name: '草莓', keywords: ['草莓', '甜', '红色'] },
      { emoji: '🍑', name: '樱桃', keywords: ['樱桃', '小', '红色'] },
      { emoji: '🍒', name: '樱桃对', keywords: ['樱桃对', '樱桃', '成对'] },
      { emoji: '🥝', name: '猕猴桃', keywords: ['猕猴桃', '绿色', '酸甜'] },
      { emoji: '🍅', name: '番茄', keywords: ['番茄', '西红柿', '红色'] },
      { emoji: '🥑', name: '牛油果', keywords: ['牛油果', '健康', '绿色'] },
      { emoji: '🍆', name: '茄子', keywords: ['茄子', '紫色', '蔬菜'] },
      { emoji: '🥒', name: '黄瓜', keywords: ['黄瓜', '绿色', '清爽'] },
      { emoji: '🥬', name: '青菜', keywords: ['青菜', '蔬菜', '健康'] },
      { emoji: '🥕', name: '胡萝卜', keywords: ['胡萝卜', '橙色', '营养'] },
      { emoji: '🌽', name: '玉米', keywords: ['玉米', '黄色', '粗粮'] },
      { emoji: '🍞', name: '面包', keywords: ['面包', '主食', '早餐'] },
      { emoji: '🥖', name: '法棍', keywords: ['法棍', '面包', '法式'] },
      { emoji: '🥨', name: '椒盐卷饼', keywords: ['椒盐卷饼', '面包', '德式'] },
      { emoji: '🧀', name: '奶酪', keywords: ['奶酪', '芝士', '乳制品'] },
      { emoji: '🥚', name: '鸡蛋', keywords: ['鸡蛋', '蛋白质', '营养'] },
      { emoji: '🍳', name: '煎蛋', keywords: ['煎蛋', '早餐', '美味'] },
      { emoji: '🥓', name: '培根', keywords: ['培根', '肉类', '早餐'] },
      { emoji: '🍖', name: '肉', keywords: ['肉', '肉类', '蛋白质'] },
    ]
  },
  activities: {
    name: '活动与运动',
    emojis: [
      { emoji: '⚽', name: '足球', keywords: ['足球', '运动', '球类'] },
      { emoji: '🏀', name: '篮球', keywords: ['篮球', '运动', '球类'] },
      { emoji: '🏈', name: '橄榄球', keywords: ['橄榄球', '美式', '运动'] },
      { emoji: '⚾', name: '棒球', keywords: ['棒球', '运动', '球类'] },
      { emoji: '🥎', name: '垒球', keywords: ['垒球', '运动', '球类'] },
      { emoji: '🎾', name: '网球', keywords: ['网球', '运动', '球类'] },
      { emoji: '🏐', name: '排球', keywords: ['排球', '运动', '球类'] },
      { emoji: '🏉', name: '橄榄球', keywords: ['橄榄球', '运动', '球类'] },
      { emoji: '🥏', name: '飞盘', keywords: ['飞盘', '运动', '户外'] },
      { emoji: '🎱', name: '台球', keywords: ['台球', '运动', '室内'] },
      { emoji: '🪀', name: '悠悠球', keywords: ['悠悠球', '玩具', '技巧'] },
      { emoji: '🏓', name: '乒乓球', keywords: ['乒乓球', '运动', '国球'] },
      { emoji: '🏸', name: '羽毛球', keywords: ['羽毛球', '运动', '球类'] },
      { emoji: '🏒', name: '冰球', keywords: ['冰球', '运动', '冰上'] },
      { emoji: '🏑', name: '曲棍球', keywords: ['曲棍球', '运动', '球类'] },
      { emoji: '🥍', name: '长曲棍球', keywords: ['长曲棍球', '运动', '球类'] },
      { emoji: '🏏', name: '板球', keywords: ['板球', '运动', '英式'] },
      { emoji: '🎯', name: '飞镖', keywords: ['飞镖', '运动', '精准'] },
      { emoji: '🪃', name: '回旋镖', keywords: ['回旋镖', '运动', '澳洲'] },
      { emoji: '🥊', name: '拳击', keywords: ['拳击', '运动', '格斗'] },
      { emoji: '🥋', name: '武术', keywords: ['武术', '运动', '格斗'] },
      { emoji: '🎪', name: '马戏团', keywords: ['马戏团', '娱乐', '表演'] },
      { emoji: '🎭', name: '戏剧', keywords: ['戏剧', '表演', '艺术'] },
      { emoji: '🩰', name: '芭蕾', keywords: ['芭蕾', '舞蹈', '艺术'] },
      { emoji: '🎨', name: '艺术', keywords: ['艺术', '绘画', '创作'] },
    ]
  },
  objects: {
    name: '物品与符号',
    emojis: [
      { emoji: '💻', name: '电脑', keywords: ['电脑', '笔记本', '工作'] },
      { emoji: '🖥️', name: '台式机', keywords: ['台式机', '电脑', '办公'] },
      { emoji: '🖨️', name: '打印机', keywords: ['打印机', '办公', '设备'] },
      { emoji: '⌨️', name: '键盘', keywords: ['键盘', '输入', '电脑'] },
      { emoji: '🖱️', name: '鼠标', keywords: ['鼠标', '点击', '电脑'] },
      { emoji: '🖲️', name: '轨迹球', keywords: ['轨迹球', '鼠标', '设备'] },
      { emoji: '💽', name: '光盘', keywords: ['光盘', 'CD', '存储'] },
      { emoji: '💾', name: '软盘', keywords: ['软盘', '保存', '存储'] },
      { emoji: '💿', name: 'CD', keywords: ['CD', '光盘', '音乐'] },
      { emoji: '📀', name: 'DVD', keywords: ['DVD', '光盘', '视频'] },
      { emoji: '🧮', name: '算盘', keywords: ['算盘', '计算', '传统'] },
      { emoji: '🎬', name: '电影', keywords: ['电影', '拍摄', '娱乐'] },
      { emoji: '📱', name: '手机', keywords: ['手机', '电话', '通讯'] },
      { emoji: '☎️', name: '电话', keywords: ['电话', '通讯', '联系'] },
      { emoji: '📞', name: '电话听筒', keywords: ['电话听筒', '通话', '联系'] },
      { emoji: '📟', name: '传呼机', keywords: ['传呼机', '通讯', '老式'] },
      { emoji: '📠', name: '传真机', keywords: ['传真机', '办公', '通讯'] },
      { emoji: '📺', name: '电视', keywords: ['电视', '娱乐', '观看'] },
      { emoji: '📻', name: '收音机', keywords: ['收音机', '音乐', '广播'] },
      { emoji: '🎙️', name: '麦克风', keywords: ['麦克风', '录音', '演讲'] },
      { emoji: '🎚️', name: '调音台', keywords: ['调音台', '音乐', '控制'] },
      { emoji: '🎛️', name: '控制旋钮', keywords: ['控制旋钮', '调节', '设备'] },
      { emoji: '🧭', name: '指南针', keywords: ['指南针', '方向', '导航'] },
      { emoji: '⏰', name: '闹钟', keywords: ['闹钟', '时间', '起床'] },
      { emoji: '⏲️', name: '定时器', keywords: ['定时器', '计时', '倒计时'] },
    ]
  }
};

export default function EmojiPickerPage() {
  const [selectedCategory, setSelectedCategory] = useState('smileys');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

  const copyEmoji = async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopiedEmoji(emoji);
      setTimeout(() => setCopiedEmoji(null), 1000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const filteredEmojis = () => {
    const category = EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES];
    if (!category) return [];

    if (!searchQuery) return category.emojis;

    return category.emojis.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link href="/tools">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回工具列表
          </Button>
        </Link>
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Smile className="h-8 w-8" />
          Emoji 选择器
        </h1>
        <p className="text-muted-foreground mt-2">
          浏览和复制 Emoji 表情符号，让你的文字更生动
        </p>
      </div>

      {/* 搜索框 */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索 Emoji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* 分类选择 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(key)}
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Emoji 网格 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES]?.name}
            {searchQuery && ` - 搜索结果`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {filteredEmojis().map((item, index) => (
              <button
                key={index}
                onClick={() => copyEmoji(item.emoji)}
                className="relative p-3 rounded-lg hover:bg-muted transition-colors group"
                title={item.name}
              >
                <span className="text-2xl">{item.emoji}</span>
                
                {/* 复制提示 */}
                {copiedEmoji === item.emoji && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    已复制!
                  </div>
                )}
                
                {/* 悬停提示 */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {item.name}
                </div>
              </button>
            ))}
          </div>
          
          {filteredEmojis().length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">没有找到匹配的 Emoji</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">如何使用</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 点击任意 Emoji 即可复制到剪贴板</li>
              <li>• 使用搜索框快速查找特定的 Emoji</li>
              <li>• 悬停在 Emoji 上查看名称</li>
              <li>• 支持中文关键词搜索</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">分类说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>笑脸与人物</strong>：各种表情和人物相关的 Emoji</li>
              <li>• <strong>动物与自然</strong>：动物、植物和自然相关的 Emoji</li>
              <li>• <strong>食物与饮料</strong>：各种食物和饮品的 Emoji</li>
              <li>• <strong>活动与运动</strong>：运动、娱乐活动相关的 Emoji</li>
              <li>• <strong>物品与符号</strong>：日常物品和各种符号</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
