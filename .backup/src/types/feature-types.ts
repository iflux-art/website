/**
 * 功能组件类型定义
 */

// 主题切换组件属性
export interface ThemeToggleProps {
  className?: string;
}

// 搜索对话框组件属性
export interface SearchDialogProps {
  className?: string;
}

// 搜索组件属性
export interface SearchProps {
  className?: string;
}

// Logo组件属性
export interface LogoProps {
  className?: string;
}

// 博客相关组件属性
export interface BlogListProps {
  posts: any[];
  className?: string;
}

export interface BlogPostCardProps {
  post: any;
  className?: string;
}

export interface AuthorCardProps {
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  className?: string;
}

export interface TagCloudProps {
  tags: string[];
  className?: string;
}

// 文档相关组件属性
export interface DocCategoryCardProps {
  category: {
    title: string;
    description: string;
    icon?: string;
    href: string;
  };
  className?: string;
}

export interface RecentDocsListProps {
  docs: any[];
  className?: string;
}

// 友情链接相关组件属性
export interface FriendCardProps {
  friend: {
    name: string;
    avatar?: string;
    description?: string;
    url: string;
  };
  className?: string;
}

export interface FriendCardsProps {
  friends: any[];
  className?: string;
}