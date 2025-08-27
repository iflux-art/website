import type { Metadata } from "next";
import { LINKS_PAGE_METADATA } from "@/config";
import { LinksPageContainer } from "@/features/links/components";

/**
 * 链接页面元数据
 * 从配置中导入，符合项目元数据管理规范
 */
export const metadata: Metadata = LINKS_PAGE_METADATA;

/**
 * 链接页面服务端组件
 * 作为页面入口点，负责渲染客户端组件
 */
export default function LinksPage() {
  return <LinksPageContainer />;
}
