"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { slideUp } from "@/lib/animations";

export function ContactSection() {
  return (
    <div className="max-w-6xl mx-auto">
      <p className="text-center text-lg text-muted-foreground mb-10">
        如果您有任何问题或建议，欢迎随时与我们联系。
      </p>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* 联系信息 */}
        <motion.div
          variants={slideUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">联系方式</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">电子邮件</p>
                    <p className="text-muted-foreground">contact@example.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">电话</p>
                    <p className="text-muted-foreground">+86 123 4567 8901</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">地址</p>
                    <p className="text-muted-foreground">北京市朝阳区科技园区88号</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* 联系表单 */}
        <motion.div
          variants={slideUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">发送消息</h3>
              
              <form className="space-y-4">
                <div>
                  <Input placeholder="您的姓名" />
                </div>
                <div>
                  <Input type="email" placeholder="您的邮箱" />
                </div>
                <div>
                  <Textarea placeholder="您的留言" rows={4} />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" /> 发送消息
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}