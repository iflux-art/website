/**
 * 增强的 ESLint 配置文件 (扁平配置格式)
 * 
 * 这个文件使用 ESLint v9 的新扁平配置格式，增强了代码质量检查
 */

import js from '@eslint/js';
import nextPlugin from 'eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import securityPlugin from 'eslint-plugin-security';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import unicornPlugin from 'eslint-plugin-unicorn';
import globals from 'globals';

export default [
  // 基础 JavaScript 规则
  js.configs.recommended,
  
  // 全局变量
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  
  // Next.js 规则
  {
    plugins: {
      next: nextPlugin,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-img-element': 'off',
    },
  },
  
  // React 规则
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      'react/jsx-sort-props': ['warn', {
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
        reservedFirst: true,
      }],
      'react/function-component-definition': ['warn', {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function',
      }],
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-pascal-case': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  
  // React Hooks 规则
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  
  // TypeScript 规则
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/ban-ts-comment': ['warn', {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': false,
        minimumDescriptionLength: 5,
      }],
    },
  },
  
  // 导入规则
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/order': ['warn', {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type'
        ],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        },
        'pathGroups': [
          {
            'pattern': 'react',
            'group': 'builtin',
            'position': 'before'
          },
          {
            'pattern': 'next/**',
            'group': 'builtin',
            'position': 'before'
          },
          {
            'pattern': '@/**',
            'group': 'internal',
            'position': 'after'
          }
        ],
        'pathGroupsExcludedImportTypes': ['react', 'next']
      }],
      'import/no-unresolved': 'off', // TypeScript 已经处理这个问题
      'import/extensions': 'off', // TypeScript 已经处理这个问题
      'import/no-cycle': 'warn',
      'import/no-useless-path-segments': 'warn',
    },
  },
  
  // Promise 规则
  {
    plugins: {
      promise: promisePlugin,
    },
    rules: {
      ...promisePlugin.configs.recommended.rules,
      'promise/always-return': 'off', // 太严格，可能导致误报
      'promise/catch-or-return': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
    },
  },
  
  // 安全规则
  {
    plugins: {
      security: securityPlugin,
    },
    rules: {
      'security/detect-object-injection': 'off', // 太严格，可能导致误报
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-non-literal-require': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'warn',
      'security/detect-buffer-noassert': 'error',
      'security/detect-unsafe-regex': 'warn',
    },
  },
  
  // SonarJS 规则 (代码质量)
  {
    plugins: {
      sonarjs: sonarjsPlugin,
    },
    rules: {
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-one-iteration-loop': 'error',
      'sonarjs/no-use-of-empty-return-value': 'error',
      'sonarjs/no-inverted-boolean-check': 'warn',
      'sonarjs/no-redundant-jump': 'warn',
      'sonarjs/no-same-line-conditional': 'warn',
      'sonarjs/no-small-switch': 'warn',
      'sonarjs/prefer-immediate-return': 'warn',
      'sonarjs/prefer-single-boolean-return': 'warn',
    },
  },
  
  // Unicorn 规则 (现代 JavaScript)
  {
    plugins: {
      unicorn: unicornPlugin,
    },
    rules: {
      'unicorn/better-regex': 'warn',
      'unicorn/catch-error-name': 'warn',
      'unicorn/consistent-destructuring': 'warn',
      'unicorn/error-message': 'warn',
      'unicorn/no-array-for-each': 'off', // 可能与现有代码冲突
      'unicorn/no-null': 'off', // TypeScript 项目中 null 是有意义的
      'unicorn/no-useless-undefined': 'warn',
      'unicorn/prefer-includes': 'warn',
      'unicorn/prefer-optional-catch-binding': 'warn',
      'unicorn/prefer-spread': 'warn',
      'unicorn/prefer-string-slice': 'warn',
    },
  },
  
  // 可访问性规则
  {
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/alt-text': 'error',
    },
  },
  
  // 通用代码风格规则
  {
    rules: {
      'no-console': ['warn', { 'allow': ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
      'no-unused-expressions': ['error', { 'allowShortCircuit': true, 'allowTernary': true }],
      'no-param-reassign': ['warn', { 'props': false }],
      'no-nested-ternary': 'warn',
      'no-unneeded-ternary': 'warn',
      'no-useless-return': 'warn',
      'prefer-template': 'warn',
      'spaced-comment': ['warn', 'always'],
      'yoda': 'warn',
    },
  },
];
