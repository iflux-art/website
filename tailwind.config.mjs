import typography from '@tailwindcss/typography';

const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/mdx-components.tsx",
  ],
  plugins: [
    typography({
      className: 'prose',
    }),
  ],
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  safelist: [
    'grid-cols-1',
    'sm:grid-cols-2',
    'md:grid-cols-2',
    'lg:grid-cols-1',
    'lg:grid-cols-2',
    'lg:grid-cols-3',
    'lg:grid-cols-4',
    'xl:grid-cols-2',
    'xl:grid-cols-3',
    'xl:grid-cols-5',
    '2xl:grid-cols-3',
    'gap-3',
    'gap-4',
    'sm:gap-4',
    'sm:gap-6',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      maxWidth: {},
      gridTemplateColumns: {},
      typography: {},
    },
  },
};

export default config;
