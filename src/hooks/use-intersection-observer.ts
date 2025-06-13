'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

/**
 * 懒加载钩子配置项
 */
interface UseLazyLoadOptions {
  /**
   * 是否只触发一次可见性变化。设置为true时,元素一旦可见就不会再次触发。
   * @default true
   */
  triggerOnce?: boolean;

  /**
   * 触发可见性检测的阈值,范围0-1。
   * 例如:0.5表示元素50%可见时触发。
   * @default 0
   */
  threshold?: number;

  /**
   * 是否跳过懒加载监测。
   * 设置为true时将不会监测元素可见性。
   * @default false 
   */
  skip?: boolean;

  /**
   * 根元素的外边距。
   * 用于扩展或收缩监测的根元素范围。
   * 例如:"100px 0px"代表上下扩展100px。
   * @default "0px"
   */
  rootMargin?: string;
}

/**
 * 用于实现元素懒加载的React Hook
 * @template T - HTML元素类型
 * @param options - 懒加载配置项
 * @returns [ref, isVisible] - 返回ref对象和元素是否可见的标志
 *
 * @example
 * ```tsx
 * const [ref, isVisible] = useLazyLoad<HTMLImageElement>();
 * return <img ref={ref} src={isVisible ? realSrc : placeholder} />;
 * ```
 */
export function useLazyLoad<T extends HTMLElement>({
  triggerOnce = true,
  threshold = 0,
  rootMargin = '0px',
  skip = false,
}: UseLazyLoadOptions = {}): [React.RefObject<T | null>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T | null>(null);
  const cleanup = useRef(false);

  const observerOptions = useMemo(
    () => ({
      threshold,
      rootMargin,
    }),
    [threshold, rootMargin]
  );

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      const [entry] = entries;
      if (!entry || cleanup.current) return;

      if (entry.isIntersecting) {
        setIsVisible(true);
        if (triggerOnce && observer) {
          observer.disconnect();
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    },
    [triggerOnce]
  );

  useEffect(() => {
    if (skip || !ref.current) return undefined;

    cleanup.current = false;
    const observer = new IntersectionObserver(
      (entries) => handleIntersect(entries, observer),
      observerOptions
    );

    // Safety check for null
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      cleanup.current = true;
      observer.disconnect();
    };
  }, [skip, observerOptions, handleIntersect]);

  return [ref, isVisible];
}