"use client";

import React, { useState, useEffect } from "react";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, X, AlertCircle, CheckCircle } from "lucide-react";
// LinksCategory 类型已在 @/types/links-types 中定义

interface LinksFormData {
  title: string;
  description: string;
  url: string;
  icon: string;
  iconType: "image" | "text";
  tags: string[];
  featured: boolean;
  category: string;
}

// 内联网站解析相关工具函数
interface WebsiteMetadata {
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
}

/**
 * 验证 URL 格式
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * 解析网站元数据
 */
async function parseWebsiteMetadata(url: string): Promise<WebsiteMetadata> {
  try {
    // 确保 URL 格式正确
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    // 使用代理服务解析网站信息
    const response = await fetch(
      `/api/parse-website?url=${encodeURIComponent(normalizedUrl)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to parse website");
    }

    const metadata = await response.json();
    return metadata;
  } catch {
    // Return basic information on error
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    return {
      title: urlObj.hostname.replace("www.", ""),
      description: "",
      icon: "",
    };
  }
}

interface LinksFormProps {
  submitAction: (data: LinksFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<LinksFormData>;
  isLoading?: boolean;
}

export function LinksForm({
  submitAction,
  onCancel,
  initialData,
  isLoading,
}: LinksFormProps) {
  const [formData, setFormData] = useState<LinksFormData>({
    title: "",
    description: "",
    url: "",
    icon: "",
    iconType: "image",
    tags: [],
    featured: false,
    category: "",
    ...initialData,
  });

  const { categories, loading: categoriesLoading } = useCategories();
  // TODO: availableTags 将用于实现标签建议和自动完成功能
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const [newTag, setNewTag] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [parseSuccess, setParseSuccess] = useState(false);
  const [urlError, setUrlError] = useState("");

  // 分类数据通过 useCategories hook 获取

  // URL 变化时验证格式
  useEffect(() => {
    if (
      formData.url &&
      typeof formData.url === "string" &&
      !isValidUrl(formData.url)
    ) {
      setUrlError("请输入有效的 URL 格式");
    } else {
      setUrlError("");
    }
  }, [formData.url]);

  const handleInputChange = (
    field: keyof LinksFormData,
    value: LinksFormData[keyof LinksFormData],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 清除解析状态
    if (field === "url") {
      setParseError("");
      setParseSuccess(false);
    }
  };

  const handleParseWebsite = async () => {
    if (!formData.url || !isValidUrl(formData.url)) {
      setParseError("请先输入有效的 URL");
      return;
    }

    setIsParsing(true);
    setParseError("");
    setParseSuccess(false);

    try {
      const metadata = await parseWebsiteMetadata(formData.url);

      setFormData((prev) => ({
        ...prev,
        title: metadata.title || prev.title,
        description: metadata.description || prev.description,
        icon: metadata.icon || prev.icon,
      }));

      setParseSuccess(true);
    } catch {
      setParseError("解析网站信息失败，请手动填写");
    } finally {
      setIsParsing(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.url || !formData.category) {
      return;
    }

    if (urlError) {
      return;
    }

    await submitAction(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
      {/* URL 输入和解析 */}
      <div className="space-y-2">
        <Label htmlFor="url">网址 *</Label>
        <div className="flex gap-2">
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            className={urlError ? "border-destructive" : ""}
            required
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleParseWebsite}
            disabled={isParsing || !formData.url || !!urlError}
          >
            {isParsing ? <Loader2 className="h-4 w-4 animate-spin" /> : "解析"}
          </Button>
        </div>
        {urlError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{urlError}</AlertDescription>
          </Alert>
        )}
        {parseError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{parseError}</AlertDescription>
          </Alert>
        )}
        {parseSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>网站信息解析成功！</AlertDescription>
          </Alert>
        )}
      </div>

      {/* 标题 */}
      <div className="space-y-2">
        <Label htmlFor="title">标题 *</Label>
        <Input
          id="title"
          placeholder="网站标题"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          required
        />
      </div>

      {/* 描述 */}
      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          placeholder="网站描述"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={3}
        />
      </div>

      {/* 图标 */}
      <div className="space-y-2">
        <Label htmlFor="icon">图标</Label>
        <div className="flex gap-2">
          <Select
            value={formData.iconType}
            onValueChange={(value: "image" | "text") =>
              handleInputChange("iconType", value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">图片链接</SelectItem>
              <SelectItem value="text">文字</SelectItem>
            </SelectContent>
          </Select>
          <Input
            id="icon"
            placeholder={
              formData.iconType === "image"
                ? "https://example.com/icon.png"
                : "A"
            }
            value={formData.icon}
            onChange={(e) => handleInputChange("icon", e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* 分类 */}
      <div className="space-y-2">
        <Label htmlFor="category">分类 *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleInputChange("category", value)}
          required
          disabled={categoriesLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {categories.map((category) => (
              <div key={category.id}>
                {/* 主分类 */}
                <SelectItem value={category.id} className="font-medium">
                  {category.name}
                </SelectItem>
                {/* 子分类 */}
                {category.children &&
                  category.children.map((subCategory) => (
                    <SelectItem
                      key={subCategory.id}
                      value={subCategory.id}
                      className="pl-6 text-sm text-muted-foreground"
                    >
                      └ {subCategory.name}
                    </SelectItem>
                  ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 标签 */}
      <div className="space-y-2">
        <Label>标签</Label>
        <div className="flex gap-2">
          <Input
            placeholder="添加标签"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddTag())
            }
          />
          <Button type="button" variant="outline" onClick={handleAddTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* 精选 */}
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => handleInputChange("featured", checked)}
        />
        <Label htmlFor="featured">设为精选</Label>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading || !!urlError}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {initialData ? "更新" : "添加"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
        )}
      </div>
    </form>
  );
}
