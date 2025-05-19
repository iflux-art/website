"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

/**
 * Checkbox 组件示例
 * 展示了如何使用 Checkbox 组件创建不同类型的复选框
 */
export function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  const [formData, setFormData] = useState({
    terms: false,
    newsletter: false,
    updates: false,
  });
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`表单数据: ${JSON.stringify(formData, null, 2)}`);
  };
  
  return (
    <div className="space-y-8">
      {/* 基本用法 */}
      <div>
        <h3 className="text-lg font-medium mb-2">基本用法</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            接受条款和条件
          </label>
        </div>
      </div>

      {/* 禁用状态 */}
      <div>
        <h3 className="text-lg font-medium mb-2">禁用状态</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="disabled" disabled />
          <label
            htmlFor="disabled"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            禁用状态
          </label>
        </div>
      </div>

      {/* 默认选中 */}
      <div>
        <h3 className="text-lg font-medium mb-2">默认选中</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="default-checked" defaultChecked />
          <label
            htmlFor="default-checked"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            默认选中
          </label>
        </div>
      </div>

      {/* 受控组件 */}
      <div>
        <h3 className="text-lg font-medium mb-2">受控组件</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="controlled"
              checked={checked}
              onCheckedChange={setChecked}
            />
            <label
              htmlFor="controlled"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {checked ? "已选中" : "未选中"}
            </label>
          </div>
          <div className="text-sm text-muted-foreground">
            当前状态: {checked ? "已选中" : "未选中"}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChecked(!checked)}
          >
            切换状态
          </Button>
        </div>
      </div>

      {/* 与表单一起使用 */}
      <div>
        <h3 className="text-lg font-medium mb-2">与表单一起使用</h3>
        <form onSubmit={handleFormSubmit} className="space-y-4 border p-4 rounded-md">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="form-terms" 
                checked={formData.terms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, terms: checked as boolean }))
                }
              />
              <label
                htmlFor="form-terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                接受条款和条件
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="form-newsletter" 
                checked={formData.newsletter}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, newsletter: checked as boolean }))
                }
              />
              <label
                htmlFor="form-newsletter"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                订阅新闻邮件
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="form-updates" 
                checked={formData.updates}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, updates: checked as boolean }))
                }
              />
              <label
                htmlFor="form-updates"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                接收产品更新通知
              </label>
            </div>
          </div>
          <Button type="submit">提交</Button>
        </form>
      </div>

      {/* 带描述 */}
      <div>
        <h3 className="text-lg font-medium mb-2">带描述</h3>
        <div className="items-top flex space-x-2">
          <Checkbox id="terms2" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              接受条款和条件
            </label>
            <p className="text-sm text-muted-foreground">
              您同意我们的服务条款和隐私政策。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
