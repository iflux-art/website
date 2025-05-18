"use client";

import { FeatureCard } from "./feature-card";

interface FeatureCardsProps {
  lang: string;
}

export function FeatureCards({ lang }: FeatureCardsProps) {
  const features = [
    {
      href: `/${lang}/docs`,
      title: {
        zh: "文档中心",
        en: "Documentation"
      },
      description: {
        zh: "查看产品文档和使用指南",
        en: "View product documentation and guides"
      }
    },
    {
      href: `/${lang}/blog`,
      title: {
        zh: "博客",
        en: "Blog"
      },
      description: {
        zh: "阅读最新的技术文章和分享",
        en: "Read the latest tech articles and shares"
      }
    },
    {
      href: `/${lang}/navigation`,
      title: {
        zh: "网站导航",
        en: "Navigation"
      },
      description: {
        zh: "发现有用的开发资源和工具",
        en: "Discover useful development resources and tools"
      }
    },
    {
      href: `/${lang}/friends`,
      title: {
        zh: "友情链接",
        en: "Friend Links"
      },
      description: {
        zh: "查看合作伙伴和友情站点",
        en: "View partners and friendly sites"
      }
    }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {features.map((feature) => (
        <FeatureCard
          key={feature.href}
          href={feature.href}
          title={feature.title}
          description={feature.description}
          lang={lang}
        />
      ))}
    </section>
  );
}