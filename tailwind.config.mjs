/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Tailwind CSS v4 特定配置
  future: {
    // 启用所有 v4 特性
    unstable_tailwind: {
      // 启用 v4 的颜色系统
      colors: true,
      // 启用 v4 的间距系统
      spacing: true,
      // 启用 v4 的排版系统
      typography: true,
    },
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        code: ["var(--font-geist-mono)"],
      },
      // 在 Tailwind CSS v4 中，typography 插件的配置方式有所变化
      // 但我们可以保持大部分配置不变
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--tw-prose-body)',
            maxWidth: '65ch',
            lineHeight: '1.75',
            a: {
              color: 'var(--tw-prose-links)',
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                color: 'var(--tw-prose-links-hover)',
              },
            },
            h1: {
              color: 'var(--tw-prose-headings)',
              fontWeight: '700',
              fontSize: '2.25em',
              marginTop: '1.5em',
              marginBottom: '0.8em',
              lineHeight: '1.2',
            },
            h2: {
              color: 'var(--tw-prose-headings)',
              fontWeight: '600',
              fontSize: '1.5em',
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.3',
              scrollMarginTop: '5rem',
            },
            h3: {
              color: 'var(--tw-prose-headings)',
              fontWeight: '600',
              fontSize: '1.25em',
              marginTop: '1.6em',
              marginBottom: '0.6em',
              lineHeight: '1.4',
              scrollMarginTop: '5rem',
            },
            h4: {
              color: 'var(--tw-prose-headings)',
              fontWeight: '600',
              marginTop: '1.5em',
              marginBottom: '0.5em',
              lineHeight: '1.5',
              scrollMarginTop: '5rem',
            },
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            blockquote: {
              fontWeight: '400',
              fontStyle: 'italic',
              color: 'var(--tw-prose-quotes)',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'var(--tw-prose-quote-borders)',
              paddingLeft: '1em',
              marginTop: '1.6em',
              marginBottom: '1.6em',
            },
            code: {
              color: 'var(--tw-prose-code)',
              fontWeight: '400',
              fontSize: '0.875em',
              backgroundColor: 'var(--tw-prose-code-bg)',
              borderRadius: '0.25rem',
              paddingLeft: '0.4em',
              paddingRight: '0.4em',
              paddingTop: '0.1em',
              paddingBottom: '0.1em',
              fontFamily: 'var(--font-geist-mono)',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              color: 'var(--tw-prose-pre-code)',
              backgroundColor: 'var(--tw-prose-pre-bg)',
              borderRadius: '0.375rem',
              padding: '1em',
              overflowX: 'auto',
              border: '1px solid var(--tw-prose-pre-border)',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              color: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              lineHeight: 'inherit',
            },
            img: {
              borderRadius: '0.375rem',
              marginTop: '2em',
              marginBottom: '2em',
            },
            ul: {
              listStyleType: 'disc',
              paddingLeft: '1.625em',
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            ol: {
              listStyleType: 'decimal',
              paddingLeft: '1.625em',
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'ul > li': {
              paddingLeft: '0.375em',
            },
            'ol > li': {
              paddingLeft: '0.375em',
            },
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
              borderCollapse: 'collapse',
            },
            thead: {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--tw-prose-th-borders)',
            },
            'thead th': {
              color: 'var(--tw-prose-headings)',
              fontWeight: '600',
              paddingBottom: '0.75em',
              paddingRight: '0.75em',
              paddingLeft: '0.75em',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--tw-prose-td-borders)',
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0',
            },
            'tbody td': {
              paddingTop: '0.75em',
              paddingRight: '0.75em',
              paddingBottom: '0.75em',
              paddingLeft: '0.75em',
            },
            hr: {
              borderTopWidth: '1px',
              marginTop: '3em',
              marginBottom: '3em',
            },
          },
        },
      },
    },
  },
  // 在 Tailwind CSS v4 中，插件的使用方式有所变化
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
