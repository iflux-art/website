/**
 * blog-timeline-list 组件类型定义
 */

/**
 * 博客时间轴列表组件属性
 *
 * @interface BlogTimelineListProps
 */
export interface BlogTimelineListProps {
  /**
   * 最大显示年份数量
   * @default Infinity
   */
  limit?: number;
}

/**
 * 按月份分组的文章类型
 */
export interface PostsByMonth {
  [month: string]: {
    date: Date;
    posts: any[];
  }
}
