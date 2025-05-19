import { ComponentProps } from "react";
import NextImage from "next/image";
import { ImageProps } from "./image.types";

// 定义 Height 类型，它是 NextImage 组件 height 属性的类型
type Height = ComponentProps<typeof NextImage>["height"];
// 定义 Width 类型，它是 NextImage 组件 width 属性的类型
type Width = ComponentProps<typeof NextImage>["width"];

/**
 * 自定义的图片组件
 * 封装了 NextImage 组件，提供默认值和类型安全
 */
export default function Image({
  src,
  alt = "alt",
  width = 800,
  height = 350,
  ...props
}: ImageProps) {
  // 如果图片源地址为空，则不渲染图片，返回 null
  if (!src) return null;
  return (
    // 渲染 NextImage 组件，并传递相应的属性
    <NextImage
      src={src}
      alt={alt}
      width={width as Width}
      height={height as Height}
      quality={40}
      {...props}
    />
  );
}
