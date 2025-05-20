# TypeScript 最佳实践指南

## 1. 类型系统目标

本指南详细说明如何在项目中有效使用 TypeScript，提高代码质量、可维护性和开发效率。

### 1.1 主要目标

- **类型安全**：消除运行时类型错误
- **代码可读性**：通过类型提高代码可读性
- **开发效率**：利用类型系统提高开发效率
- **文档化**：使用类型作为代码文档

### 1.2 严格模式配置

在 `tsconfig.json` 中启用严格模式和相关检查：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 2. 类型定义最佳实践

### 2.1 基本类型定义

#### 2.1.1 使用精确的类型

- 避免使用 `any` 类型
- 使用联合类型代替 `any`
- 使用字面量类型提高精确性

```typescript
// 不好的做法
let status: any;

// 好的做法
type Status = 'idle' | 'loading' | 'success' | 'error';
let status: Status = 'idle';
```

#### 2.1.2 使用接口定义对象类型

- 使用接口定义对象结构
- 为接口属性添加注释
- 使用可选属性标记非必需字段

```typescript
/**
 * 用户信息接口
 */
interface User {
  /** 用户ID */
  id: string;
  /** 用户名 */
  username: string;
  /** 电子邮件 */
  email: string;
  /** 头像URL（可选） */
  avatarUrl?: string;
  /** 用户角色 */
  role: 'admin' | 'user' | 'guest';
}
```

### 2.2 组件类型定义

#### 2.2.1 React 组件 Props 类型

- 使用接口定义组件 Props
- 扩展 HTML 元素属性
- 明确标注可选 Props

```typescript
import { ButtonHTMLAttributes } from 'react';

/**
 * 按钮组件的属性
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 按钮变体样式
   * @default "default"
   */
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
  
  /**
   * 按钮尺寸
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * 是否禁用按钮
   * @default false
   */
  disabled?: boolean;
}
```

#### 2.2.2 组件状态类型

- 为组件状态定义明确的类型
- 使用 `useState` 的泛型参数指定类型

```typescript
interface FormState {
  username: string;
  email: string;
  password: string;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

function LoginForm() {
  const [formState, setFormState] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    isSubmitting: false,
    errors: {},
  });
  
  // 组件实现
}
```

### 2.3 函数类型定义

#### 2.3.1 函数参数和返回值类型

- 为函数参数和返回值添加类型注解
- 使用函数重载处理复杂情况
- 为回调函数定义类型

```typescript
/**
 * 格式化日期
 * @param date - 要格式化的日期
 * @param format - 日期格式
 * @returns 格式化后的日期字符串
 */
function formatDate(date: Date, format: string): string {
  // 实现
  return '';
}

/**
 * 事件处理器类型
 */
type EventHandler<T = HTMLElement> = (event: React.SyntheticEvent<T>) => void;

/**
 * 点击处理器
 */
const handleClick: EventHandler<HTMLButtonElement> = (event) => {
  // 处理点击事件
};
```

#### 2.3.2 泛型函数

- 使用泛型提高函数的复用性
- 为泛型参数添加约束
- 提供默认类型参数

```typescript
/**
 * 从数组中获取随机项
 * @param array - 输入数组
 * @returns 随机数组项
 */
function getRandomItem<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

/**
 * 从对象中选择指定的属性
 * @param obj - 输入对象
 * @param keys - 要选择的属性键
 * @returns 包含选定属性的新对象
 */
function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}
```

## 3. 类型组织和管理

### 3.1 类型文件组织

#### 3.1.1 类型定义文件结构

- 为每个组件创建单独的类型文件
- 使用 `index.ts` 集中导出类型
- 按功能域组织类型

```
src/
  └── types/
      ├── index.ts              # 集中导出所有类型
      ├── common.ts             # 通用类型
      ├── ui-types.ts           # UI组件类型
      ├── feature-types.ts      # 功能组件类型
      ├── layout-types.ts       # 布局组件类型
      ├── api.ts                # API相关类型
      └── state.ts              # 状态管理类型
```

#### 3.1.2 类型导入和导出

- 使用命名导出导出类型
- 从类型文件中重新导出类型
- 避免循环依赖

```typescript
// types/ui-types.ts
export interface ButtonProps { /* ... */ }
export interface CardProps { /* ... */ }

// types/index.ts
export * from './ui-types';
export * from './feature-types';
export * from './layout-types';
export * from './common';
export * from './api';
export * from './state';
```

### 3.2 高级类型技术

#### 3.2.1 工具类型

- 使用 TypeScript 内置工具类型
- 创建自定义工具类型
- 组合工具类型解决复杂问题

```typescript
// 使用内置工具类型
type ReadonlyUser = Readonly<User>;
type UserWithoutId = Omit<User, 'id'>;
type UserKeys = keyof User;
type OptionalUser = Partial<User>;
type RequiredUser = Required<User>;

// 自定义工具类型
/**
 * 将对象的所有属性转换为可选的深层次版本
 */
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * 从联合类型中排除null和undefined
 */
type NonNullable<T> = T extends null | undefined ? never : T;
```

#### 3.2.2 条件类型和映射类型

- 使用条件类型处理类型逻辑
- 使用映射类型转换现有类型
- 结合索引访问类型获取嵌套属性类型

```typescript
// 条件类型
type ExtractId<T> = T extends { id: infer U } ? U : never;
type UserId = ExtractId<User>; // string

// 映射类型
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// 组合使用
type FormFieldType<T> = {
  [K in keyof T]: T[K] extends string
    ? 'text'
    : T[K] extends number
    ? 'number'
    : T[K] extends boolean
    ? 'checkbox'
    : 'unknown';
};

type UserFormFields = FormFieldType<User>;
```

## 4. 类型安全实践

### 4.1 类型断言和类型守卫

#### 4.1.1 类型断言

- 谨慎使用类型断言
- 优先使用类型守卫而非类型断言
- 使用 `as const` 创建只读类型

```typescript
// 类型断言
const element = document.getElementById('root') as HTMLDivElement;

// 使用as const
const COLORS = {
  PRIMARY: '#0070f3',
  SECONDARY: '#1a202c',
  SUCCESS: '#0070f3',
  ERROR: '#ff0000',
} as const;

type ColorKey = keyof typeof COLORS;
type ColorValue = typeof COLORS[ColorKey];
```

#### 4.1.2 类型守卫

- 使用类型谓词函数
- 使用 `instanceof` 和 `typeof` 运算符
- 使用属性检查

```typescript
// 类型谓词
function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'username' in obj &&
    'email' in obj
  );
}

// 使用类型守卫
function processEntity(entity: User | Post) {
  if ('username' in entity) {
    // entity 类型缩小为 User
    console.log(entity.username);
  } else {
    // entity 类型缩小为 Post
    console.log(entity.title);
  }
}
```

### 4.2 错误处理和空值处理

#### 4.2.1 空值处理

- 使用 `strictNullChecks` 捕获空值错误
- 使用可选链和空值合并运算符
- 使用类型守卫处理可能为空的值

```typescript
// 可选链和空值合并
const username = user?.username ?? 'Guest';

// 类型守卫处理空值
function getUserName(user: User | null | undefined): string {
  if (!user) {
    return 'Guest';
  }
  return user.username;
}
```

#### 4.2.2 错误处理

- 为错误定义类型
- 使用 `try/catch` 块处理异常
- 创建类型安全的错误处理工具

```typescript
// 错误类型
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// 类型安全的错误处理
async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw error;
    }
    return await response.json() as T;
  } catch (error) {
    if (isApiError(error)) {
      // 处理API错误
      console.error(`API Error: ${error.code} - ${error.message}`);
    } else {
      // 处理其他错误
      console.error('Unknown error:', error);
    }
    throw error;
  }
}

function isApiError(error: any): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}
```

## 5. 类型测试和验证

### 5.1 类型测试

- 使用 `tsd` 或 `dtslint` 测试类型定义
- 创建类型测试用例
- 验证类型错误

### 5.2 类型验证工具

- 使用 `typescript-eslint` 强制执行类型规则
- 配置 `tsconfig.json` 启用严格检查
- 使用 `ts-expect-error` 或 `ts-ignore` 注释处理特殊情况

## 6. 结论

通过遵循本指南中的 TypeScript 最佳实践，我们可以提高代码质量、减少运行时错误，并提升开发效率。TypeScript 不仅是一种类型系统，更是一种开发工具，能够帮助我们编写更可靠、更易维护的代码。
