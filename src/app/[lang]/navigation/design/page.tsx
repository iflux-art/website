"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Card, CardContent } from "@/components/ui/card";
import { TableOfContentsClientWrapper } from "@/components/content/toc/toc-client-wrapper";
import { AdvertisementCard } from "@/components/content/advertisement-card";
import { BackToTopButton } from "@/components/content/back-to-top-button";
import { fadeIn, slideUp } from "@/lib/animations";

export default function DesignNavigationPage({ params }: { params: { lang: string } }) {
  const resolvedParams = React.use(params);
  
  // 根据语言获取设计工具分类数据
  const getCategories = (lang: string) => {
    if (lang === 'zh') {
      return [
        { id: 'ui', name: 'UI 设计', icon: '🎨', links: [
          { name: 'Figma', url: 'https://figma.com', desc: '协作设计工具' },
          { name: 'Sketch', url: 'https://sketch.com', desc: 'Mac设计工具' },
          { name: 'Adobe XD', url: 'https://adobe.com/products/xd.html', desc: 'UI/UX设计工具' },
          { name: 'Framer', url: 'https://framer.com', desc: '交互原型工具' },
          { name: 'Penpot', url: 'https://penpot.app', desc: '开源设计平台' },
          { name: 'Lunacy', url: 'https://icons8.com/lunacy', desc: '免费设计工具' }
        ]},
        { id: 'color', name: '配色工具', icon: '🌈', links: [
          { name: 'Coolors', url: 'https://coolors.co', desc: '配色方案生成器' },
          { name: 'Adobe Color', url: 'https://color.adobe.com', desc: '色轮与配色工具' },
          { name: 'Colormind', url: 'http://colormind.io', desc: 'AI配色工具' },
          { name: 'Colorhunt', url: 'https://colorhunt.co', desc: '配色方案集合' },
          { name: 'Huemint', url: 'https://huemint.com', desc: 'AI色彩生成' },
          { name: 'Colorable', url: 'https://colorable.jxnblk.com', desc: '对比度测试' }
        ]},
        { id: 'typography', name: '字体排版', icon: '📝', links: [
          { name: '字由', url: 'https://hellofont.cn', desc: '字体管理工具' },
          { name: 'Google Fonts', url: 'https://fonts.google.com', desc: '免费字体库' },
          { name: 'Type Scale', url: 'https://type-scale.com', desc: '字体比例工具' },
          { name: 'Font Pair', url: 'https://fontpair.co', desc: '字体搭配' },
          { name: 'Fontjoy', url: 'https://fontjoy.com', desc: '字体组合生成' },
          { name: 'Font Squirrel', url: 'https://fontsquirrel.com', desc: '免费商用字体' }
        ]},
        { id: 'illustration', name: '插画资源', icon: '✏️', links: [
          { name: 'Undraw', url: 'https://undraw.co', desc: '开源插画' },
          { name: 'Humaaans', url: 'https://humaaans.com', desc: '人物插画库' },
          { name: 'Blush', url: 'https://blush.design', desc: '可定制插画' },
          { name: 'DrawKit', url: 'https://drawkit.com', desc: '免费插画资源' },
          { name: 'IRA Design', url: 'https://iradesign.io', desc: '渐变插画' },
          { name: 'Ouch', url: 'https://icons8.com/illustrations', desc: '免费插画集' }
        ]},
        { id: 'icons', name: '图标资源', icon: '🔍', links: [
          { name: 'Iconify', url: 'https://iconify.design', desc: '图标集合' },
          { name: 'Feather Icons', url: 'https://feathericons.com', desc: '简约图标' },
          { name: 'Flaticon', url: 'https://flaticon.com', desc: '免费图标库' },
          { name: 'Heroicons', url: 'https://heroicons.com', desc: 'SVG图标' },
          { name: 'Tabler Icons', url: 'https://tabler-icons.io', desc: '开源图标' },
          { name: 'Phosphor Icons', url: 'https://phosphoricons.com', desc: '灵活图标库' }
        ]},
        { id: 'inspiration', name: '设计灵感', icon: '💡', links: [
          { name: 'Dribbble', url: 'https://dribbble.com', desc: '设计作品展示' },
          { name: 'Behance', url: 'https://behance.net', desc: '创意作品平台' },
          { name: 'Awwwards', url: 'https://awwwards.com', desc: '网页设计奖项' },
          { name: 'Pinterest', url: 'https://pinterest.com', desc: '图片收藏平台' },
          { name: 'Muzli', url: 'https://muz.li', desc: '设计灵感推送' },
          { name: 'Siteinspire', url: 'https://siteinspire.com', desc: '网站设计案例' }
        ]}
      ];
    } else {
      return [
        { id: 'ui', name: 'UI Design', icon: '🎨', links: [
          { name: 'Figma', url: 'https://figma.com', desc: 'Collaborative Tool' },
          { name: 'Sketch', url: 'https://sketch.com', desc: 'Mac Design Tool' },
          { name: 'Adobe XD', url: 'https://adobe.com/products/xd.html', desc: 'UI/UX Design' },
          { name: 'Framer', url: 'https://framer.com', desc: 'Interactive Prototypes' },
          { name: 'Penpot', url: 'https://penpot.app', desc: 'Open Source Design' },
          { name: 'Lunacy', url: 'https://icons8.com/lunacy', desc: 'Free Design Tool' }
        ]},
        { id: 'color', name: 'Color Tools', icon: '🌈', links: [
          { name: 'Coolors', url: 'https://coolors.co', desc: 'Scheme Generator' },
          { name: 'Adobe Color', url: 'https://color.adobe.com', desc: 'Color Wheel' },
          { name: 'Colormind', url: 'http://colormind.io', desc: 'AI Color Generator' },
          { name: 'Colorhunt', url: 'https://colorhunt.co', desc: 'Color Palettes' },
          { name: 'Huemint', url: 'https://huemint.com', desc: 'AI Color Gen' },
          { name: 'Colorable', url: 'https://colorable.jxnblk.com', desc: 'Contrast Checker' }
        ]},
        { id: 'typography', name: 'Typography', icon: '📝', links: [
          { name: 'HelloFont', url: 'https://hellofont.cn', desc: 'Font Manager' },
          { name: 'Google Fonts', url: 'https://fonts.google.com', desc: 'Free Font Library' },
          { name: 'Type Scale', url: 'https://type-scale.com', desc: 'Font Scale Tool' },
          { name: 'Font Pair', url: 'https://fontpair.co', desc: 'Font Pairing' },
          { name: 'Fontjoy', url: 'https://fontjoy.com', desc: 'Font Combinations' },
          { name: 'Font Squirrel', url: 'https://fontsquirrel.com', desc: 'Free Fonts' }
        ]},
        { id: 'illustration', name: 'Illustrations', icon: '✏️', links: [
          { name: 'Undraw', url: 'https://undraw.co', desc: 'Open Source' },
          { name: 'Humaaans', url: 'https://humaaans.com', desc: 'Human Library' },
          { name: 'Blush', url: 'https://blush.design', desc: 'Customizable' },
          { name: 'DrawKit', url: 'https://drawkit.com', desc: 'Free Resources' },
          { name: 'IRA Design', url: 'https://iradesign.io', desc: 'Gradient Art' },
          { name: 'Ouch', url: 'https://icons8.com/illustrations', desc: 'Free Collection' }
        ]},
        { id: 'icons', name: 'Icon Resources', icon: '🔍', links: [
          { name: 'Iconify', url: 'https://iconify.design', desc: 'Icon Collections' },
          { name: 'Feather Icons', url: 'https://feathericons.com', desc: 'Minimal Icons' },
          { name: 'Flaticon', url: 'https://flaticon.com', desc: 'Free Icon Library' },
          { name: 'Heroicons', url: 'https://heroicons.com', desc: 'SVG Icons' },
          { name: 'Tabler Icons', url: 'https://tabler-icons.io', desc: 'Open Source' },
          { name: 'Phosphor Icons', url: 'https://phosphoricons.com', desc: 'Flexible Library' }
        ]},
        { id: 'inspiration', name: 'Design Inspiration', icon: '💡', links: [
          { name: 'Dribbble', url: 'https://dribbble.com', desc: 'Design Showcase' },
          { name: 'Behance', url: 'https://behance.net', desc: 'Creative Platform' },
          { name: 'Awwwards', url: 'https://awwwards.com', desc: 'Web Design Awards' },
          { name: 'Pinterest', url: 'https://pinterest.com', desc: 'Visual Discovery' },
          { name: 'Muzli', url: 'https://muz.li', desc: 'Design Inspiration' },
          { name: 'Siteinspire', url: 'https://siteinspire.com', desc: 'Website Showcase' }
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
              {resolvedParams.lang === 'zh' ? '设计资源导航' : 'Design Resources Navigation'}
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