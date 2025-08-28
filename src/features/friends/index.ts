/**
 * Friends 功能模块统一导出
 */

// 组件导出
export { FriendLinkApplication } from "./components/friend-link-application";
export { FriendsPageContainer } from "./components/friends-page-container";

// 类型导出
export type {
  FriendsPageConfig,
  FriendLinkFormConfig,
  FriendLinkRequirement,
} from "./types";

// 工具函数导出
export {
  processFriendsData,
  hasFriendsData,
  DEFAULT_FRIENDS_CONFIG,
  FRIEND_LINK_FORM_URL,
  FRIEND_LINK_REQUIREMENTS,
} from "./lib";
