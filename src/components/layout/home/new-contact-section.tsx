"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";

/**
 * 新版联系方式区组件
 */
export function NewContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 简单验证
    if (!formState.name || !formState.email || !formState.message) {
      return;
    }

    setFormStatus('submitting');

    // 模拟API调用
    try {
      // 在实际应用中，这里应该是一个真实的API调用
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 成功处理
      setFormStatus('success');
      setFormState({ name: "", email: "", message: "" });

      // 5秒后重置状态
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    } catch (error) {
      console.error("提交表单失败:", error);
      setFormStatus('error');

      // 5秒后重置状态
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }
  };

  return (
    <section className="w-full py-10">
      <div className="container px-6 md:px-8 mx-auto w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">联系我们</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            如果您有任何问题或建议，欢迎随时与我们联系
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* 联系信息 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">联系方式</h3>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary mr-4">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">电子邮件</p>
                      <p className="text-muted-foreground">contact@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary mr-4">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">电话</p>
                      <p className="text-muted-foreground">+86 123 4567 8901</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary mr-4">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">地址</p>
                      <p className="text-muted-foreground">北京市朝阳区科技园区88号</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    工作时间：周一至周五 9:00 - 18:00
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 联系表单 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">发送消息</h3>

                {formStatus === 'success' && (
                  <Alert className="mb-4 bg-success/20 text-success border-success">
                    <Check className="h-4 w-4" />
                    <AlertTitle>提交成功</AlertTitle>
                    <AlertDescription>
                      感谢您的留言，我们会尽快回复您。
                    </AlertDescription>
                  </Alert>
                )}

                {formStatus === 'error' && (
                  <Alert className="mb-4 bg-destructive/20 text-destructive border-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>提交失败</AlertTitle>
                    <AlertDescription>
                      提交表单时出现错误，请稍后再试。
                    </AlertDescription>
                  </Alert>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Input
                      placeholder="您的姓名"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      disabled={formStatus === 'submitting'}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="您的邮箱"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      disabled={formStatus === 'submitting'}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="您的留言"
                      rows={4}
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      disabled={formStatus === 'submitting'}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        提交中...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" /> 发送消息
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
