"use client";

import { useParams } from "next/navigation";
import { createTranslator } from "@/lib/i18n";

/**
 * 使用翻译的自定义Hook
 * 根据当前路由语言参数提供翻译功能
 * 
 * @returns 翻译函数
 * @example
 * const t = useTranslations();
 * <p>{t("nav.home")}</p>
 */
export function useTranslations() {
  const { lang = "zh" } = useParams();
  return createTranslator(lang as string);
}