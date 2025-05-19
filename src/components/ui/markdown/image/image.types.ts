/**
 * image 组件类型定义
 */

import { ComponentProps } from "react";

export interface ImageProps extends ComponentProps<"img"> {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}
