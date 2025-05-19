"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

/**
 * Tabs 组件示例
 * 展示了如何使用 Tabs 组件创建标签页界面
 */
export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-[600px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">账户</TabsTrigger>
        <TabsTrigger value="password">密码</TabsTrigger>
        <TabsTrigger value="settings">设置</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>账户</CardTitle>
            <CardDescription>
              管理您的账户信息和偏好设置。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">用户名</Label>
              <Input id="name" placeholder="输入您的用户名" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" type="email" placeholder="输入您的邮箱" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>保存更改</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>密码</CardTitle>
            <CardDescription>
              更改您的密码以保护账户安全。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">当前密码</Label>
              <Input id="current" type="password" placeholder="输入当前密码" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">新密码</Label>
              <Input id="new" type="password" placeholder="输入新密码" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">确认密码</Label>
              <Input id="confirm" type="password" placeholder="确认新密码" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>更新密码</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>设置</CardTitle>
            <CardDescription>
              管理应用程序设置和偏好。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">语言</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notifications">通知</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="notifications" />
                <label htmlFor="notifications">启用电子邮件通知</label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>保存设置</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
