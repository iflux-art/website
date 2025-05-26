import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * 组件工厂函数类型
 */
export type ComponentFactory<
  Element extends React.ElementType,
  Variants extends Record<string, Record<string, string>>,
  Props extends Record<string, any> = {}
> = (
  baseClassName: string,
  variants: Variants,
  defaultVariants?: Partial<{ [K in keyof Variants]: string }>
) => React.ForwardRefExoticComponent<
  Props &
    VariantProps<ReturnType<typeof cva<string, Variants>>> &
    Omit<React.ComponentPropsWithoutRef<Element>, keyof Props | keyof VariantProps<ReturnType<typeof cva<string, Variants>>>> &
    React.RefAttributes<React.ElementRef<Element>>
>;

/**
 * 创建组件工厂函数
 * 
 * @param element 元素类型
 * @returns 组件工厂函数
 * 
 * @example
 * ```tsx
 * const Button = createComponentFactory('button')(
 *   'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
 *   {
 *     variant: {
 *       default: 'bg-primary text-primary-foreground hover:bg-primary/90',
 *       destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
 *       outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
 *       secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
 *       ghost: 'hover:bg-accent hover:text-accent-foreground',
 *       link: 'underline-offset-4 hover:underline text-primary',
 *     },
 *     size: {
 *       default: 'h-10 py-2 px-4',
 *       sm: 'h-9 px-3 rounded-md',
 *       lg: 'h-11 px-8 rounded-md',
 *     },
 *   },
 *   {
 *     variant: 'default',
 *     size: 'default',
 *   }
 * );
 * ```
 */
export function createComponentFactory<Element extends React.ElementType>(
  element: Element
): ComponentFactory<Element, any, any> {
  return <
    Variants extends Record<string, Record<string, string>>,
    Props extends Record<string, any> = {}
  >(
    baseClassName: string,
    variants: Variants,
    defaultVariants?: Partial<{ [K in keyof Variants]: string }>
  ) => {
    // 创建 CVA 变体
    const componentVariants = cva(baseClassName, {
      variants,
      defaultVariants,
    });
    
    // 创建组件
    const Component = React.forwardRef<
      React.ElementRef<Element>,
      Props &
        VariantProps<typeof componentVariants> &
        Omit<React.ComponentPropsWithoutRef<Element>, keyof Props | keyof VariantProps<typeof componentVariants>>
    >(({ className, ...props }, ref) => {
      // 提取变体属性
      const variantProps: Record<string, any> = {};
      const otherProps: Record<string, any> = {};
      
      // 分离变体属性和其他属性
      Object.entries(props).forEach(([key, value]) => {
        if (Object.keys(variants).includes(key)) {
          variantProps[key] = value;
        } else {
          otherProps[key] = value;
        }
      });
      
      // 合并类名
      const variantClassName = componentVariants(variantProps);
      const mergedClassName = cn(variantClassName, className);
      
      // 创建元素
      return React.createElement(
        element,
        {
          className: mergedClassName,
          ref,
          ...otherProps,
        }
      );
    });
    
    // 设置组件名称
    Component.displayName = `${element.toString().charAt(0).toUpperCase() + element.toString().slice(1)}`;
    
    return Component;
  };
}

/**
 * 创建按钮组件
 */
export const createButton = createComponentFactory('button');

/**
 * 创建链接组件
 */
export const createLink = createComponentFactory('a');

/**
 * 创建输入组件
 */
export const createInput = createComponentFactory('input');

/**
 * 创建标签组件
 */
export const createLabel = createComponentFactory('label');

/**
 * 创建选择组件
 */
export const createSelect = createComponentFactory('select');

/**
 * 创建文本区域组件
 */
export const createTextarea = createComponentFactory('textarea');

/**
 * 创建分割线组件
 */
export const createDivider = createComponentFactory('hr');

/**
 * 创建容器组件
 */
export const createContainer = createComponentFactory('div');

/**
 * 创建标题组件
 */
export const createHeading = createComponentFactory('h2');

/**
 * 创建段落组件
 */
export const createParagraph = createComponentFactory('p');
