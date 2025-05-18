/**
 * Jest配置文件
 * 用于配置Jest测试框架，支持React组件测试
 */

module.exports = {
  // 测试环境
  testEnvironment: 'jsdom',
  
  // 测试文件匹配模式
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  
  // 测试覆盖率收集
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/app/api/**/*',
  ],
  
  // 转换器配置
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // 模块名映射，简化导入路径
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // 设置测试环境
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // 忽略的目录
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  
  // 覆盖率报告目录
  coverageDirectory: '<rootDir>/coverage',
  
  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};