'use client';

import React from 'react';

/**
 * 测试组件 - 用于测试 ESLint 颜色检查规则
 * 此组件故意使用传统颜色名称，以测试 ESLint 规则是否能正确检测
 */
export function TestColorComponent() {
  return (
    <div className="p-4">
      <h2 className="text-blue-500 mb-4">传统颜色名称测试</h2>
      <p className="text-gray-700 mb-2">这是一个使用传统颜色名称的段落</p>
      <div className="bg-red-100 p-3 rounded-md border border-red-300">
        这是一个使用传统背景颜色的 div
      </div>
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
        传统按钮颜色
      </button>
    </div>
  );
}
