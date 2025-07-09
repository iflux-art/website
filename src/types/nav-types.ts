/**
 * 导航相关类型定义
 */

import { ReactNode } from "react";
import { ClickableProps, URL } from "./common";

/**
 * 导航组件的基础属性接口
 */
export interface NavProps {
  /**
   * 点击后的回调函数（用于关闭移动菜单）
   */
  onClose?: () => void;

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 导航菜单组件的属性接口
 */
export interface NavMenuProps extends NavProps {
  /**
   * 显示模式：links 为链接列表，cards 为卡片模式
   */
  mode: "links" | "cards";
}

/**
 * 导航链接组件属性
 */
export interface NavLinkProps extends ClickableProps {
  /** 链接地址 */
  href: URL;
  /** 链接内容 */
  children: ReactNode;
  /** 当前文档标识符，用于更灵活的匹配 */
  currentDoc?: string;
  /** 活动状态的类名 */
  activeClassName?: string;
  /** 非活动状态的类名 */
  inactiveClassName?: string;
  /** 鼠标进入事件处理函数 */
  onMouseEnter?: () => void;
  /** 鼠标离开事件处理函数 */
  onMouseLeave?: () => void;
  /** 链接目标 */
  target?: string;
  /** 链接关系 */
  rel?: string;
  /** 是否为导航类型链接 */
  _isNavigation?: boolean;
}
