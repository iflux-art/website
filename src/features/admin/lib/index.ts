/**
 * Admin 功能相关工具函数
 */

import { loadAllLinksData } from "@/features/links/lib";
import type { LinksItem } from "@/features/links/types";

export const fetchLinksData = async (): Promise<LinksItem[]> => loadAllLinksData();
