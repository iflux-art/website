
export const MDX_CONFIG = {
  // 缓存设置
  CACHE_MAX_AGE: 3600000, // 1小时
  CACHE_MAX_ITEMS: 100,

  // 处理设置
  PROCESSING_INTERVAL: 2000,
  INITIAL_DELAY: 100,
  MAX_RETRIES: 3,
  DEBOUNCE_DELAY: 250,

  // 批处理设置
  BATCH_SIZE: 10,
  MIN_BATCH_SIZE: 5,
  MAX_BATCH_SIZE: 20,
  MAX_CONCURRENT_TASKS: 3,

  // 性能设置
  ADAPTIVE_THRESHOLD: 16,
  INTERSECTION_THRESHOLD: 0.1,
  INTERSECTION_ROOT_MARGIN: '50px',
  RECOVERY_DELAY: 5000,

  // 图片设置
  DEFAULT_IMAGE_SIZES: '(max-width: 640px) 640px, (max-width: 1080px) 1080px, 1080px',
  SUPPORTED_IMAGE_FORMATS: ['webp', 'original'] as const,
} as const;

export const STYLE_CONFIG = {
  GRID_COLUMNS: {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  },
  BASE_CLASSES: {
    prose: 'prose prose-slate dark:prose-invert max-w-none',
    card: 'overflow-hidden hover:shadow-lg transition-all border border-border rounded-lg',
    cardFeatured: 'border-primary/30',
    grid: 'grid gap-6 my-8',
  }
} as const;
