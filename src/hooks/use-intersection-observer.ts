'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * 是否在组件挂载时立即开始观察
   * @default true
   */
  triggerOnce?: boolean;

  /**
   * 是否在组件卸载时自动停止观察
   * @default true
   */
  disconnectOnUnmount?: boolean;

  /**
   * 是否跳过观察（用于条件性地启用/禁用观察）
   * @default false
   */
  skip?: boolean;
}

/**
 * 使用浏览器原生的 Intersection Observer API 的 Hook
 * 
 * 替代 react-intersection-observer 库，减少依赖
 * 
 * @param options Intersection Observer 选项
 * @returns [ref, isIntersecting, entry] 元组
 * 
 * @example
 * ```tsx
 * const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
 * 
 * return (
 *   <div ref={ref}>
 *     {isVisible ? '可见' : '不可见'}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  triggerOnce = false,
  disconnectOnUnmount = true,
  skip = false,
}: UseIntersectionObserverOptions = {}): [
  RefObject<T>,
  boolean,
  IntersectionObserverEntry | null
] {
  const ref = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 如果设置了跳过，或者浏览器不支持 IntersectionObserver，则不执行
    if (skip || typeof IntersectionObserver === 'undefined' || !ref.current) {
      return;
    }

    // 清理之前的 observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 创建新的 observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [firstEntry] = entries;
        setEntry(firstEntry);
        setIsIntersecting(firstEntry.isIntersecting);

        // 如果设置了 triggerOnce 且元素已经进入视口，则停止观察
        if (triggerOnce && firstEntry.isIntersecting && observer) {
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(ref.current);
    observerRef.current = observer;

    // 清理函数
    return () => {
      if (disconnectOnUnmount && observer) {
        observer.disconnect();
      }
    };
  }, [root, rootMargin, threshold, triggerOnce, disconnectOnUnmount, skip]);

  return [ref, isIntersecting, entry];
}

/**
 * 简化版的 Intersection Observer Hook，只返回 ref 和 isIntersecting
 */
export function useIsVisible<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T>, boolean] {
  const [ref, isIntersecting] = useIntersectionObserver<T>(options);
  return [ref, isIntersecting];
}

/**
 * 用于懒加载的 Intersection Observer Hook
 */
export function useLazyLoad<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T>, boolean] {
  return useIntersectionObserver<T>({
    triggerOnce: true,
    ...options,
  });
}

/**
 * 用于无限滚动的 Intersection Observer Hook
 */
export function useInfiniteScroll<T extends Element = HTMLDivElement>(
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
): RefObject<T> {
  const [ref, isIntersecting] = useIntersectionObserver<T>({
    threshold: 0,
    ...options,
  });

  useEffect(() => {
    if (isIntersecting) {
      callback();
    }
  }, [isIntersecting, callback]);

  return ref;
}
