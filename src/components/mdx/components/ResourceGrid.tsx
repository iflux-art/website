
'use client';

import React, { memo } from 'react';
import type { ResourceGridProps } from '../types/components';
import { STYLE_CONFIG } from '../utils/config';

// 资源网格组件
export const ResourceGrid = memo(({
  columns = '3',
  children
}: ResourceGridProps) => {
  return (
    <div className={`${STYLE_CONFIG.BASE_CLASSES.grid} ${STYLE_CONFIG.GRID_COLUMNS[columns as keyof typeof STYLE_CONFIG.GRID_COLUMNS]}`}>
      {children}
    </div>
  );
});

ResourceGrid.displayName = 'ResourceGrid';

export default ResourceGrid;