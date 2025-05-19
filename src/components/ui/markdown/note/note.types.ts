/**
 * note 组件类型定义
 */

import { PropsWithChildren } from "react";

export type NoteProps = PropsWithChildren & {
  /** 可选的标题属性 */
  title?: string;
  /** 可选的类型属性，限定为四种值 */
  type?: "note" | "danger" | "warning" | "success";
};
