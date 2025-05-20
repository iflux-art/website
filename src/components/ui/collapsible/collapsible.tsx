"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import {
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps
} from "./collapsible.types";

/**
 * Collapsible 组件
 * 用于创建可折叠的内容区域
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 *
 * @example
 * <Collapsible>
 *   <CollapsibleTrigger>点击展开</CollapsibleTrigger>
 *   <CollapsibleContent>折叠内容</CollapsibleContent>
 * </Collapsible>
 */
const Collapsible = CollapsiblePrimitive.Root;

/**
 * CollapsibleTrigger 组件
 * 用于触发折叠面板的展开和收起
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

/**
 * CollapsibleContent 组件
 * 折叠面板的内容区域
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CollapsibleContent = CollapsiblePrimitive.Content;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };