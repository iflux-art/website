"use client";

import { ClientMDXRenderer } from "@/components/mdx";

export default function InlineCodeDemo() {
  // MDX content with inline code examples
  const mdxContent = `
# 行内代码演示

这是一个演示行内代码样式的文章。

在编程中，我们经常需要使用行内代码来标记特定的代码片段，比如变量名 \`userName\` 或函数名 \`calculateTotal()\`。

有时候代码片段中会包含反引号，比如 \`const message = \`Hello, world!\`;\`，我们的组件应该能够正确处理这种情况。

我们还可以对行内代码进行样式定制，比如让它们具有不同的背景色或字体样式。

下面是一些更多的示例：
- 使用 \`npm install\` 命令安装依赖
- 在React中使用 \`useState\` Hook
- CSS中的 \`background-color\` 属性
- JavaScript中的 \`console.log()\` 方法

注意观察这些行内代码的样式表现，特别是反引号是否被正确隐藏。
`;

  return (
    <div className="container py-8 mx-auto">
      <div className="prose prose-lg dark:prose-invert mx-auto">
        <h1>行内代码样式演示</h1>
        <ClientMDXRenderer content={mdxContent} />
      </div>
    </div>
  );
}
