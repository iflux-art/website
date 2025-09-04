/**
 * Home 功能相关类型定义
 */

// 网站统计数据类型
export interface SiteStats {
  blogCount: number;
  docCount: number;
  friendCount: number;
  loading: boolean;
  error: string | null;
}
