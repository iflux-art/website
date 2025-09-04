/**
 * Friends 功能相关工具函数
 */

import type { FriendLink, FriendLinkRequirement, FriendsPageConfig } from "../types";

/**
 * 友链表单URL配置
 */
export const FRIEND_LINK_FORM_URL =
  "https://ocnzi0a8y98s.feishu.cn/share/base/form/shrcnB0sog9RdZVM8FLJNXVsFFb";

/**
 * 友链申请要求配置
 */
export const FRIEND_LINK_REQUIREMENTS: FriendLinkRequirement[] = [
  {
    icon: "Globe",
    title: "内容优质",
    description: "原创内容为主",
  },
  {
    icon: "Users",
    title: "更新活跃",
    description: "定期更新内容",
  },
  {
    icon: "Heart",
    title: "互相支持",
    description: "共同成长进步",
  },
];

/**
 * 默认友链页面配置
 */
export const DEFAULT_FRIENDS_CONFIG: FriendsPageConfig = {
  application: {
    formUrl: FRIEND_LINK_FORM_URL,
    title: "申请友情链接",
    description:
      "欢迎与我们交换友情链接！我们希望与优质的网站建立合作关系，共同成长。如果您的网站内容优质、更新活跃，欢迎申请友链。",
  },
  requirements: FRIEND_LINK_REQUIREMENTS,
  showComments: true,
};

/**
 * 处理友链数据，转换为标准格式
 * @param friendsData 原始友链数据
 * @returns 处理后的友链数据
 */
export function processFriendsData(friendsData: unknown[]): FriendLink[] {
  return friendsData.map(item => ({
    ...(item as FriendLink),
    category: "friends" as const,
    iconType: ((item as FriendLink & { iconType?: "image" | "text" }).iconType ?? "image") as
      | "image"
      | "text",
  }));
}

/**
 * 检查是否有友链数据
 * @param friendsItems 友链数据
 * @returns 是否有数据
 */
export function hasFriendsData(friendsItems: FriendLink[]): boolean {
  return friendsItems.length > 0;
}
