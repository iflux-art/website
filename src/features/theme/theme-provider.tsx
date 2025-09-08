"use client";

import { useThemeStore } from "./theme-store";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect, useMemo } from "react";

// 创建一个内部组件来同步主题状态
const ThemeSync = () => {
  const { theme, resolvedTheme } = useTheme();
  const { setTheme: setStoreTheme, setResolvedTheme, setMounted } = useThemeStore();

  useEffect(() => {
    setStoreTheme(theme as "light" | "dark" | "system");
    setResolvedTheme(resolvedTheme as "light" | "dark");
    setMounted(true);
  }, [theme, resolvedTheme, setStoreTheme, setResolvedTheme, setMounted]);

  return null;
};

export const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  const { setConfig } = useThemeStore();

  // 提取props中的各个属性并使用useMemo包装，以避免每次重新渲染时创建新对象
  const { attribute, defaultTheme, enableSystem, disableTransitionOnChange } = props;
  const memoizedConfig = useMemo(
    () => ({
      attribute,
      defaultTheme,
      enableSystem,
      disableTransitionOnChange,
    }),
    [attribute, defaultTheme, enableSystem, disableTransitionOnChange]
  );

  // 同步配置到 Zustand store，只在必要时更新
  useEffect(() => {
    setConfig(memoizedConfig);
  }, [memoizedConfig, setConfig]);

  return (
    <NextThemesProvider {...props}>
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
};
