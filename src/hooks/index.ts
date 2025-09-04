/**
 * 自定义Hooks统一导出
 */

// 核心Hooks
export { useMounted } from "./use-mounted";
export { useResponsiveLayout } from "./use-responsive-layout";
export { useRoutePrefetch } from "./use-route-prefetch";
export { useHeadingObserver } from "./use-heading-observer";
export { useContentData } from "./use-content-data";

// 缓存Hooks
export { useCache, useAdvancedCache } from "./use-advanced-cache";

// Navbar相关Hooks
export { useNavbarScroll, useActiveSection } from "@/features/navbar/hooks";
