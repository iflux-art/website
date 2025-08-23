/**
 * Friends 功能相关类型定义
 */

export interface FriendLinkFormConfig {
  /** 友链申请表单URL */
  formUrl: string;
  /** 表单标题 */
  title?: string;
  /** 表单描述 */
  description?: string;
}

export interface FriendLinkRequirement {
  /** 要求图标 */
  icon: string;
  /** 要求标题 */
  title: string;
  /** 要求描述 */
  description: string;
}

export interface FriendsPageConfig {
  /** 友链申请表单配置 */
  application: FriendLinkFormConfig;
  /** 友链申请要求 */
  requirements: FriendLinkRequirement[];
  /** 是否显示评论区 */
  showComments?: boolean;
}
