"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/features/links/hooks/use-categories";
import type { LinksCategory, LinksFormData } from "@/features/links/types";
import { useWebsiteParser } from "@/features/website-parser/hooks/use-website-parser";
import { isValidUrl } from "@/utils/validation";
import { AlertCircle, CheckCircle, Loader2, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useId } from "react";

// 表单状态管理hook
function useLinksFormState(initialData?: Partial<LinksFormData>) {
  const [formData, setFormData] = useState<LinksFormData>({
    title: "",
    description: "",
    url: "",
    icon: "",
    iconType: "image",
    tags: [],
    featured: false,
    category: "" as LinksFormData["category"],
    ...initialData,
  });

  const [newTag, setNewTag] = useState("");
  const [parseSuccess, setParseSuccess] = useState(false);
  const [urlError, setUrlError] = useState("");

  // URL验证effect
  useEffect(() => {
    if (formData.url && typeof formData.url === "string" && !isValidUrl(formData.url)) {
      setUrlError("请输入有效的 URL 格式");
    } else {
      setUrlError("");
    }
  }, [formData.url]);

  const handleInputChange = (
    field: keyof LinksFormData,
    value: LinksFormData[keyof LinksFormData]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // 清除解析状态
    if (field === "url") {
      setParseSuccess(false);
    }
  };

  return {
    formData,
    setFormData,
    newTag,
    setNewTag,
    parseSuccess,
    setParseSuccess,
    urlError,
    setUrlError,
    handleInputChange,
  };
}

// URL输入组件
interface UrlInputSectionProps {
  formData: LinksFormData;
  urlError: string;
  parseSuccess: boolean;
  parseError: string | null;
  isParsing: boolean;
  onInputChange: (field: keyof LinksFormData, value: LinksFormData[keyof LinksFormData]) => void;
  onParseWebsite: () => void;
}

const UrlInputSection = ({
  formData,
  urlError,
  parseSuccess,
  parseError,
  isParsing,
  onInputChange,
  onParseWebsite,
}: UrlInputSectionProps) => {
  const urlId = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={urlId}>网址 *</Label>
      <div className="flex gap-2">
        <Input
          id={urlId}
          type="url"
          placeholder="https://example.com"
          value={formData.url}
          onChange={e => onInputChange("url", e.target.value)}
          className={urlError ? "border-destructive" : ""}
          required
        />
        <Button
          type="button"
          variant="outline"
          onClick={onParseWebsite}
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
  );
};

// 基本信息组件
interface BasicInfoSectionProps {
  formData: LinksFormData;
  onInputChange: (field: keyof LinksFormData, value: LinksFormData[keyof LinksFormData]) => void;
}

const BasicInfoSection = ({ formData, onInputChange }: BasicInfoSectionProps) => {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <>
      {/* 标题 */}
      <div className="space-y-2">
        <Label htmlFor={titleId}>标题 *</Label>
        <Input
          id={titleId}
          placeholder="网站标题"
          value={formData.title}
          onChange={e => onInputChange("title", e.target.value)}
          required
        />
      </div>

      {/* 描述 */}
      <div className="space-y-2">
        <Label htmlFor={descriptionId}>描述</Label>
        <Textarea
          id={descriptionId}
          placeholder="网站描述"
          value={formData.description}
          onChange={e => onInputChange("description", e.target.value)}
          rows={3}
        />
      </div>
    </>
  );
};

// 图标输入组件
interface IconInputSectionProps {
  formData: LinksFormData;
  onInputChange: (field: keyof LinksFormData, value: LinksFormData[keyof LinksFormData]) => void;
}

const IconInputSection = ({ formData, onInputChange }: IconInputSectionProps) => {
  const iconId = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={iconId}>图标</Label>
      <div className="flex gap-2">
        <Select
          value={formData.iconType}
          onValueChange={(value: "image" | "text") => onInputChange("iconType", value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover/100">
            <SelectItem value="image">图片链接</SelectItem>
            <SelectItem value="text">文字</SelectItem>
          </SelectContent>
        </Select>
        <Input
          id={iconId}
          placeholder={formData.iconType === "image" ? "https://example.com/icon.png" : "A"}
          value={formData.icon}
          onChange={e => onInputChange("icon", e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};

// 分类选择组件
interface CategorySectionProps {
  formData: LinksFormData;
  categories: LinksCategory[];
  categoriesLoading: boolean;
  onInputChange: (field: keyof LinksFormData, value: LinksFormData[keyof LinksFormData]) => void;
}

const CategorySection = ({
  formData,
  categories,
  categoriesLoading,
  onInputChange,
}: CategorySectionProps) => {
  const categoryId = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={categoryId}>分类 *</Label>
      <Select
        value={formData.category}
        onValueChange={value => onInputChange("category", value)}
        required
        disabled={categoriesLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="选择分类" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] bg-popover/100">
          {categories.map((category: LinksCategory) => (
            <div key={category.id}>
              {/* 主分类 */}
              <SelectItem value={category.id} className="font-medium">
                {category.name}
              </SelectItem>
              {/* 子分类 */}
              {category.children &&
                Array.isArray(category.children) &&
                category.children.map(subCategory => (
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
  );
};

// 标签管理组件
interface TagsSectionProps {
  formData: LinksFormData;
  newTag: string;
  setNewTag: (tag: string) => void;
  onInputChange: (field: keyof LinksFormData, value: LinksFormData[keyof LinksFormData]) => void;
}

const TagsSection = ({ formData, newTag, setNewTag, onInputChange }: TagsSectionProps) => {
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      onInputChange("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onInputChange(
      "tags",
      formData.tags.filter(tag => tag !== tagToRemove)
    );
  };

  return (
    <div className="space-y-2">
      <Label>标签</Label>
      <div className="flex gap-2">
        <Input
          placeholder="添加标签"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={handleAddTag}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {formData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex cursor-pointer items-center gap-1 hover:bg-destructive/20"
              onClick={() => handleRemoveTag(tag)}
            >
              {tag}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

interface LinksFormProps {
  submitAction: (data: LinksFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<LinksFormData>;
  isLoading?: boolean;
}

export const LinksForm = ({ submitAction, onCancel, initialData, isLoading }: LinksFormProps) => {
  const {
    formData,
    setFormData,
    newTag,
    setNewTag,
    parseSuccess,
    setParseSuccess,
    urlError,
    handleInputChange,
  } = useLinksFormState(initialData);

  const { categories, loading: categoriesLoading } = useCategories();
  const { parseWebsite, isLoading: isParsing, error: parseError } = useWebsiteParser();

  const handleParseWebsite = () => {
    if (!(formData.url && isValidUrl(formData.url))) {
      return;
    }

    setParseSuccess(false);

    void parseWebsite(formData.url).then(metadata => {
      if (metadata) {
        setFormData(prev => ({
          ...prev,
          title: metadata.title ?? prev.title,
          description: metadata.description ?? prev.description,
          icon: metadata.icon ?? prev.icon,
        }));

        setParseSuccess(true);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!(formData.title && formData.url && formData.category)) {
      return;
    }

    if (urlError) {
      return;
    }

    void submitAction(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
      <UrlInputSection
        formData={formData}
        urlError={urlError}
        parseSuccess={parseSuccess}
        parseError={parseError}
        isParsing={isParsing}
        onInputChange={handleInputChange}
        onParseWebsite={handleParseWebsite}
      />

      <BasicInfoSection formData={formData} onInputChange={handleInputChange} />

      <IconInputSection formData={formData} onInputChange={handleInputChange} />

      <CategorySection
        formData={formData}
        categories={categories}
        categoriesLoading={categoriesLoading}
        onInputChange={handleInputChange}
      />

      <TagsSection
        formData={formData}
        newTag={newTag}
        setNewTag={setNewTag}
        onInputChange={handleInputChange}
      />

      {/* 精选 */}
      <FeaturedSection formData={formData} onInputChange={handleInputChange} />

      {/* 操作按钮 */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading ?? !!urlError}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : undefined}
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
};

// 精选开关组件
interface FeaturedSectionProps {
  formData: LinksFormData;
  onInputChange: (field: keyof LinksFormData, value: LinksFormData[keyof LinksFormData]) => void;
}

const FeaturedSection = ({ formData, onInputChange }: FeaturedSectionProps) => {
  const featuredId = useId();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={featuredId}
        checked={formData.featured}
        onCheckedChange={checked => onInputChange("featured", checked)}
      />
      <Label htmlFor={featuredId}>设为精选</Label>
    </div>
  );
};
