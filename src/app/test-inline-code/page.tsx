"use client";

import React from "react";
import { InlineCode } from "@/components/ui/markdown/inline-code";

export default function TestInlineCodePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">行内代码测试页面</h1>
      
      <h2 className="text-2xl font-semibold mb-4">基本行内代码</h2>
      <p className="mb-4">
        这是一个基本的行内代码示例：<InlineCode>const x = 42;</InlineCode>
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 mt-8">包含路径的行内代码</h2>
      <p className="mb-4">
        组件路径示例：<InlineCode>components/ui/</InlineCode>
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 mt-8">包含特殊字符的行内代码</h2>
      <p className="mb-4">
        特殊字符示例：<InlineCode>function test() { return true; }</InlineCode>
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 mt-8">包含反引号的行内代码</h2>
      <p className="mb-4">
        这是一个包含反引号的示例：<InlineCode>`code`</InlineCode>
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 mt-8">测试不同的内容类型</h2>
      <p className="mb-4">
        字符串内容：<InlineCode>{"这是一个字符串"}</InlineCode>
      </p>
      <p className="mb-4">
        带反引号的字符串：<InlineCode>{"`components/ui/`"}</InlineCode>
      </p>
    </div>
  );
}
