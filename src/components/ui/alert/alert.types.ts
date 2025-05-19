/**
 * alert 组件类型定义
 */

import * as React from "react";
import { VariantProps } from "class-variance-authority";
import { alertVariants } from "./alert";

/**
 * 警告框组件属性
 */
export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

/**
 * 警告框标题组件属性
 */
export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * 警告框描述组件属性
 */
export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
