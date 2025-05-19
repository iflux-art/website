"use client";

import React from "react";
import { Button } from "@/components/ui/button";

/**
 * 友情链接申请组件属性
 *
 * @interface FriendLinkApplicationProps
 */
interface FriendLinkApplicationProps {
  /**
   * 友情链接申请条件列表
   */
  requirements: string[];

  /**
   * 申请友情链接的回调函数
   * @default () => {}
   */
  onApply?: () => void;
}

/**
 * 友情链接申请组件
 *
 * 用于显示友情链接页面中的申请部分，包括申请条件和申请按钮
 *
 * @param {FriendLinkApplicationProps} props - 组件属性
 * @returns {JSX.Element} 友情链接申请组件
 *
 * @example
 * ```tsx
 * <FriendLinkApplication
 *   requirements={[
 *     "网站内容健康，无违法内容",
 *     "网站已稳定运行3个月以上"
 *   ]}
 *   onApply={() => console.log('申请友链')}
 * />
 * ```
 */
export function FriendLinkApplication({
  requirements,
  onApply = () => {}
}: FriendLinkApplicationProps) {
  return (
    <div className="mt-10 p-6 border border-border rounded-lg bg-muted/30">
      <h2 className="text-xl font-semibold mb-4">申请友链</h2>
      <p className="mb-4">
        如果您想与本站交换友链，请确保您的网站符合以下条件：
      </p>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        {requirements.map((requirement, index) => (
          <li key={index}>{requirement}</li>
        ))}
      </ul>
      <div className="mt-6">
        <Button
          onClick={onApply}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          申请友链
        </Button>
      </div>
    </div>
  );
}