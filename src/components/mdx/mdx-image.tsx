"use client";

import React from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * MDX 图片组件属性
 */
export interface MDXImageProps extends Omit<ImageProps, "src" | "alt"> {
  /** 图片源地址 */
  src: string;
  /** 图片描述文本 */
  alt?: string;
  /** 图片说明文字 */
  caption?: React.ReactNode;
  /** 是否优先加载 */
  priority?: boolean;
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
}

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 800;
const DEFAULT_PRIORITY = false;
const DEFAULT_QUALITY = 85;

export const MDXImage: React.FC<MDXImageProps> = ({
  src,
  alt = "",
  caption,
  width,
  height,
  priority = DEFAULT_PRIORITY,
  quality = DEFAULT_QUALITY,
  className,
  ...props
}) => {
  if (!src) return null;

  return (
    <figure className="not-prose my-6">
      <div className="overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          width={Number(width) || DEFAULT_WIDTH}
          height={Number(height) || DEFAULT_HEIGHT}
          priority={priority}
          quality={quality}
          className={cn("w-full max-w-full bg-muted object-cover", className)}
          {...props}
        />
      </div>
      {(caption || alt) && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption || alt}
        </figcaption>
      )}
    </figure>
  );
};
