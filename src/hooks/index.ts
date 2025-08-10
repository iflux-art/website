// Export all hooks
export { useTagAnchors } from "./use-tag-anchors";
export { useCategories } from "./use-categories";
export { useFilterState } from "./filter/use-filter-state";

// UI hooks
export { useActiveSection } from "./ui/use-active-section";
export { useDebouncedValue } from "./ui/use-debounced-value";
export { useHeadingObserver } from "./ui/use-heading-observer";
export { useNavbarScroll } from "./ui/use-navbar-scroll";

// State hooks
export { useAuthState, useSafeAuth } from "./auth-state";
export { useSafeNavbar } from "./navbar-state";
export { useSafeSearch } from "./search-state";
export { useSafeTheme } from "./theme-state";

// Content hooks
export { useContentData } from "./use-content-data";
export { useGlobalDocs } from "../components/sidebar/use-global-docs";
export { useGroupEntries } from "./use-group-entries";
export { useMDX } from "./use-mdx";

// Cache hooks
export { useCache } from "./cache/use-cache";
