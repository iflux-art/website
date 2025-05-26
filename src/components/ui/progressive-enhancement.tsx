'use client';

import React, { useState, useEffect } from 'react';

/**
 * 渐进式增强组件属性
 */
export interface ProgressiveEnhancementProps {
  /**
   * 基本内容
   */
  fallback: React.ReactNode;

  /**
   * 增强内容
   */
  children: React.ReactNode;

  /**
   * 是否启用 JavaScript 检测
   * @default true
   */
  checkJs?: boolean;

  /**
   * 是否启用网络状态检测
   * @default true
   */
  checkNetwork?: boolean;

  /**
   * 是否启用设备性能检测
   * @default true
   */
  checkPerformance?: boolean;

  /**
   * 是否启用浏览器特性检测
   * @default true
   */
  checkFeatures?: string[];

  /**
   * 是否启用屏幕尺寸检测
   * @default false
   */
  checkScreenSize?: boolean;

  /**
   * 最小屏幕宽度
   * @default 0
   */
  minWidth?: number;

  /**
   * 最小屏幕高度
   * @default 0
   */
  minHeight?: number;
}

/**
 * 渐进式增强组件
 * 
 * 用于实现渐进式增强，提供基本功能，然后逐步增强
 * 
 * @example
 * ```tsx
 * <ProgressiveEnhancement
 *   fallback={<div>基本内容</div>}
 *   checkFeatures={['IntersectionObserver', 'ResizeObserver']}
 * >
 *   <div>增强内容</div>
 * </ProgressiveEnhancement>
 * ```
 */
export function ProgressiveEnhancement({
  fallback,
  children,
  checkJs = true,
  checkNetwork = true,
  checkPerformance = true,
  checkFeatures = [],
  checkScreenSize = false,
  minWidth = 0,
  minHeight = 0,
}: ProgressiveEnhancementProps) {
  // 是否支持增强功能
  const [isEnhanced, setIsEnhanced] = useState(false);
  
  // 检测浏览器特性
  useEffect(() => {
    // 如果不需要检测，直接启用增强功能
    if (!checkJs && !checkNetwork && !checkPerformance && checkFeatures.length === 0 && !checkScreenSize) {
      setIsEnhanced(true);
      return;
    }
    
    // 检测网络状态
    if (checkNetwork && navigator.connection) {
      // @ts-ignore
      const connection = navigator.connection;
      
      // 如果网络状态不佳，不启用增强功能
      if (
        // @ts-ignore
        connection.saveData ||
        // @ts-ignore
        connection.effectiveType === 'slow-2g' ||
        // @ts-ignore
        connection.effectiveType === '2g'
      ) {
        setIsEnhanced(false);
        return;
      }
    }
    
    // 检测设备性能
    if (checkPerformance) {
      // 使用 requestAnimationFrame 检测设备性能
      let frameCount = 0;
      let lastTime = performance.now();
      let rafId: number;
      
      const checkPerformance = () => {
        const now = performance.now();
        frameCount++;
        
        // 计算帧率
        if (now - lastTime > 1000) {
          const fps = frameCount / ((now - lastTime) / 1000);
          
          // 如果帧率低于 30，不启用增强功能
          if (fps < 30) {
            setIsEnhanced(false);
            cancelAnimationFrame(rafId);
            return;
          }
          
          frameCount = 0;
          lastTime = now;
        }
        
        // 最多检测 2 秒
        if (now - lastTime < 2000) {
          rafId = requestAnimationFrame(checkPerformance);
        } else {
          // 性能检测通过
          setIsEnhanced(true);
        }
      };
      
      rafId = requestAnimationFrame(checkPerformance);
      
      return () => {
        cancelAnimationFrame(rafId);
      };
    }
    
    // 检测浏览器特性
    if (checkFeatures.length > 0) {
      const unsupportedFeatures = checkFeatures.filter(feature => {
        return !(feature in window);
      });
      
      // 如果有不支持的特性，不启用增强功能
      if (unsupportedFeatures.length > 0) {
        setIsEnhanced(false);
        return;
      }
    }
    
    // 检测屏幕尺寸
    if (checkScreenSize) {
      const checkScreenSize = () => {
        const { innerWidth, innerHeight } = window;
        
        // 如果屏幕尺寸小于最小尺寸，不启用增强功能
        if (innerWidth < minWidth || innerHeight < minHeight) {
          setIsEnhanced(false);
        } else {
          setIsEnhanced(true);
        }
      };
      
      // 初始检测
      checkScreenSize();
      
      // 监听屏幕尺寸变化
      window.addEventListener('resize', checkScreenSize);
      
      return () => {
        window.removeEventListener('resize', checkScreenSize);
      };
    }
    
    // 所有检测都通过，启用增强功能
    setIsEnhanced(true);
  }, [
    checkJs,
    checkNetwork,
    checkPerformance,
    checkFeatures,
    checkScreenSize,
    minWidth,
    minHeight,
  ]);
  
  // 如果不支持增强功能，显示基本内容
  if (!isEnhanced) {
    return <>{fallback}</>;
  }
  
  // 如果支持增强功能，显示增强内容
  return <>{children}</>;
}
