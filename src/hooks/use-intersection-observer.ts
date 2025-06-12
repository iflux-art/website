'use client';

import { useEffect, useRef, useState } from 'react';

interface UseLazyLoadOptions {
  /**
   * 是否只触发一次
   * @default true
   */
  triggerOnce?: boolean;

  /**
   * 触发阈值
   * @default 0
   */
  threshold?: number;

  /**
   * 是否跳过懒加载
   * @default false
   */
  skip?: boolean;

  /**
   * 根元素边距
   * @default "0px"
   */
  rootMargin?: string;
}

export function useLazyLoad<T extends HTMLElement>({
  triggerOnce = true,
  threshold = 0,
  skip = false,
  rootMargin = '0px',
}: UseLazyLoadOptions = {}): [React.RefObject<T>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (skip || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [skip, threshold, triggerOnce, rootMargin]);

  return [ref, isVisible];
}
