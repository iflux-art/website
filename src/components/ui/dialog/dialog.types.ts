/**
 * dialog 组件类型定义
 */

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

/**
 * 对话框组件属性
 */
export interface DialogProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {}

/**
 * 对话框触发器组件属性
 */
export interface DialogTriggerProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> {}

/**
 * 对话框内容组件属性
 */
export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {}

/**
 * 对话框头部组件属性
 */
export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 对话框底部组件属性
 */
export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 对话框标题组件属性
 */
export interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

/**
 * 对话框描述组件属性
 */
export interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

/**
 * 对话框关闭按钮组件属性
 */
export interface DialogCloseProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {}

/**
 * 对话框传送门组件属性
 */
export interface DialogPortalProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal> {}

/**
 * 对话框遮罩层组件属性
 */
export interface DialogOverlayProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}
