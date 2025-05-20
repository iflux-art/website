/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        code: ["var(--font-geist-mono)"],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // Tailwind Typography 插件配置
      // 集中管理所有与排版相关的样式
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
              backgroundColor: 'transparent',
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
              backgroundColor: 'transparent',
              borderRadius: '0',
              padding: '0',
              margin: '0',
              overflowX: 'auto',
              border: '0',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              margin: '0',
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
