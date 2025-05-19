/**
 * card 组件类型定义
 */

import * as React from "react";

/**
 * 卡片组件属性
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片头部组件属性
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片标题组件属性
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * 卡片描述组件属性
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * 卡片内容组件属性
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片底部组件属性
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
