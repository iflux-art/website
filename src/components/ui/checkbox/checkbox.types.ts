/**
 * checkbox 组件类型定义
 */

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}
