/**
 * Friends 功能相关类型定义
 */

/**
 * 友链数据模型
 * 独立的友链类型定义，替代对 LinksItem 的依赖
 */
export interface FriendLink {
  /** 唯一标识符 */
  id: string;
  /** 友链标题 */
  title: string;
  /** 友链URL */
  url: string;
  /** 友链描述 */
  description?: string;
  /** 所属分类，友链固定为 "friends" */
  category: "friends";
  /** 标签列表 */
  tags?: string[];
  /** 是否推荐 */
  featured?: boolean;
  /** 友链图标 */
  icon?: string;
  /** 图标类型 */
  iconType?: "image" | "text";
}

/**
 * 个人资料链接数据模型
 * 用于关于页面的个人资料链接展示
 */
export interface ProfileLink {
  /** 唯一标识符 */
  id: string;
  /** 链接标题 */
  title: string;
  /** 链接URL */
  url: string;
  /** 链接描述 */
  description?: string;
  /** 所属分类，个人资料固定为 "profile" */
  category: "profile";
  /** 标签列表 */
  tags?: string[];
  /** 是否推荐 */
  featured?: boolean;
  /** 链接图标 */
  icon?: string;
  /** 图标类型 */
  iconType?: "image" | "text";
}

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
