"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Card, CardContent } from "@/components/ui/card";
import { TableOfContentsClientWrapper } from "@/components/content/toc/toc-client-wrapper";
import { AdvertisementCard } from "@/components/content/advertisement-card";
import { BackToTopButton } from "@/components/content/back-to-top-button";
import { fadeIn, slideUp } from "@/lib/animations";

export default function AINavigationPage({ params }: { params: { lang: string } }) {
  const resolvedParams = React.use(params);
  
  // 根据语言获取AI工具分类数据
  const getCategories = (lang: string) => {
    if (lang === 'zh') {
      return [
        { id: 'chat', name: '对话模型', icon: '💬', links: [
          { name: 'ChatGPT', url: 'https://chat.openai.com', desc: '智能对话助手' },
          { name: 'Claude', url: 'https://claude.ai', desc: 'Anthropic AI助手' },
          { name: 'Bard', url: 'https://bard.google.com', desc: 'Google AI助手' },
          { name: 'Bing Chat', url: 'https://bing.com/chat', desc: '微软AI助手' },
          { name: 'Kimi', url: 'https://kimi.moonshot.cn', desc: '月之暗面AI助手' },
          { name: 'Poe', url: 'https://poe.com', desc: '多模型聚合平台' }
        ]},
        { id: 'image', name: '图像生成', icon: '🎨', links: [
          { name: 'Midjourney', url: 'https://midjourney.com', desc: 'AI绘画工具' },
          { name: 'DALL-E', url: 'https://openai.com/dall-e-3', desc: 'OpenAI图像生成' },
          { name: 'Stable Diffusion', url: 'https://stability.ai', desc: '开源图像生成' },
          { name: 'Canva AI', url: 'https://canva.com', desc: '设计平台AI工具' },
          { name: 'Adobe Firefly', url: 'https://firefly.adobe.com', desc: 'Adobe AI创意工具' },
          { name: 'Runway', url: 'https://runwayml.com', desc: '视频与图像创作' }
        ]},
        { id: 'audio', name: '音频工具', icon: '🎵', links: [
          { name: 'Mubert', url: 'https://mubert.com', desc: 'AI音乐生成' },
          { name: 'Soundraw', url: 'https://soundraw.io', desc: '音乐创作工具' },
          { name: 'Resemble.ai', url: 'https://resemble.ai', desc: '语音克隆' },
          { name: 'Descript', url: 'https://descript.com', desc: '音频编辑工具' },
          { name: 'Elevenlabs', url: 'https://elevenlabs.io', desc: '语音合成' },
          { name: 'Voicemod', url: 'https://voicemod.net', desc: '实时变声器' }
        ]},
        { id: 'video', name: '视频工具', icon: '🎬', links: [
          { name: 'Runway', url: 'https://runwayml.com', desc: 'AI视频编辑' },
          { name: 'Synthesia', url: 'https://synthesia.io', desc: 'AI视频生成' },
          { name: 'D-ID', url: 'https://d-id.com', desc: '数字人视频' },
          { name: 'Fliki', url: 'https://fliki.ai', desc: '文本转视频' },
          { name: 'HeyGen', url: 'https://heygen.com', desc: 'AI数字人视频' },
          { name: 'Kapwing', url: 'https://kapwing.com', desc: '在线视频编辑' }
        ]},
        { id: 'writing', name: '写作助手', icon: '✍️', links: [
          { name: 'Notion AI', url: 'https://notion.so', desc: '智能写作助手' },
          { name: 'Jasper', url: 'https://jasper.ai', desc: 'AI内容创作' },
          { name: 'Copy.ai', url: 'https://copy.ai', desc: '营销文案工具' },
          { name: 'Grammarly', url: 'https://grammarly.com', desc: '语法检查工具' },
          { name: 'Writesonic', url: 'https://writesonic.com', desc: 'AI写作平台' },
          { name: 'Rytr', url: 'https://rytr.me', desc: '内容生成工具' }
        ]},
        { id: 'productivity', name: '生产力工具', icon: '⚡', links: [
          { name: 'Mem.ai', url: 'https://mem.ai', desc: 'AI笔记工具' },
          { name: 'Taskade', url: 'https://taskade.com', desc: 'AI任务管理' },
          { name: 'Otter.ai', url: 'https://otter.ai', desc: '会议记录工具' },
          { name: 'Krisp', url: 'https://krisp.ai', desc: '降噪工具' },
          { name: 'Fireflies.ai', url: 'https://fireflies.ai', desc: '会议助手' },
          { name: 'Cogram', url: 'https://cogram.com', desc: '会议摘要工具' }
        ]}
      ];
    } else {
      return [
        { id: 'chat', name: 'Conversational Models', icon: '💬', links: [
          { name: 'ChatGPT', url: 'https://chat.openai.com', desc: 'AI Assistant' },
          { name: 'Claude', url: 'https://claude.ai', desc: 'Anthropic AI' },
          { name: 'Bard', url: 'https://bard.google.com', desc: 'Google AI' },
          { name: 'Bing Chat', url: 'https://bing.com/chat', desc: 'Microsoft AI' },
          { name: 'Kimi', url: 'https://kimi.moonshot.cn', desc: 'Moonshot AI' },
          { name: 'Poe', url: 'https://poe.com', desc: 'Multi-model Platform' }
        ]},
        { id: 'image', name: 'Image Generation', icon: '🎨', links: [
          { name: 'Midjourney', url: 'https://midjourney.com', desc: 'AI Art Tool' },
          { name: 'DALL-E', url: 'https://openai.com/dall-e-3', desc: 'OpenAI Image Gen' },
          { name: 'Stable Diffusion', url: 'https://stability.ai', desc: 'Open Source Gen' },
          { name: 'Canva AI', url: 'https://canva.com', desc: 'Design Platform' },
          { name: 'Adobe Firefly', url: 'https://firefly.adobe.com', desc: 'Creative Tool' },
          { name: 'Runway', url: 'https://runwayml.com', desc: 'Video & Image' }
        ]},
        { id: 'audio', name: 'Audio Tools', icon: '🎵', links: [
          { name: 'Mubert', url: 'https://mubert.com', desc: 'AI Music Gen' },
          { name: 'Soundraw', url: 'https://soundraw.io', desc: 'Music Creation' },
          { name: 'Resemble.ai', url: 'https://resemble.ai', desc: 'Voice Cloning' },
          { name: 'Descript', url: 'https://descript.com', desc: 'Audio Editor' },
          { name: 'Elevenlabs', url: 'https://elevenlabs.io', desc: 'Voice Synthesis' },
          { name: 'Voicemod', url: 'https://voicemod.net', desc: 'Voice Changer' }
        ]},
        { id: 'video', name: 'Video Tools', icon: '🎬', links: [
          { name: 'Runway', url: 'https://runwayml.com', desc: 'AI Video Editor' },
          { name: 'Synthesia', url: 'https://synthesia.io', desc: 'AI Video Gen' },
          { name: 'D-ID', url: 'https://d-id.com', desc: 'Digital Human' },
          { name: 'Fliki', url: 'https://fliki.ai', desc: 'Text to Video' },
          { name: 'HeyGen', url: 'https://heygen.com', desc: 'AI Avatar Videos' },
          { name: 'Kapwing', url: 'https://kapwing.com', desc: 'Online Editor' }
        ]},
        { id: 'writing', name: 'Writing Assistants', icon: '✍️', links: [
          { name: 'Notion AI', url: 'https://notion.so', desc: 'Smart Assistant' },
          { name: 'Jasper', url: 'https://jasper.ai', desc: 'Content Creation' },
          { name: 'Copy.ai', url: 'https://copy.ai', desc: 'Marketing Copy' },
          { name: 'Grammarly', url: 'https://grammarly.com', desc: 'Grammar Check' },
          { name: 'Writesonic', url: 'https://writesonic.com', desc: 'AI Writing' },
          { name: 'Rytr', url: 'https://rytr.me', desc: 'Content Gen' }
        ]},
        { id: 'productivity', name: 'Productivity Tools', icon: '⚡', links: [
          { name: 'Mem.ai', url: 'https://mem.ai', desc: 'AI Note Taking' },
          { name: 'Taskade', url: 'https://taskade.com', desc: 'AI Task Mgmt' },
          { name: 'Otter.ai', url: 'https://otter.ai', desc: 'Meeting Notes' },
          { name: 'Krisp', url: 'https://krisp.ai', desc: 'Noise Cancelling' },
          { name: 'Fireflies.ai', url: 'https://fireflies.ai', desc: 'Meeting Assistant' },
          { name: 'Cogram', url: 'https://cogram.com', desc: 'Meeting Summary' }
        ]}
      ];
    }
  };
    
  const categories = getCategories(resolvedParams.lang);

  // 提取标题作为目录
  const headings = categories.map(category => ({
    id: category.id,
    text: category.name,
    level: 2
  }));

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧内容区域 - 网址卡片 */}
        <div className="lg:flex-1 min-w-0 order-1 lg:order-1">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">
              {resolvedParams.lang === 'zh' ? 'AI 工具导航' : 'AI Tools Navigation'}
            </h1>
            
            <div className="space-y-8">
              {categories.map((category, index) => {
                const [ref, inView] = useInView({
                  triggerOnce: true,
                  threshold: 0.1,
                });
                
                return (
                  <motion.section
                    ref={ref}
                    key={category.id}
                    id={category.id}
                    className="scroll-mt-24"
                    variants={slideUp}
                    initial="initial"
                    animate={inView ? "animate" : "initial"}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span className="bg-primary/10 text-primary p-1.5 rounded">
                        {category.icon}
                      </span>
                      {category.name}
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {category.links.map((link) => (
                        <motion.div 
                          key={link.url}
                          variants={fadeIn}
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-3"
                              >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                  {category.icon}
                                </div>
                                <div>
                                  <div className="font-medium">{link.name}</div>
                                  <div className="text-sm text-muted-foreground">{link.desc}</div>
                                </div>
                              </a>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧边栏 - 目录、广告和回到顶部按钮 */}
        <div className="lg:w-64 shrink-0 order-2 lg:order-2">
          <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] pr-2 -mr-2 space-y-8">
            {/* 目录 */}
            <div>
              <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <TableOfContentsClientWrapper headings={headings} lang={resolvedParams.lang} />
              </div>
            </div>
            
            {/* 广告卡片 */}
            <AdvertisementCard
              lang={resolvedParams.lang}
            />
            
            {/* 回到顶部按钮 */}
            <div className="flex justify-left">
              <BackToTopButton 
                title={resolvedParams.lang === 'zh' ? '回到顶部' : 'Back to top'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}