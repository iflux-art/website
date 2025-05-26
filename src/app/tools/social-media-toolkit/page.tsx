'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Share2, Video, Mic, Users, Copy, Check, Shuffle } from 'lucide-react';
import Link from 'next/link';

export default function SocialMediaToolkitPage() {
  const [activeTab, setActiveTab] = useState('content');
  const [copied, setCopied] = useState<string | null>(null);

  // 内容创作相关状态
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('微博');
  const [tone, setTone] = useState('专业');
  const [generatedContent, setGeneratedContent] = useState('');

  // 短视频脚本相关状态
  const [videoTopic, setVideoTopic] = useState('');
  const [videoDuration, setVideoDuration] = useState('30');
  const [videoStyle, setVideoStyle] = useState('教程');
  const [videoScript, setVideoScript] = useState('');

  // 直播话术相关状态
  const [liveType, setLiveType] = useState('产品介绍');
  const [liveProduct, setLiveProduct] = useState('');
  const [liveScript, setLiveScript] = useState('');

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 内容创作模板
  const contentTemplates = {
    微博: {
      专业: '【{topic}】\n\n💡 核心观点：\n• 观点1\n• 观点2\n• 观点3\n\n🔥 总结：{topic}的关键在于...\n\n#话题标签# #相关标签#',
      轻松: '今天聊聊{topic}这个话题～\n\n其实{topic}没有想象中那么复杂，简单来说就是：\n\n✨ 要点1\n✨ 要点2\n✨ 要点3\n\n你们觉得呢？评论区聊聊～',
      幽默: '哈哈哈，说到{topic}，我想起一个段子...\n\n不过认真说，{topic}确实很重要：\n\n😄 有趣的点1\n😄 有趣的点2\n😄 有趣的点3\n\n大家有什么好玩的经历吗？',
    },
    抖音: {
      专业: '🔥{topic}干货分享\n\n📌 重点：\n1️⃣ 要点一\n2️⃣ 要点二\n3️⃣ 要点三\n\n💪 记得点赞收藏哦！\n\n#抖音小助手 #{topic}',
      轻松: '今天教大家{topic}～\n\n超简单的方法：\n\n🌟 步骤1\n🌟 步骤2\n🌟 步骤3\n\n学会了吗？快去试试吧！\n\n#生活小技巧 #实用',
      幽默: '哈哈哈，{topic}原来这么简单！\n\n之前我还傻傻的...\n\n😂 误区1\n😂 误区2\n😂 误区3\n\n现在终于懂了！你们呢？',
    },
  };

  // 生成内容
  const generateContent = () => {
    const template =
      contentTemplates[platform as keyof typeof contentTemplates][
        tone as keyof (typeof contentTemplates)['微博']
      ];
    const content = template.replace(/{topic}/g, topic || '您的主题');
    setGeneratedContent(content);
  };

  // 短视频脚本模板
  const generateVideoScript = () => {
    const scripts = {
      教程: `【${videoTopic}教程】${videoDuration}秒版本

🎬 开场（0-3秒）
"今天教大家${videoTopic}，超简单！"

📝 主体内容（3-${parseInt(videoDuration) - 5}秒）
步骤1：[具体操作]
步骤2：[具体操作]
步骤3：[具体操作]

✨ 结尾（${parseInt(videoDuration) - 5}-${videoDuration}秒）
"学会了吗？点赞收藏不迷路！"

💡 拍摄提示：
- 手部特写镜头
- 快节奏剪辑
- 添加字幕说明`,

      娱乐: `【${videoTopic}】搞笑版本

🎭 开场（0-3秒）
"兄弟们，今天整个活！"

🎪 主体内容（3-${parseInt(videoDuration) - 5}秒）
情节1：[搞笑情节]
情节2：[反转情节]
情节3：[高潮情节]

😄 结尾（${parseInt(videoDuration) - 5}-${videoDuration}秒）
"哈哈哈，你们觉得怎么样？"

🎬 拍摄提示：
- 夸张表情
- 音效配合
- 节奏感强`,

      种草: `【${videoTopic}种草】必买清单

💕 开场（0-3秒）
"姐妹们，这个真的绝了！"

🛍️ 主体内容（3-${parseInt(videoDuration) - 5}秒）
产品1：[展示+优点]
产品2：[展示+优点]
产品3：[展示+优点]

💖 结尾（${parseInt(videoDuration) - 5}-${videoDuration}秒）
"链接放评论区，冲冲冲！"

📸 拍摄提示：
- 产品特写
- 使用效果对比
- 精美包装展示`,
    };

    setVideoScript(scripts[videoStyle as keyof typeof scripts] || scripts.教程);
  };

  // 直播话术模板
  const generateLiveScript = () => {
    const scripts = {
      产品介绍: `【${liveProduct}直播话术】

🎯 开场话术（5分钟）
"欢迎来到直播间的宝宝们！今天给大家带来超值好物${liveProduct}！"

📢 产品介绍（15分钟）
"这款${liveProduct}有三大优势：
1. [优势1详细说明]
2. [优势2详细说明]
3. [优势3详细说明]"

💰 价格引导（10分钟）
"平时卖[原价]，今天直播间专享价只要[现价]！"
"前100名下单还送[赠品]！"

🔥 催单话术（持续使用）
"库存不多了，想要的宝宝抓紧时间！"
"已经有[数量]个宝宝下单了！"

❤️ 互动话术
"有问题的宝宝扣1，我来解答！"
"觉得不错的宝宝给个小心心！"`,

      才艺展示: `【才艺直播话术】

🎪 开场互动
"宝宝们晚上好！今天给大家表演${liveProduct}！"

🎭 表演串词
"接下来这个节目是我最拿手的..."
"这首歌献给直播间所有的宝宝们！"

💝 感谢话术
"感谢[用户名]的礼物！"
"谢谢大家的支持和鼓励！"

🎯 引导关注
"喜欢的宝宝记得点个关注哦！"
"明天同一时间继续为大家表演！"`,

      知识分享: `【知识分享直播话术】

📚 开场引入
"今天和大家分享${liveProduct}相关知识！"

🎓 知识点讲解
"第一个知识点是..."
"这里有个小技巧..."
"大家记住这个要点..."

❓ 互动提问
"有不懂的地方可以打在公屏上！"
"谁能回答这个问题？"

📝 总结收尾
"今天的分享就到这里，大家学会了吗？"
"记得关注我，每天分享干货知识！"`,
    };

    setLiveScript(scripts[liveType as keyof typeof scripts] || scripts.产品介绍);
  };

  const tabs = [
    { key: 'content', name: '内容创作', icon: Share2 },
    { key: 'video', name: '短视频脚本', icon: Video },
    { key: 'live', name: '直播话术', icon: Mic },
    { key: 'operation', name: '私域运营', icon: Users },
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
          <Share2 className="h-8 w-8" />
          社交媒体工具集
        </h1>
        <p className="text-muted-foreground mt-2">
          社交媒体工具，包括内容创作、短视频脚本、直播话术、私域运营
        </p>
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

      {/* 内容创作标签页 */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>内容创作助手</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium mb-2">平台</label>
                  <select
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    <option value="微博">微博</option>
                    <option value="抖音">抖音</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">风格</label>
                  <select
                    value={tone}
                    onChange={e => setTone(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    <option value="专业">专业</option>
                    <option value="轻松">轻松</option>
                    <option value="幽默">幽默</option>
                  </select>
                </div>
              </div>

              <Button onClick={generateContent} className="w-full">
                生成内容
              </Button>

              {generatedContent && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">生成的内容</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent, 'content')}
                    >
                      {copied === 'content' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      复制
                    </Button>
                  </div>
                  <textarea
                    value={generatedContent}
                    onChange={e => setGeneratedContent(e.target.value)}
                    className="w-full h-48 p-3 border border-border rounded-lg bg-background text-sm resize-none"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 短视频脚本标签页 */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>短视频脚本生成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">视频主题</label>
                  <input
                    type="text"
                    value={videoTopic}
                    onChange={e => setVideoTopic(e.target.value)}
                    placeholder="输入视频主题..."
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">时长（秒）</label>
                  <select
                    value={videoDuration}
                    onChange={e => setVideoDuration(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    <option value="15">15秒</option>
                    <option value="30">30秒</option>
                    <option value="60">60秒</option>
                    <option value="90">90秒</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">视频类型</label>
                  <select
                    value={videoStyle}
                    onChange={e => setVideoStyle(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    <option value="教程">教程</option>
                    <option value="娱乐">娱乐</option>
                    <option value="种草">种草</option>
                  </select>
                </div>
              </div>

              <Button onClick={generateVideoScript} className="w-full">
                生成脚本
              </Button>

              {videoScript && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">视频脚本</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(videoScript, 'video')}
                    >
                      {copied === 'video' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      复制
                    </Button>
                  </div>
                  <textarea
                    value={videoScript}
                    onChange={e => setVideoScript(e.target.value)}
                    className="w-full h-64 p-3 border border-border rounded-lg bg-background text-sm resize-none font-mono"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 直播话术标签页 */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>直播话术生成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">直播类型</label>
                  <select
                    value={liveType}
                    onChange={e => setLiveType(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    <option value="产品介绍">产品介绍</option>
                    <option value="才艺展示">才艺展示</option>
                    <option value="知识分享">知识分享</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">产品/主题</label>
                  <input
                    type="text"
                    value={liveProduct}
                    onChange={e => setLiveProduct(e.target.value)}
                    placeholder="输入产品名称或主题..."
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  />
                </div>
              </div>

              <Button onClick={generateLiveScript} className="w-full">
                生成话术
              </Button>

              {liveScript && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">直播话术</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(liveScript, 'live')}
                    >
                      {copied === 'live' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      复制
                    </Button>
                  </div>
                  <textarea
                    value={liveScript}
                    onChange={e => setLiveScript(e.target.value)}
                    className="w-full h-64 p-3 border border-border rounded-lg bg-background text-sm resize-none font-mono"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 私域运营标签页 */}
      {activeTab === 'operation' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>私域运营策略</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">用户分层策略</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">新用户（0-7天）</div>
                      <div className="text-sm text-muted-foreground">
                        欢迎话术 + 产品介绍 + 优惠券
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">活跃用户（7-30天）</div>
                      <div className="text-sm text-muted-foreground">
                        价值内容 + 社群活动 + 复购引导
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">忠实用户（30天+）</div>
                      <div className="text-sm text-muted-foreground">
                        VIP权益 + 分享奖励 + 专属服务
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">内容运营日历</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">周一</span>
                      <span className="text-sm">行业资讯分享</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">周二</span>
                      <span className="text-sm">产品使用技巧</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">周三</span>
                      <span className="text-sm">用户案例展示</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">周四</span>
                      <span className="text-sm">互动话题讨论</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">周五</span>
                      <span className="text-sm">福利活动发布</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">引流话术</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>"想了解更多干货，加我微信：[微信号]"</p>
                    <p>"私信回复'资料'获取完整版"</p>
                    <p>"进群交流，群里有更多福利"</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">转化话术</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>"限时优惠，仅限前100名"</p>
                    <p>"老客户专享价，错过就没了"</p>
                    <p>"买2送1，今天最后一天"</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">留存话术</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>"每日签到领积分，积分换好礼"</p>
                    <p>"VIP专属群，更多内部消息"</p>
                    <p>"推荐好友，双方都有奖励"</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
