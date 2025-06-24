/**
 * MDX 提供者组件
 * 用于提供 MDX 渲染的上下文环境
 */

import { type ReactNode } from 'react';
import { MDXComponentContext, MDXComponentsMapping, defaultComponentProps } from '@/config/mdx';

// MDX Provider Props 类型
interface MDXProviderProps {
  children: ReactNode;
  components?: typeof MDXComponentsMapping;
  componentProps?: typeof defaultComponentProps;
}

/**
 * MDX Provider 组件
 * 提供 MDX 渲染所需的配置和上下文
 */
export function MDXProvider({
  children,
  components = MDXComponentsMapping,
  componentProps = defaultComponentProps,
}: MDXProviderProps) {
  return (
    <MDXComponentContext.Provider
      value={{
        components,
        defaultProps: componentProps,
      }}
    >
      {children}
    </MDXComponentContext.Provider>
  );
}

// 导出统一的 Hook
export { useMDXComponents } from '@/config/mdx';
