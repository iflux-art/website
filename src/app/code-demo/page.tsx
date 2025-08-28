"use client";

import { CodeBlock } from "@/features/code";
import "@/features/code/styles/prism-custom.css"; // 使用绝对导入路径

const jsCode = `// 示例 JavaScript 代码
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome, \${name}!\`;
}

// 调用函数
const message = greet("World");
console.log(message);`;

const tsxCode = `// 示例 React 组件
import React, { useState, useEffect } from 'react';

interface UserProps {
  name: string;
  age?: number;
}

export function UserProfile({ name, age = 0 }: UserProps) {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    // 组件挂载后设置为活跃状态
    setIsActive(true);
    
    return () => {
      // 组件卸载时清理
      setIsActive(false);
    };
  }, []);
  
  return (
    <div className={isActive ? "active" : ""}>
      <h2>User Profile</h2>
      <p>Name: {name}</p>
      {age > 0 && <p>Age: {age}</p>}
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? "Deactivate" : "Activate"}
      </button>
    </div>
  );
}`;

const cssCode = `/* 卡片样式 */
.card {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
  background-color: white;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.card-content {
  color: #666;
  line-height: 1.5;
}`;

const pythonCode = `# 示例 Python 代码
def fibonacci(n):
    """
    计算斐波那契数列的第n个数
    使用动态规划方法避免重复计算
    """
    if n <= 0:
        return 0
    elif n == 1:
        return 1
        
    # 使用动态规划计算斐波那契数列
    fib = [0] * (n + 1)
    fib[1] = 1
    
    for i in range(2, n + 1):
        fib[i] = fib[i-1] + fib[i-2]
        
    return fib[n]

# 测试函数
for i in range(10):
    print(f"fibonacci({i}) = {fibonacci(i)}")`;

const jsonCode = `{
  "name": "code-highlight-demo",
  "version": "1.0.0",
  "description": "一个展示代码高亮功能的演示项目",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.5.0",
    "prismjs": "^1.30.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "typescript": "^5.9.2",
    "tailwindcss": "^4.1.12"
  }
}`;

export default function CodeHighlightDemo() {
  return (
    <div className="container py-8 mx-auto space-y-10">
      <div className="prose prose-lg dark:prose-invert mx-auto">
        <h1>代码高亮演示</h1>
        <p>
          这个页面展示了增强的代码高亮效果，使用 Prism.js
          实现客户端代码高亮。支持多种编程语言、行号、行高亮、文件名标题栏和复制按钮功能。
        </p>

        <h2>JavaScript 示例</h2>
        <CodeBlock
          code={jsCode}
          language="javascript"
          fileName="example.js"
          showLineNumbers={true}
          highlightLines={[2, 3]}
        />

        <h2>React TSX 示例</h2>
        <CodeBlock
          code={tsxCode}
          language="tsx"
          fileName="UserProfile.tsx"
          showLineNumbers={true}
          highlightLines={[4, 5, 6, 7, 8, 20, 21]}
        />

        <h2>CSS 示例</h2>
        <CodeBlock
          code={cssCode}
          language="css"
          fileName="styles.css"
          showLineNumbers={true}
          highlightLines={[8, 9, 10, 11, 12]}
        />

        <h2>Python 示例</h2>
        <CodeBlock
          code={pythonCode}
          language="python"
          fileName="fibonacci.py"
          showLineNumbers={true}
          highlightLines={[13, 14, 15, 16]}
        />

        <h2>JSON 示例</h2>
        <CodeBlock code={jsonCode} language="json" fileName="package.json" showLineNumbers={true} />

        <h2>不同选项示例</h2>
        <h3>无行号</h3>
        <CodeBlock
          code={jsCode.split("\n").slice(0, 3).join("\n")}
          language="javascript"
          fileName="no-line-numbers.js"
          showLineNumbers={false}
        />

        <h3>无文件名</h3>
        <CodeBlock
          code={jsCode.split("\n").slice(0, 3).join("\n")}
          language="javascript"
          showLineNumbers={true}
        />

        <h3>无高亮行</h3>
        <CodeBlock code={jsCode} language="javascript" fileName="plain.js" showLineNumbers={true} />
      </div>
    </div>
  );
}
