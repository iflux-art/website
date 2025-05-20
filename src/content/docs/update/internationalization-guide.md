# 国际化实施指南

## 1. 国际化目标

本指南详细说明如何在项目中实现完整的国际化（i18n）支持，使应用能够适应不同语言和地区的用户需求。

### 1.1 主要目标

- **多语言支持**：支持中文和英文两种语言
- **动态语言切换**：允许用户在不刷新页面的情况下切换语言
- **内容翻译**：实现内容的自动翻译
- **本地化格式**：根据用户语言设置显示适当的日期、时间和数字格式

### 1.2 技术选择

- **路由国际化**：使用 Next.js 的动态路由 `[lang]`
- **UI文本国际化**：使用 next-intl 库
- **内容国际化**：使用自动翻译脚本
- **格式化**：使用 Intl API 进行日期、时间和数字格式化

## 2. 路由国际化

### 2.1 动态语言路由

使用 Next.js App Router 的动态路由功能实现语言路由：

```
src/
  └── app/
      ├── [lang]/          # 语言动态路由
      │   ├── page.tsx     # 首页
      │   ├── about/       # 关于页面
      │   │   └── page.tsx
      │   ├── blog/        # 博客页面
      │   │   ├── page.tsx
      │   │   └── [slug]/
      │   │       └── page.tsx
      │   └── layout.tsx   # 语言特定布局
      └── layout.tsx       # 根布局
```

### 2.2 语言路由实现

#### 2.2.1 根布局

```tsx
// app/layout.tsx
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 重定向到默认语言路由
  redirect('/zh');

  return children;
}
```

#### 2.2.2 语言特定布局

```tsx
// app/[lang]/layout.tsx
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const locale = getLocale(params.lang);
  const messages = await getMessages(locale);

  return {
    title: {
      template: `%s | ${messages.site.name}`,
      default: messages.site.name,
    },
    description: messages.site.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  const locale = getLocale(params.lang);
  const messages = await getMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 2.3 语言检测和重定向

```typescript
// lib/i18n.ts
import { cookies, headers } from 'next/headers';

export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export function getLocale(lang?: string): Locale {
  // 如果提供了有效的语言参数，使用它
  if (lang && locales.includes(lang as Locale)) {
    return lang as Locale;
  }

  // 尝试从cookie获取语言设置
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  if (localeCookie?.value && locales.includes(localeCookie.value as Locale)) {
    return localeCookie.value as Locale;
  }

  // 尝试从Accept-Language头获取语言设置
  const headersList = headers();
  const acceptLanguage = headersList.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .find(lang => locales.includes(lang.substring(0, 2) as Locale));

    if (preferredLocale) {
      return preferredLocale.substring(0, 2) as Locale;
    }
  }

  // 默认返回中文
  return 'zh';
}
```

## 3. UI文本国际化

### 3.1 使用 next-intl

#### 3.1.1 安装依赖

```bash
pnpm add next-intl
```

#### 3.1.2 创建语言文件

```
src/
  └── messages/
      ├── en.json
      └── zh.json
```

```json
// messages/zh.json
{
  "site": {
    "name": "斐流艺创",
    "description": "斐启智境 · 流韵新生"
  },
  "nav": {
    "home": "首页",
    "blog": "博客",
    "docs": "文档",
    "about": "关于"
  },
  "common": {
    "readMore": "阅读更多",
    "loading": "加载中...",
    "error": "出错了",
    "notFound": "页面不存在"
  },
  "home": {
    "hero": {
      "title": "斐流艺创",
      "subtitle": "斐启智境 · 流韵新生",
      "cta": "了解更多"
    }
  }
}
```

```json
// messages/en.json
{
  "site": {
    "name": "iFluxArt",
    "description": "Ignite Wisdom · Flow Creativity"
  },
  "nav": {
    "home": "Home",
    "blog": "Blog",
    "docs": "Docs",
    "about": "About"
  },
  "common": {
    "readMore": "Read More",
    "loading": "Loading...",
    "error": "An error occurred",
    "notFound": "Page not found"
  },
  "home": {
    "hero": {
      "title": "iFluxArt",
      "subtitle": "Ignite Wisdom · Flow Creativity",
      "cta": "Learn More"
    }
  }
}
```

#### 3.1.3 加载语言文件

```typescript
// lib/i18n.ts
import { Locale } from './i18n';

export async function getMessages(locale: Locale) {
  return (await import(`../messages/${locale}.json`)).default;
}
```

### 3.2 使用翻译

#### 3.2.1 在服务器组件中使用

```tsx
// app/[lang]/page.tsx
import { getMessages, getLocale } from '@/lib/i18n';

export default async function HomePage({
  params,
}: {
  params: { lang: string };
}) {
  const locale = getLocale(params.lang);
  const messages = await getMessages(locale);

  return (
    <div>
      <h1>{messages.home.hero.title}</h1>
      <p>{messages.home.hero.subtitle}</p>
      <button>{messages.home.hero.cta}</button>
    </div>
  );
}
```

#### 3.2.2 在客户端组件中使用

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function Navbar() {
  const t = useTranslations();

  return (
    <nav>
      <ul>
        <li><a href="/zh">{t('nav.home')}</a></li>
        <li><a href="/zh/blog">{t('nav.blog')}</a></li>
        <li><a href="/zh/docs">{t('nav.docs')}</a></li>
        <li><a href="/zh/about">{t('nav.about')}</a></li>
      </ul>
    </nav>
  );
}
```

### 3.3 语言切换组件

```tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales } from '@/lib/i18n';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    // 从当前路径中提取语言无关的部分
    const pathWithoutLocale = pathname.replace(/^\/[^\/]+/, '');

    // 构建新的URL
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    // 设置cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    // 导航到新URL
    router.push(newPath);
  };

  return (
    <div className="language-switcher">
      {locales.map(locale => (
        <button
          key={locale}
          onClick={() => handleLanguageChange(locale)}
          className={locale === currentLocale ? 'active' : ''}
        >
          {locale === 'zh' ? '中文' : 'English'}
        </button>
      ))}
    </div>
  );
}
```

## 4. 内容国际化

### 4.1 内容组织

按语言组织内容文件：

```
src/
  └── content/
      ├── zh/              # 中文内容（源内容）
      │   ├── blog/
      │   │   └── post-1.mdx
      │   └── docs/
      │       └── guide.mdx
      └── en/              # 英文内容（自动生成）
          ├── blog/
          │   └── post-1.mdx
          └── docs/
              └── guide.mdx
```

### 4.2 自动翻译脚本

创建自动翻译脚本，在构建时将中文内容翻译为英文：

```typescript
// scripts/translate-content.ts
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const API_KEY = process.env.TRANSLATION_API_KEY;
const SOURCE_DIR = path.join(process.cwd(), 'src/content/zh');
const TARGET_DIR = path.join(process.cwd(), 'src/content/en');

async function translateText(text: string, targetLang: string = 'en'): Promise<string> {
  // 实现翻译API调用
  // 这里使用示例API，实际使用时替换为真实的翻译API
  const response = await fetch('https://api.translation-service.com/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      text,
      source: 'zh',
      target: targetLang,
    }),
  });

  const data = await response.json();
  return data.translatedText;
}

async function translateFile(filePath: string): Promise<void> {
  // 读取源文件
  const content = fs.readFileSync(filePath, 'utf8');

  // 解析frontmatter和内容
  const { data: frontmatter, content: markdownContent } = matter(content);

  // 翻译frontmatter中的特定字段
  const translatedFrontmatter = { ...frontmatter };
  if (frontmatter.title) {
    translatedFrontmatter.title = await translateText(frontmatter.title);
  }
  if (frontmatter.excerpt) {
    translatedFrontmatter.excerpt = await translateText(frontmatter.excerpt);
  }

  // 翻译markdown内容
  const translatedContent = await translateText(markdownContent);

  // 构建目标文件路径
  const relativePath = path.relative(SOURCE_DIR, filePath);
  const targetPath = path.join(TARGET_DIR, relativePath);

  // 确保目标目录存在
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  // 写入翻译后的文件
  const translatedFile = matter.stringify(translatedContent, translatedFrontmatter);
  fs.writeFileSync(targetPath, translatedFile);

  console.log(`Translated: ${relativePath}`);
}

async function translateAllFiles(): Promise<void> {
  // 获取所有源文件
  const files = globSync('**/*.{md,mdx}', { cwd: SOURCE_DIR });

  // 翻译每个文件
  for (const file of files) {
    const filePath = path.join(SOURCE_DIR, file);
    await translateFile(filePath);
  }

  console.log('Translation completed!');
}

// 执行翻译
translateAllFiles().catch(console.error);
```

### 4.3 集成到构建流程

在 `package.json` 中添加翻译脚本：

```json
{
  "scripts": {
    "translate": "ts-node scripts/translate-content.ts",
    "build": "pnpm translate && next build"
  }
}
```

## 5. 格式化

### 5.1 日期格式化

创建日期格式化工具：

```typescript
// lib/format.ts
import { Locale } from './i18n';

/**
 * 格式化日期
 * @param date 要格式化的日期
 * @param locale 语言环境
 * @param options 格式化选项
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string | number,
  locale: Locale = 'zh',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  return new Intl.DateTimeFormat(
    locale === 'zh' ? 'zh-CN' : 'en-US',
    options
  ).format(dateObj);
}
```

### 5.2 数字格式化

创建数字格式化工具：

```typescript
// lib/format.ts
/**
 * 格式化数字
 * @param number 要格式化的数字
 * @param locale 语言环境
 * @param options 格式化选项
 * @returns 格式化后的数字字符串
 */
export function formatNumber(
  number: number,
  locale: Locale = 'zh',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(
    locale === 'zh' ? 'zh-CN' : 'en-US',
    options
  ).format(number);
}
```

### 5.3 使用格式化工具

```tsx
import { formatDate, formatNumber } from '@/lib/format';
import { useLocale } from 'next-intl';

export function PostMeta({ date, viewCount }: { date: string; viewCount: number }) {
  const locale = useLocale();

  return (
    <div className="post-meta">
      <time>{formatDate(date, locale as Locale)}</time>
      <span>{formatNumber(viewCount, locale as Locale)} 次阅读</span>
    </div>
  );
}
```

## 6. 实施计划

### 6.1 实施步骤

1. **准备工作**：
   - 安装必要的依赖
   - 创建语言文件结构

2. **路由国际化**：
   - 实现动态语言路由
   - 添加语言检测和重定向

3. **UI文本国际化**：
   - 创建语言文件
   - 实现语言切换组件
   - 更新组件使用翻译

4. **内容国际化**：
   - 组织内容文件结构
   - 实现自动翻译脚本
   - 集成到构建流程

5. **格式化**：
   - 实现日期和数字格式化
   - 更新组件使用格式化工具

### 6.2 测试和验证

- 测试语言切换功能
- 验证内容翻译质量
- 检查格式化是否正确
- 测试不同浏览器和设备

## 7. 结论

通过实施本指南中的国际化策略，我们可以使应用支持多种语言，提升全球用户的使用体验。国际化不仅仅是翻译文本，还包括适应不同地区的格式和习惯，是提升应用全球可用性的重要步骤。
