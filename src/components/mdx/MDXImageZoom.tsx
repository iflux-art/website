'use client';

import React, { useState, useRef, useCallback } from 'react';
import { XCircle, ZoomIn, ZoomOut, Move } from 'lucide-react';

export interface MDXImageZoomProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  zoomFactor?: number;
  maxZoom?: number;
  minZoom?: number;
}

/**
 * MDX 图片缩放组件
 * - 支持图片放大预览
 * - 支持拖动平移
 * - 支持鼠标滚轮缩放
 * - 支持双击还原
 * - 支持键盘操作
 */
export const MDXImageZoom = ({
  src,
  alt = '',
  className = '',
  width = 'auto',
  height = 'auto',
  zoomFactor = 1.2,
  maxZoom = 4,
  minZoom = 1,
}: MDXImageZoomProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // 处理缩放
  const handleZoom = useCallback(
    (factor: number) => {
      setScale((currentScale) => {
        const newScale = currentScale * factor;
        return Math.min(Math.max(newScale, minZoom), maxZoom);
      });
    },
    [maxZoom, minZoom]
  );

  // 处理拖动开始
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // 处理拖动
  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  // 处理拖动结束
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // 处理鼠标滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1 / zoomFactor : zoomFactor;
    handleZoom(factor);
  };

  // 重置缩放和位置
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  // 切换缩放状态
  const toggleZoom = () => {
    if (isZoomed) {
      resetZoom();
    } else {
      setIsZoomed(true);
      handleZoom(zoomFactor);
    }
  };

  return (
    <div className="my-6 relative">
      {/* 缩略图 */}
      <div
        className={`
          relative overflow-hidden
          cursor-zoom-in
          ${isZoomed ? 'hidden' : 'block'}
          ${className}
        `}
        onClick={toggleZoom}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-contain"
        />
        <div
          className="
          absolute bottom-4 right-4
          p-2 rounded-full
          bg-black/50 text-white
          opacity-0 hover:opacity-100
          transition-opacity
        "
        >
          <ZoomIn className="h-5 w-5" />
        </div>
      </div>

      {/* 放大预览 */}
      {isZoomed && (
        <div
          ref={containerRef}
          className="
            fixed inset-0 z-50
            bg-black/90
            cursor-move
          "
          onMouseDown={handleDragStart}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onWheel={handleWheel}
        >
          {/* 工具栏 */}
          <div
            className="
            absolute top-4 right-4
            flex items-center gap-2
          "
          >
            <button
              onClick={() => handleZoom(zoomFactor)}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="放大"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleZoom(1 / zoomFactor)}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="缩小"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={resetZoom}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="关闭"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>

          {/* 缩放提示 */}
          <div
            className="
            absolute bottom-4 left-4
            flex items-center gap-2
            px-4 py-2 rounded-full
            bg-black/50 text-white text-sm
          "
          >
            <Move className="h-4 w-4" />
            <span>拖动移动 | 滚轮缩放 | 双击还原</span>
          </div>

          {/* 缩放图片 */}
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.2s',
            }}
            className="absolute inset-0 flex items-center justify-center"
            onDoubleClick={resetZoom}
          >
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              className="max-w-none pointer-events-none"
              style={{ width, height }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
