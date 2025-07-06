import { compileMDX } from "next-mdx-remote/rsc";
import { cn } from "@/lib/utils";
import { MDXStaticComponents } from "./mdx-static-components";
import { MDXInteractiveComponents } from "./mdx-interactive-components";
import { MDXCodeBlock } from "./mdx-code-block";
import { MDXCodeInline } from "./mdx-codeInline";
import { MDXTableComponents } from "./mdx-table";
import type { ComponentProps } from "react";

interface MDXRemoteRendererProps {
  source: string;
}

export async function MDXRemoteRenderer({ source }: MDXRemoteRendererProps) {
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          () => (tree) => {
            if (tree.children) {
              tree.children.forEach(
                (node: { type: string; value?: string }) => {
                  if (node.type === "code" && node.value) {
                    // 保留原始代码内容
                  }
                },
              );
            }
          },
        ],
        rehypePlugins: [],
      },
    },
    components: {
      ...MDXStaticComponents,
      ...MDXInteractiveComponents,
      ...MDXTableComponents,
      pre: (props: ComponentProps<typeof MDXCodeBlock>) => (
        <MDXCodeBlock
          {...props}
          className={props.className || ""}
          filename={props.filename}
        />
      ),
      code: (props: ComponentProps<typeof MDXCodeInline>) => (
        <MDXCodeInline
          {...props}
          className={cn(
            props.className || "",
            "rounded bg-muted px-1.5 py-0.5",
          )}
        />
      ),
    },
  });

  return content;
}
