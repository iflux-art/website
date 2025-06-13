'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/cards/card';
import { ArrowLeft, PenTool, Lightbulb, Target, Zap, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface Idea {
  angle: string;
  content: string;
}

interface Outline {
  structure: string[];
  details: Record<string, string>;
}

export default function ContentCreatorPage() {
  const [activeTab, setActiveTab] = useState<'title' | 'idea' | 'outline' | 'hook' | 'placeholder'>(
    'title'
  );
  const [copied, setCopied] = useState<string | null>(null);

  const copyContent = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 标题生成器
  const TitleGenerator = () => {
    const [keyword, setKeyword] = useState('');
    const [platform, setPlatform] = useState('wechat');
    const [style, setStyle] = useState('attractive');
    const [titles, setTitles] = useState<string[]>([]);

    const generateTitles = () => {
      if (!keyword.trim()) return;

      const titleTemplates = {
        wechat: {
          attractive: [
            `震惊！${keyword}竟然还能这样用`,
            `99%的人都不知道的${keyword}秘密`,
            `关于${keyword}，这些你必须知道`,
            `${keyword}避坑指南，看完少走弯路`,
            `揭秘${keyword}背后的真相`,
            `${keyword}新手必看，老手收藏`,
            `为什么${keyword}这么火？答案在这里`,
            `${keyword}的正确打开方式`,
          ],
          professional: [
            `${keyword}完全指南：从入门到精通`,
            `深度解析：${keyword}的核心要点`,
            `${keyword}最佳实践分享`,
            `如何正确使用${keyword}`,
            `${keyword}行业趋势分析`,
            `${keyword}案例研究报告`,
            `${keyword}技术解决方案`,
            `${keyword}专业评测`,
          ],
        },
        xiaohongshu: {
          attractive: [
            `${keyword}｜姐妹们快来看！`,
            `真的绝了！${keyword}居然这么好用`,
            `${keyword}测评｜真实使用感受`,
            `分享｜我的${keyword}心得`,
            `${keyword}好物推荐｜不踩雷`,
            `${keyword}｜这个真的值得入`,
            `关于${keyword}的那些事`,
            `${keyword}｜新手必看攻略`,
          ],
        },
        zhihu: {
          professional: [
            `如何看待${keyword}？`,
            `${keyword}是什么体验？`,
            `为什么${keyword}会这样？`,
            `${keyword}的原理是什么？`,
            `如何评价${keyword}？`,
            `${keyword}值得吗？`,
            `${keyword}有哪些优缺点？`,
            `${keyword}的未来发展如何？`,
          ],
        },
      };

      const platformTemplates = titleTemplates[platform as keyof typeof titleTemplates];
      const styleTemplates = platformTemplates?.[style as keyof typeof platformTemplates] || [];

      setTitles(styleTemplates);
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>标题生成器</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">关键词</label>
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="输入内容关键词..."
                className="w-full p-3 border border-border rounded-lg bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  平台
                </label>
                <select
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                  className="w-full p-4 font-mono text-sm rounded-md border bg-background dark:bg-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="wechat">微信公众号</option>
                  <option value="xiaohongshu">小红书</option>
                  <option value="zhihu">知乎</option>
                  <option value="toutiao">今日头条</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">风格</label>
                <select
                  value={style}
                  onChange={e => setStyle(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  <option value="attractive">吸引眼球</option>
                  <option value="professional">专业严谨</option>
                  <option value="emotional">情感共鸣</option>
                  <option value="practical">实用干货</option>
                </select>
              </div>
            </div>

            <Button onClick={generateTitles} className="w-full">
              生成标题
            </Button>
          </CardContent>
        </Card>

        {titles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>生成的标题</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {titles.map((title, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <span className="text-sm flex-1">{title}</span>
                    <Button
                      onClick={() => copyContent(title, `title-${index}`)}
                      className="p-2 rounded-md hover:bg-accent dark:hover:bg-slate-800 text-muted-foreground dark:text-slate-400"
                      size="sm"
                    >
                      {copied === `title-${index}` ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // 创意灵感生成器
  const IdeaGenerator = () => {
    const [topic, setTopic] = useState('');
    const [contentType, setContentType] = useState('article');
    const [ideas, setIdeas] = useState<Idea[]>([]);

    const generateIdeas = () => {
      if (!topic.trim()) return;

      const ideaTemplates = {
        article: [
          { angle: '教程指南', content: `${topic}完整教程：从零开始学会` },
          { angle: '经验分享', content: `我的${topic}实战经验分享` },
          { angle: '对比分析', content: `${topic} VS 传统方法，哪个更好？` },
          { angle: '趋势预测', content: `2024年${topic}发展趋势预测` },
          { angle: '案例研究', content: `${topic}成功案例深度解析` },
        ],
        video: [
          { angle: '开箱测评', content: `${topic}开箱测评，值得买吗？` },
          { angle: '使用技巧', content: `${topic}的5个隐藏技巧` },
          { angle: '对比测试', content: `${topic}横向对比测试` },
          { angle: '问题解答', content: `关于${topic}的常见问题解答` },
          { angle: '创意玩法', content: `${topic}的创意使用方法` },
        ],
        social: [
          { angle: '日常分享', content: `今天的${topic}日常` },
          { angle: '心得体会', content: `使用${topic}的真实感受` },
          { angle: '推荐种草', content: `强烈推荐这个${topic}` },
          { angle: '避坑指南', content: `${topic}避坑指南，别再踩雷了` },
          { angle: '互动话题', content: `你们的${topic}都是怎么选的？` },
        ],
      };

      setIdeas(ideaTemplates[contentType as keyof typeof ideaTemplates] || []);
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>创意灵感生成器</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">主题</label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="输入内容主题..."
                className="w-full p-3 border border-border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">内容类型</label>
              <select
                value={contentType}
                onChange={e => setContentType(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                <option value="article">图文文章</option>
                <option value="video">视频内容</option>
                <option value="social">社交动态</option>
                <option value="live">直播内容</option>
              </select>
            </div>

            <Button onClick={generateIdeas} className="w-full">
              生成创意
            </Button>
          </CardContent>
        </Card>

        {ideas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>创意灵感</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ideas.map((idea, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary">{idea.angle}</span>
                      <Button
                        onClick={() => copyContent(idea.content, `idea-${index}`)}
                        variant="ghost"
                        size="sm"
                      >
                        {copied === `idea-${index}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm">{idea.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // 内容大纲生成器
  const OutlineGenerator = () => {
    const [title, setTitle] = useState('');
    const [articleType, setArticleType] = useState('tutorial');
    const [outline, setOutline] = useState<Outline | null>(null);

    const generateOutline = () => {
      if (!title.trim()) return;

      const outlineTemplates = {
        tutorial: {
          structure: [
            '引言：问题背景',
            '准备工作：所需工具/材料',
            '步骤一：基础操作',
            '步骤二：进阶技巧',
            '步骤三：优化建议',
            '常见问题解答',
            '总结与建议',
          ],
          details: {
            '引言：问题背景': '介绍为什么需要学习这个技能，解决什么问题',
            '准备工作：所需工具/材料': '列出完成教程所需的工具、软件或材料',
            '步骤一：基础操作': '详细说明基础操作步骤，配图说明',
            '步骤二：进阶技巧': '介绍进阶技巧和优化方法',
            '步骤三：优化建议': '分享实用的优化建议和注意事项',
            常见问题解答: '列出学习过程中可能遇到的问题及解决方案',
            总结与建议: '总结要点，给出进一步学习的建议',
          },
        },
        review: {
          structure: [
            '产品介绍',
            '外观设计',
            '功能特点',
            '使用体验',
            '优缺点分析',
            '价格对比',
            '购买建议',
          ],
          details: {
            产品介绍: '简要介绍产品背景、品牌、定位',
            外观设计: '描述产品外观、材质、工艺等',
            功能特点: '详细介绍产品的主要功能和特色',
            使用体验: '分享真实的使用感受和体验',
            优缺点分析: '客观分析产品的优点和不足',
            价格对比: '与同类产品进行价格和性价比对比',
            购买建议: '给出购买建议和适用人群',
          },
        },
        story: {
          structure: [
            '背景设定',
            '人物介绍',
            '事件起因',
            '发展过程',
            '高潮部分',
            '结果收获',
            '感悟总结',
          ],
          details: {
            背景设定: '交代故事发生的时间、地点、环境',
            人物介绍: '介绍故事中的主要人物',
            事件起因: '说明事件的起因和背景',
            发展过程: '详细描述事件的发展过程',
            高潮部分: '描述故事的高潮和转折点',
            结果收获: '说明事件的结果和收获',
            感悟总结: '分享从中得到的感悟和启发',
          },
        },
      };

      setOutline(outlineTemplates[articleType as keyof typeof outlineTemplates]);
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>内容大纲生成器</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">文章标题</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="输入文章标题..."
                className="w-full p-3 border border-border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">文章类型</label>
              <select
                value={articleType}
                onChange={e => setArticleType(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                <option value="tutorial">教程指南</option>
                <option value="review">产品测评</option>
                <option value="story">故事分享</option>
                <option value="analysis">分析报告</option>
              </select>
            </div>

            <Button onClick={generateOutline} className="w-full">
              生成大纲
            </Button>
          </CardContent>
        </Card>

        {outline && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                文章大纲
                <Button
                  onClick={() => copyContent(outline.structure.join('\n'), 'outline')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {copied === 'outline' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  复制大纲
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outline.structure.map((section: string, index: number) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <h4 className="font-medium mb-2">
                      {index + 1}. {section}
                    </h4>
                    <p className="text-sm text-muted-foreground">{outline.details[section]}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // 开头钩子生成器
  const HookGenerator = () => {
    const [topic, setTopic] = useState('');
    const [hookType, setHookType] = useState('question');
    const [hooks, setHooks] = useState<string[]>([]);

    const generateHooks = () => {
      if (!topic.trim()) return;

      const hookTemplates = {
        question: [
          `你知道${topic}的秘密吗？`,
          `为什么${topic}这么重要？`,
          `${topic}真的有用吗？`,
          `如何快速掌握${topic}？`,
          `${topic}的正确方法是什么？`,
        ],
        story: [
          `昨天发生了一件关于${topic}的事...`,
          `我永远不会忘记第一次接触${topic}的经历`,
          `有个朋友问我关于${topic}的问题`,
          `三年前，我对${topic}一无所知`,
          `那天，${topic}改变了我的想法`,
        ],
        data: [
          `99%的人不知道${topic}的真相`,
          `研究表明，${topic}能提升80%的效率`,
          `每天有1000万人在搜索${topic}`,
          `${topic}的市场规模达到了100亿`,
          `只有5%的人真正了解${topic}`,
        ],
        contrast: [
          `${topic} VS 传统方法，差距竟然这么大`,
          `用了${topic}后，我再也回不去了`,
          `${topic}前后对比，效果惊人`,
          `同样的时间，${topic}效果翻倍`,
          `${topic}让我重新认识了这个领域`,
        ],
      };

      setHooks(hookTemplates[hookType as keyof typeof hookTemplates] || []);
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>开头钩子生成器</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">主题</label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="输入内容主题..."
                className="w-full p-3 border border-border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">钩子类型</label>
              <select
                value={hookType}
                onChange={e => setHookType(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                <option value="question">疑问式</option>
                <option value="story">故事式</option>
                <option value="data">数据式</option>
                <option value="contrast">对比式</option>
              </select>
            </div>

            <Button onClick={generateHooks} className="w-full">
              生成开头
            </Button>
          </CardContent>
        </Card>

        {hooks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>开头钩子</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hooks.map((hook, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <span className="text-sm flex-1">{hook}</span>
                    <Button
                      onClick={() => copyContent(hook, `hook-${index}`)}
                      variant="ghost"
                      size="sm"
                    >
                      {copied === `hook-${index}` ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // 占位文本生成器
  const PlaceholderGenerator = () => {
    const [textType, setTextType] = useState('lorem');
    const [length, setLength] = useState('paragraph');
    const [count, setCount] = useState(3);
    const [placeholderText, setPlaceholderText] = useState('');

    const generatePlaceholder = () => {
      const loremWords = [
        'Lorem',
        'ipsum',
        'dolor',
        'sit',
        'amet',
        'consectetur',
        'adipiscing',
        'elit',
        'sed',
        'do',
        'eiusmod',
        'tempor',
        'incididunt',
        'ut',
        'labore',
        'et',
        'dolore',
        'magna',
        'aliqua',
      ];
      const chineseWords = [
        '这是',
        '一段',
        '占位',
        '文本',
        '用于',
        '展示',
        '页面',
        '布局',
        '效果',
        '在',
        '实际',
        '内容',
        '填充',
        '之前',
        '使用',
        '临时',
        '文字',
        '内容',
      ];

      const words = textType === 'lorem' ? loremWords : chineseWords;

      let result = '';

      for (let i = 0; i < count; i++) {
        if (length === 'word') {
          result += words[Math.floor(Math.random() * words.length)] + ' ';
        } else if (length === 'sentence') {
          const sentenceLength = Math.floor(Math.random() * 10) + 5;
          for (let j = 0; j < sentenceLength; j++) {
            result += words[Math.floor(Math.random() * words.length)] + ' ';
          }
          result = result.trim() + '. ';
        } else {
          // paragraph
          const paragraphLength = Math.floor(Math.random() * 5) + 3;
          for (let j = 0; j < paragraphLength; j++) {
            const sentenceLength = Math.floor(Math.random() * 10) + 5;
            for (let k = 0; k < sentenceLength; k++) {
              result += words[Math.floor(Math.random() * words.length)] + ' ';
            }
            result = result.trim() + '. ';
          }
          result += '\n\n';
        }
      }

      setPlaceholderText(result.trim());
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>占位文本生成器</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">文本类型</label>
                <select
                  value={textType}
                  onChange={e => setTextType(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  <option value="lorem">Lorem Ipsum</option>
                  <option value="chinese">中文占位</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">长度单位</label>
                <select
                  value={length}
                  onChange={e => setLength(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  <option value="word">单词</option>
                  <option value="sentence">句子</option>
                  <option value="paragraph">段落</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">数量</label>
                <input
                  type="number"
                  value={count}
                  onChange={e => setCount(parseInt(e.target.value) || 1)}
                  min="1"
                  max="20"
                  className="w-full p-3 border border-border rounded-lg bg-background"
                />
              </div>
            </div>

            <Button onClick={generatePlaceholder} className="w-full">
              生成占位文本
            </Button>

            {placeholderText && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">生成的占位文本</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyContent(placeholderText, 'placeholder')}
                  >
                    {copied === 'placeholder' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    复制
                  </Button>
                </div>
                <textarea
                  value={placeholderText}
                  readOnly
                  className="w-full h-48 p-3 border border-border rounded-lg bg-muted/50 text-sm resize-none"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const tabs = [
    { key: 'title', name: '标题生成', icon: PenTool },
    { key: 'idea', name: '创意灵感', icon: Lightbulb },
    { key: 'outline', name: '内容大纲', icon: Target },
    { key: 'hook', name: '开头钩子', icon: Zap },
    { key: 'placeholder', name: '占位文本', icon: PenTool },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">内容创作助手</h1>
            <p className="text-muted-foreground">
              智能内容创作工具，支持标题生成、创意灵感、内容大纲、文案优化
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 p-4 text-center transition-colors flex items-center justify-center gap-2 ${
                    activeTab === tab.key
                      ? 'px-4 py-2 rounded-md bg-primary text-primary-foreground dark:bg-slate-700'
                      : 'px-4 py-2 rounded-md hover:bg-accent dark:hover:bg-slate-800'
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

      {activeTab === 'title' && <TitleGenerator />}
      {activeTab === 'idea' && <IdeaGenerator />}
      {activeTab === 'outline' && <OutlineGenerator />}
      {activeTab === 'hook' && <HookGenerator />}
      {activeTab === 'placeholder' && <PlaceholderGenerator />}
    </div>
  );
}
