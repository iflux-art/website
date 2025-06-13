'use client';

import React from 'react';
import { cn } from '@/shared/utils/utils';

// 背景样式类型
export type BackgroundStyle =
  | 'default' // 默认样式（当前样式）
  | 'particles' // 粒子效果
  | 'gradient-mesh' // 渐变网格
  | 'noise' // 噪点纹理
  | 'wave' // 波浪效果
  | 'geometric'; // 几何图形

interface EnhancedBackgroundProps {
  style?: BackgroundStyle;
  className?: string;
}

/**
 * 增强型背景组件
 * 提供多种背景样式选择
 */
export function EnhancedBackground({ style = 'default', className }: EnhancedBackgroundProps) {
  // 根据样式类型渲染不同的背景
  switch (style) {
    case 'particles':
      return <ParticlesBackground className={className} />;
    case 'gradient-mesh':
      return <GradientMeshBackground className={className} />;
    case 'noise':
      return <NoiseBackground className={className} />;
    case 'wave':
      return <WaveBackground className={className} />;
    case 'geometric':
      return <GeometricBackground className={className} />;
    case 'default':
    default:
      return <DefaultBackground className={className} />;
  }
}

/**
 * 默认背景 - 当前使用的样式
 */
function DefaultBackground({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 -z-10', className)}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.03] z-0" />

      {/* 装饰性渐变 */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-primary/5 to-transparent opacity-70" />
      <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-tl from-primary/5 to-transparent opacity-70" />

      {/* ChatGPT 风格的模糊圆形 */}
      <div
        className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl opacity-60 animate-pulse"
        style={{ animationDuration: '15s' }}
      />
      <div
        className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl opacity-60 animate-pulse"
        style={{ animationDuration: '20s' }}
      />
      <div
        className="absolute top-2/3 left-1/3 w-60 h-60 rounded-full bg-primary/5 blur-3xl opacity-40 animate-pulse"
        style={{ animationDuration: '18s' }}
      />
      <div
        className="absolute bottom-2/3 right-1/3 w-60 h-60 rounded-full bg-primary/5 blur-3xl opacity-40 animate-pulse"
        style={{ animationDuration: '12s' }}
      />
    </div>
  );
}

/**
 * 粒子效果背景
 * 创建动态的粒子漂浮效果
 */
function ParticlesBackground({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 -z-10 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.03] z-0" />

      {/* 粒子效果 */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => {
          const size = Math.random() * 6 + 2; // 2-8px
          const duration = Math.random() * 20 + 10; // 10-30s
          const delay = Math.random() * 5;
          const opacity = Math.random() * 0.1 + 0.05; // 0.05-0.15

          return (
            <div
              key={i}
              className="absolute rounded-full bg-primary dark:bg-primary animate-float"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: opacity,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* 渐变叠加 */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

/**
 * 渐变网格背景
 * 创建现代感的渐变网格效果
 */
function GradientMeshBackground({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 -z-10', className)}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.03] z-0" />

      {/* 渐变网格 */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-500/20 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-purple-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-green-500/20 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-amber-500/20 to-transparent" />
      </div>

      {/* 动态光斑 */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse"
        style={{ animationDuration: '15s' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse"
        style={{ animationDuration: '20s' }}
      />
    </div>
  );
}

/**
 * 噪点纹理背景
 * 添加细微的噪点纹理，增加深度感
 */
function NoiseBackground({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 -z-10', className)}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.03] z-0" />

      {/* 噪点纹理 - 使用SVG滤镜 */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 bg-noise-pattern" />

      {/* 渐变叠加 */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent opacity-50" />

      {/* 动态光斑 */}
      <div
        className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse"
        style={{ animationDuration: '25s' }}
      />
    </div>
  );
}

/**
 * 波浪效果背景
 * 创建流动的波浪效果
 */
function WaveBackground({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 -z-10 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.03] z-0" />

      {/* 波浪效果 */}
      <div className="absolute bottom-0 left-0 w-full h-64 opacity-10 dark:opacity-15">
        <div
          className="absolute bottom-0 left-0 w-[200%] h-40 bg-primary/20 rounded-[100%] animate-wave"
          style={{ animationDuration: '20s' }}
        />
        <div
          className="absolute bottom-5 left-0 w-[200%] h-40 bg-primary/15 rounded-[100%] animate-wave"
          style={{ animationDuration: '15s', animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-10 left-0 w-[200%] h-40 bg-primary/10 rounded-[100%] animate-wave"
          style={{ animationDuration: '25s', animationDelay: '1s' }}
        />
      </div>

      {/* 顶部渐变 */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-background to-transparent" />
    </div>
  );
}

/**
 * 几何图形背景
 * 使用各种几何图形创建现代感背景
 */
function GeometricBackground({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 -z-10', className)}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.03] z-0" />

      {/* 几何图形 */}
      {Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 100 + 50; // 50-150px
        const type = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: triangle
        const opacity = Math.random() * 0.08 + 0.02; // 0.02-0.1

        let shape;
        if (type === 0) {
          // 圆形
          shape = 'rounded-full';
        } else if (type === 1) {
          // 正方形
          shape = 'rotate-45';
        } else {
          // 三角形 (使用伪元素在CSS中实现)
          shape = 'triangle';
        }

        return (
          <div
            key={i}
            className={`absolute bg-primary dark:bg-primary ${shape}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: opacity,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}

      {/* 渐变叠加 */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-background/80 opacity-70" />
    </div>
  );
}
