/**
 * 搜索相关类型定义
 * @module types/search
 */

/**
 * 搜索结果项
 *
 * @interface SearchResult
 */
export interface SearchResult {
  /**
   * 结果唯一标识
   */
  id: string;

  /**
   * 结果标题
   */
  title: string;

  /**
   * 结果描述或摘要
   */
  description?: string;

  /**
   * 结果URL
   */
  url: string;

  /**
   * 结果分类
   */
  category: string;

  /**
   * 匹配的内容片段
   */
  content?: string;

  /**
   * 标签列表（适用于博客文章）
   */
  tags?: string[];

  /**
   * 发布日期（适用于博客文章）
   */
  date?: string;

  /**
   * 图标（可以是组件或字符串）
   */
  icon?: React.ComponentType<{ className?: string }> | string;
}

/**
 * 搜索响应
 *
 * @interface SearchResponse
 */
export interface SearchResponse {
  /**
   * 搜索结果列表
   */
  results: SearchResult[];

  /**
   * 结果总数
   */
  total: number;

  /**
   * 搜索查询
   */
  query?: string;

  /**
   * 错误信息
   */
  error?: string;
}

/**
 * 搜索分类
 *
 * @interface SearchCategory
 */
export interface SearchCategory {
  /**
   * 分类ID
   */
  id: string;

  /**
   * 分类标签
   */
  label: string;

  /**
   * 分类图标
   */
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * 搜索历史项
 *
 * @interface SearchHistoryItem
 */
export interface SearchHistoryItem {
  /**
   * 搜索查询
   */
  query: string;

  /**
   * 搜索时间
   */
  timestamp: number;
}

/**
 * 搜索钩子返回值
 *
 * @interface UseSearchReturn
 */
export interface UseSearchReturn {
  /**
   * 搜索结果
   */
  results: SearchResult[];

  /**
   * 是否正在加载
   */
  isLoading: boolean;

  /**
   * 是否有错误
   */
  isError: boolean;

  /**
   * 错误信息
   */
  error: string | null;

  /**
   * 执行搜索
   */
  search: (query: string, category?: string) => Promise<void>;

  /**
   * 清除搜索结果
   */
  clearResults: () => void;

  /**
   * 获取搜索历史
   */
  getSearchHistory: () => SearchHistoryItem[];

  /**
   * 清除搜索历史
   */
  clearSearchHistory: () => void;
}

/**
 * 搜索组件属性
 *
 * @interface SearchProps
 */
export interface SearchProps {
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 搜索对话框组件属性
 *
 * @interface SearchDialogProps
 */
export interface SearchDialogProps {
  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 是否打开
   */
  open?: boolean;

  /**
   * 打开状态变化回调
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * 搜索按钮组件属性
 *
 * @interface SearchButtonProps
 */
export interface SearchButtonProps {
  /**
   * 点击回调
   */
  onClick?: () => void;

  /**
   * 自定义类名
   */
  className?: string;
}
