'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseMasonryAnimationOptions {
  /** 每个元素的延迟时间（毫秒） */
  staggerDelay?: number;
  /** 初始延迟时间（毫秒） */
  initialDelay?: number;
  /** 是否启用滚动触发 */
  enableScrollTrigger?: boolean;
  /** 滚动触发的阈值 */
  threshold?: number;
  /** 列数，用于计算行优先的动画顺序 */
  columnsCount?: number;
}

/**
 * 瀑布流交错动画钩子
 *
 * 提供按行从左到右的交错动画效果：
 * - 页面加载时自动播放第一屏
 * - 滚动时触发后续元素动画
 * - 支持瀑布流布局的行优先动画
 */
export function useMasonryAnimation({
  staggerDelay = 100,
  initialDelay = 200,
  enableScrollTrigger = true,
  threshold = 0.1,
  columnsCount = 3,
}: UseMasonryAnimationOptions = {}) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<number, Element>>(new Map());

  // 计算元素的实际行位置
  const getElementRow = useCallback((element: Element) => {
    const rect = element.getBoundingClientRect();
    return Math.floor(rect.top);
  }, []);

  // 按行分组元素
  const groupElementsByRow = useCallback(() => {
    const elementsByRow: Map<number, number[]> = new Map();

    elementsRef.current.forEach((element, index) => {
      const row = getElementRow(element);
      if (!elementsByRow.has(row)) {
        elementsByRow.set(row, []);
      }
      elementsByRow.get(row)!.push(index);
    });

    // 按行位置排序
    const sortedRows = Array.from(elementsByRow.keys()).sort((a, b) => a - b);
    const rowPriorityMap = new Map<number, number>();

    sortedRows.forEach((rowTop, rowIndex) => {
      const elementsInRow = elementsByRow.get(rowTop)!;
      // 按元素在行内的左右位置排序
      elementsInRow.sort((a, b) => {
        const aElement = elementsRef.current.get(a);
        const bElement = elementsRef.current.get(b);
        if (!aElement || !bElement) return 0;

        const aRect = aElement.getBoundingClientRect();
        const bRect = bElement.getBoundingClientRect();
        return aRect.left - bRect.left;
      });

      // 为每个元素分配行优先索引
      elementsInRow.forEach((elementIndex, positionInRow) => {
        rowPriorityMap.set(elementIndex, rowIndex * 100 + positionInRow);
      });
    });

    return rowPriorityMap;
  }, [getElementRow]);

  // 注册元素
  const registerElement = useCallback(
    (index: number, element: Element | null) => {
      if (element) {
        elementsRef.current.set(index, element);

        // 如果启用滚动触发，添加到观察器
        if (enableScrollTrigger && observerRef.current) {
          observerRef.current.observe(element);
        }
      } else {
        elementsRef.current.delete(index);
        if (enableScrollTrigger && observerRef.current) {
          const el = elementsRef.current.get(index);
          if (el) {
            observerRef.current.unobserve(el);
          }
        }
      }
    },
    [enableScrollTrigger]
  );

  // 获取元素的动画样式
  const getItemStyle = useCallback(
    (index: number) => {
      const isVisible = visibleItems.has(index);
      // 如果元素还没有注册，使用原始索引
      let delay = initialDelay + index * staggerDelay;

      // 如果有足够的元素，尝试使用行优先排序
      if (elementsRef.current.size > 0) {
        const rowPriorityMap = groupElementsByRow();
        const rowPriorityIndex = rowPriorityMap.get(index) ?? index;
        delay = isInitialLoad
          ? initialDelay + rowPriorityIndex * staggerDelay
          : rowPriorityIndex * staggerDelay;
      }

      return {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0) translateY(0)' : 'translateX(-20px) translateY(10px)',
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      };
    },
    [visibleItems, isInitialLoad, initialDelay, staggerDelay, groupElementsByRow]
  );

  // 手动触发动画
  const triggerAnimation = useCallback((indices: number[]) => {
    setVisibleItems(prev => {
      const newSet = new Set(prev);
      indices.forEach(index => newSet.add(index));
      return newSet;
    });
  }, []);

  // 重置动画
  const resetAnimation = useCallback(() => {
    setVisibleItems(new Set());
    setIsInitialLoad(true);
  }, []);

  // 初始化交叉观察器
  useEffect(() => {
    if (!enableScrollTrigger) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        const newVisibleIndices: number[] = [];

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 找到对应的索引
            for (const [index, element] of elementsRef.current.entries()) {
              if (element === entry.target) {
                newVisibleIndices.push(index);
                break;
              }
            }
          }
        });

        if (newVisibleIndices.length > 0) {
          triggerAnimation(newVisibleIndices);
        }
      },
      {
        threshold,
        rootMargin: '50px 0px -50px 0px',
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableScrollTrigger, threshold, triggerAnimation]);

  // 页面加载时按行显示视口内的所有元素
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        // 获取视口内的元素并按行分组
        const viewportHeight = window.innerHeight;
        const elementsByRow: Map<number, number[]> = new Map();

        elementsRef.current.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          // 检查元素是否在视口内（包括部分可见）
          if (rect.top < viewportHeight + 100 && rect.bottom > -100) {
            // 增加缓冲区
            const row = Math.floor(rect.top / 100); // 使用更粗粒度的行分组
            if (!elementsByRow.has(row)) {
              elementsByRow.set(row, []);
            }
            elementsByRow.get(row)!.push(index);
          }
        });

        if (elementsByRow.size > 0) {
          // 按行位置排序
          const sortedRows = Array.from(elementsByRow.keys()).sort((a, b) => a - b);

          // 逐行显示元素，但间隔更短
          sortedRows.forEach((rowTop, rowIndex) => {
            const elementsInRow = elementsByRow.get(rowTop)!;
            setTimeout(() => {
              triggerAnimation(elementsInRow);
            }, rowIndex * 50); // 每行间隔50ms，更快的加载
          });

          setIsInitialLoad(false);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isInitialLoad, triggerAnimation]);

  return {
    registerElement,
    getItemStyle,
    triggerAnimation,
    resetAnimation,
    isVisible: (index: number) => visibleItems.has(index),
  };
}
