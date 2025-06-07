'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Shuffle, Copy, Download } from 'lucide-react';
import Link from 'next/link';

export default function NonsenseGeneratorPage() {
  const [activeTab, setActiveTab] = useState<'poetry' | 'prose' | 'novel' | 'speech'>('poetry');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // 废话诗歌生成器
  const PoetryGenerator = () => {
    const [theme, setTheme] = useState('爱情');
    const [lines, setLines] = useState(8);

    const generatePoetry = () => {
      setIsGenerating(true);
      setTimeout(() => {
        const poetry = generateNonsensePoetry(theme, lines);
        setGeneratedText(poetry);
        setIsGenerating(false);
      }, 800);
    };

    const generateNonsensePoetry = (theme: string, lineCount: number) => {
      const poetryTemplates = [
        `${theme}就像是${theme}`,
        `没有${theme}的${theme}不是真正的${theme}`,
        `当${theme}遇见${theme}，${theme}就不再是${theme}`,
        `${theme}的${theme}，${theme}着${theme}`,
        `如果${theme}是${theme}，那么${theme}就是${theme}`,
        `${theme}啊${theme}，你为什么是${theme}`,
        `世界上最远的距离，是${theme}到${theme}的距离`,
        `${theme}不${theme}，${theme}还是${theme}`
      ];

      const adjectives = ['美丽的', '忧伤的', '快乐的', '神秘的', '温柔的', '激情的', '深邃的', '纯真的'];
      const nouns = ['心灵', '梦想', '时光', '回忆', '希望', '眼泪', '微笑', '拥抱'];
      const verbs = ['飞翔', '流淌', '绽放', '消逝', '闪耀', '沉睡', '苏醒', '歌唱'];

      let poetry = `《${theme}之歌》\n\n`;
      
      for (let i = 0; i < lineCount; i++) {
        if (Math.random() > 0.5) {
          const template = poetryTemplates[Math.floor(Math.random() * poetryTemplates.length)];
          poetry += template + '\n';
        } else {
          const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
          const noun = nouns[Math.floor(Math.random() * nouns.length)];
          const verb = verbs[Math.floor(Math.random() * verbs.length)];
          poetry += `${adj}${noun}在${verb}，就像${theme}一样\n`;
        }
      }

      poetry += `\n——致${theme}的无限遐想`;
      return poetry;
    };

    const themes = ['爱情', '友情', '青春', '梦想', '时光', '自然', '生命', '希望'];

    return (
      <Card>
        <CardHeader><CardTitle>废话诗歌生成器</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm mb-2">诗歌主题</label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="输入诗歌主题..."
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">预设主题</label>
            <div className="grid grid-cols-4 gap-2">
              {themes.map((t, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(t)}
                  className="text-xs"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">诗歌行数: {lines}</label>
            <input
              type="range"
              min="4"
              max="16"
              value={lines}
              onChange={(e) => setLines(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <Button onClick={generatePoetry} disabled={isGenerating} className="w-full">
            <Shuffle className="h-4 w-4 mr-2" />
            {isGenerating ? '创作中...' : '生成诗歌'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  // 废话散文生成器
  const ProseGenerator = () => {
    const [topic, setTopic] = useState('人生感悟');
    const [length, setLength] = useState(300);

    const generateProse = () => {
      setIsGenerating(true);
      setTimeout(() => {
        const prose = generateNonsenseProse(topic, length);
        setGeneratedText(prose);
        setIsGenerating(false);
      }, 1000);
    };

    const generateNonsenseProse = (topic: string, targetLength: number) => {
      const proseTemplates = [
        `${topic}是什么？${topic}就是${topic}。`,
        `当我们谈论${topic}的时候，我们实际上在谈论${topic}。`,
        `${topic}的本质在于${topic}，而${topic}的意义在于${topic}。`,
        `如果说${topic}是${topic}，那么${topic}就是${topic}的${topic}。`,
        `${topic}不仅仅是${topic}，更是${topic}的${topic}。`
      ];

      const philosophicalWords = [
        '存在', '本质', '意义', '价值', '真理', '美好', '永恒', '瞬间',
        '深刻', '浅薄', '复杂', '简单', '真实', '虚幻', '光明', '黑暗'
      ];

      let prose = `关于${topic}的思考\n\n`;
      let currentLength = prose.length;

      while (currentLength < targetLength) {
        if (Math.random() > 0.6) {
          const template = proseTemplates[Math.floor(Math.random() * proseTemplates.length)];
          prose += template + ' ';
          currentLength += template.length + 1;
        } else {
          const word1 = philosophicalWords[Math.floor(Math.random() * philosophicalWords.length)];
          const word2 = philosophicalWords[Math.floor(Math.random() * philosophicalWords.length)];
          const sentence = `${topic}的${word1}体现在${word2}之中，而${word2}又反映了${topic}的${word1}。`;
          prose += sentence + ' ';
          currentLength += sentence.length + 1;
        }
      }

      prose += `\n\n总而言之，${topic}就是${topic}，这是毋庸置疑的。`;
      return prose;
    };

    const topics = ['人生感悟', '时间哲学', '存在意义', '生命价值', '爱的真谛', '美的本质'];

    return (
      <Card>
        <CardHeader><CardTitle>废话散文生成器</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm mb-2">散文主题</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="输入散文主题..."
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">预设主题</label>
            <div className="grid grid-cols-3 gap-2">
              {topics.map((t, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopic(t)}
                  className="text-xs"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">文章长度: {length} 字</label>
            <input
              type="range"
              min="200"
              max="800"
              step="50"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <Button onClick={generateProse} disabled={isGenerating} className="w-full">
            <Shuffle className="h-4 w-4 mr-2" />
            {isGenerating ? '创作中...' : '生成散文'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  // 废话小说生成器
  const NovelGenerator = () => {
    const [protagonist, setProtagonist] = useState('小明');
    const [setting, setSetting] = useState('学校');

    const generateNovel = () => {
      setIsGenerating(true);
      setTimeout(() => {
        const novel = generateNonsenseNovel(protagonist, setting);
        setGeneratedText(novel);
        setIsGenerating(false);
      }, 1200);
    };

    const generateNonsenseNovel = (protagonist: string, setting: string) => {
      const novelTemplates = [
        `${protagonist}在${setting}里遇到了${protagonist}。`,
        `当${protagonist}看到${setting}的时候，${protagonist}想起了${setting}。`,
        `${protagonist}对${setting}说："${setting}啊，你就是${setting}。"`,
        `在${setting}里，${protagonist}发现了${protagonist}的${setting}。`,
        `${protagonist}的${setting}让${protagonist}想起了${setting}的${protagonist}。`
      ];

      let novel = `《${protagonist}在${setting}的故事》\n\n`;
      
      novel += `第一章：${protagonist}的发现\n\n`;
      novel += `${protagonist}是一个普通的${protagonist}，生活在${setting}里。`;
      novel += `每天，${protagonist}都会在${setting}里思考关于${protagonist}的问题。`;
      novel += `这一天，${protagonist}突然意识到，${protagonist}就是${protagonist}，而${setting}就是${setting}。\n\n`;

      novel += `第二章：${setting}的秘密\n\n`;
      for (let i = 0; i < 3; i++) {
        const template = novelTemplates[Math.floor(Math.random() * novelTemplates.length)];
        novel += template + ' ';
      }
      novel += `${protagonist}终于明白了${setting}的真正含义。\n\n`;

      novel += `第三章：${protagonist}的觉悟\n\n`;
      novel += `经过深思熟虑，${protagonist}决定接受${protagonist}就是${protagonist}这个事实。`;
      novel += `从此以后，${protagonist}在${setting}里过着${protagonist}的生活，`;
      novel += `因为${protagonist}知道，${setting}里的${protagonist}才是真正的${protagonist}。\n\n`;

      novel += `全文完。`;
      return novel;
    };

    const protagonists = ['小明', '小红', '小李', '小王', '小张', '阿强'];
    const settings = ['学校', '公司', '家里', '公园', '咖啡厅', '图书馆'];

    return (
      <Card>
        <CardHeader><CardTitle>废话小说生成器</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm mb-2">主人公姓名</label>
            <input
              type="text"
              value={protagonist}
              onChange={(e) => setProtagonist(e.target.value)}
              placeholder="输入主人公姓名..."
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">故事场景</label>
            <input
              type="text"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              placeholder="输入故事场景..."
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">预设主人公</label>
              <div className="grid grid-cols-3 gap-1">
                {protagonists.map((p, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setProtagonist(p)}
                    className="text-xs"
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">预设场景</label>
              <div className="grid grid-cols-3 gap-1">
                {settings.map((s, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setSetting(s)}
                    className="text-xs"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={generateNovel} disabled={isGenerating} className="w-full">
            <Shuffle className="h-4 w-4 mr-2" />
            {isGenerating ? '创作中...' : '生成小说'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  // 废话演讲生成器
  const SpeechGenerator = () => {
    const [speechTopic, setSpeechTopic] = useState('成功的秘诀');
    const [duration, setDuration] = useState(5);

    const generateSpeech = () => {
      setIsGenerating(true);
      setTimeout(() => {
        const speech = generateNonsenseSpeech(speechTopic, duration);
        setGeneratedText(speech);
        setIsGenerating(false);
      }, 1000);
    };

    const generateNonsenseSpeech = (topic: string, minutes: number) => {
      const speechOpeners = [
        `亲爱的朋友们，今天我想和大家分享关于${topic}的思考。`,
        `各位，${topic}是我们每个人都关心的话题。`,
        `让我们一起来探讨${topic}这个重要的主题。`
      ];

      const speechPoints = [
        `首先，我们要明确什么是${topic}。${topic}就是${topic}，这是毫无疑问的。`,
        `其次，${topic}的重要性不言而喻。没有${topic}，就没有${topic}。`,
        `第三，我们要学会如何实现${topic}。实现${topic}的关键在于${topic}。`,
        `最后，${topic}不仅仅是${topic}，更是我们生活的${topic}。`
      ];

      const speechClosers = [
        `总之，${topic}是我们每个人都应该追求的目标。`,
        `让我们一起为了${topic}而努力！`,
        `谢谢大家，愿${topic}与我们同在！`
      ];

      let speech = `《${topic}》演讲稿\n\n`;
      
      // 开场
      speech += speechOpeners[Math.floor(Math.random() * speechOpeners.length)] + '\n\n';
      
      // 主体（根据时长调整内容）
      const pointsCount = Math.max(3, Math.floor(minutes * 0.8));
      for (let i = 0; i < pointsCount; i++) {
        speech += speechPoints[i % speechPoints.length] + '\n\n';
        
        // 添加一些废话填充
        speech += `正如古人所说，${topic}者，${topic}也。这句话虽然简单，但却蕴含着深刻的道理。`;
        speech += `当我们真正理解了${topic}的含义，我们就会发现，${topic}其实就在我们身边。\n\n`;
      }
      
      // 结尾
      speech += speechClosers[Math.floor(Math.random() * speechClosers.length)];
      
      speech += `\n\n预计演讲时长：${duration}分钟`;
      return speech;
    };

    const speechTopics = ['成功的秘诀', '幸福的真谛', '梦想的力量', '坚持的意义', '创新的价值'];

    return (
      <Card>
        <CardHeader><CardTitle>废话演讲生成器</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm mb-2">演讲主题</label>
            <input
              type="text"
              value={speechTopic}
              onChange={(e) => setSpeechTopic(e.target.value)}
              placeholder="输入演讲主题..."
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">预设主题</label>
            <div className="grid grid-cols-2 gap-2">
              {speechTopics.map((t, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setSpeechTopic(t)}
                  className="text-xs"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">演讲时长: {duration} 分钟</label>
            <input
              type="range"
              min="3"
              max="15"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <Button onClick={generateSpeech} disabled={isGenerating} className="w-full">
            <Shuffle className="h-4 w-4 mr-2" />
            {isGenerating ? '创作中...' : '生成演讲稿'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      alert('内容已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const downloadText = () => {
    const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `废话文学作品.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { key: 'poetry', name: '废话诗歌', icon: BookOpen },
    { key: 'prose', name: '废话散文', icon: BookOpen },
    { key: 'novel', name: '废话小说', icon: BookOpen },
    { key: 'speech', name: '废话演讲', icon: BookOpen },
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
          <BookOpen className="h-8 w-8" />
          废话文学生成器
        </h1>
        <p className="text-muted-foreground mt-2">
          生成各种废话文学作品，包括废话诗歌、散文、小说和演讲稿
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：生成器选择和配置 */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="flex border-b">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as 'poetry' | 'prose' | 'novel' | 'speech')}
                      className={`flex-1 p-3 text-center border-b-2 transition-colors flex items-center justify-center gap-2 text-sm ${
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

          {activeTab === 'poetry' && <PoetryGenerator />}
          {activeTab === 'prose' && <ProseGenerator />}
          {activeTab === 'novel' && <NovelGenerator />}
          {activeTab === 'speech' && <SpeechGenerator />}
        </div>

        {/* 右侧：生成结果 */}
        <Card>
          <CardHeader>
            <CardTitle>生成的作品</CardTitle>
            {generatedText && (
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex items-center gap-2">
                  <Copy className="h-3 w-3" />
                  复制
                </Button>
                <Button onClick={downloadText} variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-3 w-3" />
                  下载
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">正在创作废话文学...</span>
              </div>
            ) : generatedText ? (
              <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {generatedText}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground h-64 flex items-center justify-center">
                <div>
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>选择文学类型并开始创作</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <h4 className="font-medium mb-2 text-purple-800">创作说明</h4>
        <div className="text-sm text-purple-700 space-y-1">
          <div>• 废话文学是一种特殊的文学形式，以循环论证和同义反复为特色</div>
          <div>• 生成的作品仅供娱乐和创意启发，请勿用于正式场合</div>
          <div>• 可以作为幽默素材或创意写作的灵感来源</div>
          <div>• 支持多种文学形式：诗歌、散文、小说、演讲稿</div>
        </div>
      </div>
    </div>
  );
}