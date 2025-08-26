import Image from "next/image";
import React from "react";

type MDXImgProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof Image>;

/**
 * Custom MDX Image component
 * Provides default width/height for images
 */
export const MDXImg = ({
  src,
  alt,
  width = 800, // Default width
  height = 450, // Default height (16:9 aspect ratio)
  className = "",
  ...props
}: MDXImgProps) => {
  const isRemote = src.startsWith("http");

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`my-6 w-full max-w-full rounded-lg border border-border bg-muted object-cover shadow-md ${className}`}
      style={isRemote ? undefined : { position: "relative", aspectRatio: "16/9" }}
      sizes={isRemote ? undefined : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      {...props}
    />
  );
};
