/**
 * 鼠标悬停状态管理 Hook
 */

'use client';

import { useState, useCallback } from 'react';

/**
 * 使用鼠标悬停状态
 *
 * @returns 包含悬停状态和处理函数的对象
 *
 * @example
 * ```tsx
 * const { isHovering, hoverId, handleMouseEnter, handleMouseLeave } = useHover();
 *
 * return (
 *   <div
 *     onMouseEnter={() => handleMouseEnter('my-id')}
 *     onMouseLeave={handleMouseLeave}
 *   >
 *     {isHovering && hoverId === 'my-id' && <div>Hover Content</div>}
 *   </div>
 * );
 * ```
 */
export function useHover() {
  const [hoverId, setHoverId] = useState<string | null>(null);

  const handleMouseEnter = useCallback((id: string) => {
    setHoverId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverId(null);
  }, []);

  return {
    isHovering: hoverId !== null,
    hoverId,
    handleMouseEnter,
    handleMouseLeave,
  };
}
