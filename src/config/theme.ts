/**
 * 主题配置
 * 集中管理所有颜色和主题相关变量
 */

export const themeConfig = {
  light: {
    // 基础颜色
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.145 0 0)',
    border: 'oklch(0.85 0 0)',

    // 主要颜色
    primary: {
      DEFAULT: 'oklch(0.25 0 0)',
      foreground: 'oklch(0.98 0 0)',
      hover: 'oklch(0.3 0 0)',
    },

    // 次要颜色
    secondary: {
      DEFAULT: 'oklch(0.94 0 0)',
      foreground: 'oklch(0.35 0 0)',
    },

    // 状态颜色
    destructive: {
      DEFAULT: 'oklch(0.65 0.18 25)',
      foreground: 'oklch(0.98 0 0)',
    },
    success: {
      DEFAULT: 'oklch(0.65 0.15 140)',
      foreground: 'oklch(0.98 0 0)',
    },

    // 界面颜色
    muted: {
      DEFAULT: 'oklch(0.96 0 0)',
      foreground: 'oklch(0.64 0 0)',
    },
    accent: {
      DEFAULT: 'oklch(0.94 0 0)',
      foreground: 'oklch(0.35 0 0)',
    },

    // 组件颜色
    popover: {
      DEFAULT: 'oklch(1 0 0)',
      foreground: 'oklch(0.145 0 0)',
    },
    card: {
      DEFAULT: 'oklch(0.98 0 0)',
      foreground: 'oklch(0.145 0 0)',
    },
  },

  dark: {
    // 基础颜色
    background: 'oklch(0.12 0 0)',
    foreground: 'oklch(0.98 0 0)',
    border: 'oklch(0.3 0 0)',

    // 主要颜色
    primary: {
      DEFAULT: 'oklch(0.9 0 0)',
      foreground: 'oklch(0.12 0 0)',
      hover: 'oklch(0.85 0 0)',
    },

    // 次要颜色
    secondary: {
      DEFAULT: 'oklch(0.2 0 0)',
      foreground: 'oklch(0.9 0 0)',
    },

    // 状态颜色
    destructive: {
      DEFAULT: 'oklch(0.7 0.18 25)',
      foreground: 'oklch(0.98 0 0)',
    },
    success: {
      DEFAULT: 'oklch(0.7 0.15 140)',
      foreground: 'oklch(0.98 0 0)',
    },

    // 界面颜色
    muted: {
      DEFAULT: 'oklch(0.18 0 0)',
      foreground: 'oklch(0.7 0 0)',
    },
    accent: {
      DEFAULT: 'oklch(0.2 0 0)',
      foreground: 'oklch(0.9 0 0)',
    },

    // 组件颜色
    popover: {
      DEFAULT: 'oklch(0.16 0 0)',
      foreground: 'oklch(0.98 0 0)',
    },
    card: {
      DEFAULT: 'oklch(0.16 0 0)',
      foreground: 'oklch(0.98 0 0)',
    },
  },

  // MDX 特定颜色
  mdx: {
    light: {
      link: 'var(--primary)',
      linkHover: 'var(--primary-hover)',
      code: {
        bg: 'var(--muted)',
        color: 'var(--foreground)',
      },
      blockquote: {
        color: 'var(--muted-foreground)',
        border: 'var(--border)',
      },
      table: {
        border: 'var(--border)',
        headerBg: 'var(--muted)',
      },
    },
    dark: {
      link: 'var(--primary)',
      linkHover: 'var(--primary-hover)',
      code: {
        bg: 'var(--muted-dark)',
        color: 'var(--foreground)',
      },
      blockquote: {
        color: 'var(--muted-foreground)',
        border: 'var(--border)',
      },
      table: {
        border: 'var(--border)',
        headerBg: 'var(--muted)',
      },
    },
  },
};
