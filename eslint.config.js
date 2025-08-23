import nextPlugin from '@next/eslint-plugin-next';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['**/.next/**', '**/node_modules/**', '**/dist/**'],
  },
  {
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      ...nextPlugin.configs['recommended'].rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...typescriptPlugin.configs['recommended'].rules,
    },
  },
];
