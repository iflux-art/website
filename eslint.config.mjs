import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", 
    "next/typescript",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended"
  ),
  {
    rules: {
      // 允许的例外规则
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off",
      
      // TypeScript 规则
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      
      // React 规则
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // 可访问性规则
      "jsx-a11y/anchor-is-valid": "warn",
      
      // 代码风格规则
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "prefer-const": "error",
      "no-duplicate-imports": "error"
    }
  }
];

export default eslintConfig;
