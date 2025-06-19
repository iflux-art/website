/**
 * MDX 配置文件
 */

// MDX 基础样式配置
export const MDX_STYLE_CONFIG = {
  // 主要内容区域样式
  prose: 'prose dark:prose-invert max-w-none',

  // 代码块样式
  codeBlock: {
    pre: 'relative my-4 rounded-lg',
    code: 'block p-4 overflow-x-auto text-sm leading-normal',
    copy: 'absolute right-2 top-2',
  },

  // 内联代码样式
  inlineCode: 'rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',

  // 链接样式
  link: 'mdx-link inline-block',

  // 图片样式
  image: {
    wrapper: 'my-4 w-full flex justify-center',
    img: 'rounded-lg max-w-full h-auto',
  },
} as const;

// MDX 组件默认配置
export const MDX_DEFAULT_OPTIONS = {
  // 编译选项
  compile: {
    parseFrontmatter: true,
    development: process.env.NODE_ENV === 'development',
  },

  // 图片配置
  image: {
    defaultWidth: 800,
    defaultHeight: 600,
    priority: false,
  },
} as const;

// MDX 解析配置
export const MDX_PARSE_OPTIONS = {
  // 支持的文件扩展名
  extensions: ['.mdx', '.md'],

  // frontmatter 配置
  frontmatter: {
    required: ['title'],
    optional: ['description', 'date', 'tags', 'draft'],
  },
} as const;
