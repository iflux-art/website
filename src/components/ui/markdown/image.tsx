// 导入 React 中的 ComponentProps 类型，用于获取组件属性的类型
import { ComponentProps } from "react";
// 导入 Next.js 中的 Image 组件
import NextImage from "next/image";

// 定义 Height 类型，它是 NextImage 组件 height 属性的类型
type Height = ComponentProps<typeof NextImage>["height"];
// 定义 Width 类型，它是 NextImage 组件 width 属性的类型
type Width = ComponentProps<typeof NextImage>["width"];

/**
 * 自定义的图片组件，封装了 NextImage 组件
 * @param src - 图片的源地址
 * @param alt - 图片的替代文本，默认为 "alt"
 * @param width - 图片的宽度，默认为 800
 * @param height - 图片的高度，默认为 350
 * @param props - 其他传递给 NextImage 组件的属性
 * @returns 如果 src 为空则返回 null，否则返回封装后的 NextImage 组件
 */
export default function Image({
  src,
  alt = "alt",
  width = 800,
  height = 350,
  ...props
}: ComponentProps<"img">) {
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
