"use client";

import React from "react";
import { DirectCodeBlock } from "@/components/ui/markdown/code-block/direct-code-block";

export default function TestCodeBlockPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">代码块测试页面</h1>
      
      <h2 className="text-2xl font-semibold mb-4">JavaScript 代码块</h2>
      <DirectCodeBlock language="javascript">
        {`// 这是一个 JavaScript 函数
function hello() {
  console.log("Hello, World!");
  return "Hello, World!";
}

// 调用函数
hello();`}
      </DirectCodeBlock>
      
      <h2 className="text-2xl font-semibold mb-4 mt-8">TypeScript 代码块</h2>
      <DirectCodeBlock language="typescript">
        {`// 这是一个 TypeScript 接口
interface User {
  id: number;
  name: string;
  email: string;
}

// 这是一个 TypeScript 类
class UserService {
  private users: User[] = [];

  constructor() {
    console.log("UserService initialized");
  }

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User): void {
    this.users.push(user);
  }
}`}
      </DirectCodeBlock>
      
      <h2 className="text-2xl font-semibold mb-4 mt-8">CSS 代码块</h2>
      <DirectCodeBlock language="css">
        {`.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.button {
  background-color: #3490dc;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #2779bd;
}`}
      </DirectCodeBlock>
    </div>
  );
}
