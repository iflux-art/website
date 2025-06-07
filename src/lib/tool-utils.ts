/**
 * 工具页面通用处理函数
 */

export interface ProcessResult {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * 安全的 JSON 处理
 */
export const jsonUtils = {
  format: (input: string): ProcessResult => {
    try {
      if (!input.trim()) {
        return { success: false, error: '请输入 JSON 数据' };
      }
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      return { success: true, data: formatted };
    } catch (error) {
      return {
        success: false,
        error: `JSON 格式错误: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  },

  minify: (input: string): ProcessResult => {
    try {
      if (!input.trim()) {
        return { success: false, error: '请输入 JSON 数据' };
      }
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      return { success: true, data: minified };
    } catch (error) {
      return {
        success: false,
        error: `JSON 格式错误: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  },

  validate: (input: string): ProcessResult => {
    try {
      if (!input.trim()) {
        return { success: false, error: '请输入 JSON 数据' };
      }
      JSON.parse(input);
      return { success: true, data: 'JSON 格式正确 ✓' };
    } catch (error) {
      return {
        success: false,
        error: `JSON 格式错误: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  },
};

/**
 * Base64 编码解码
 */
export const base64Utils = {
  encode: (input: string): ProcessResult => {
    try {
      if (!input) {
        return { success: false, error: '请输入要编码的文本' };
      }
      const encoded = btoa(unescape(encodeURIComponent(input)));
      return { success: true, data: encoded };
    } catch (error) {
      return {
        success: false,
        error: `编码失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  },

  decode: (input: string): ProcessResult => {
    try {
      if (!input) {
        return { success: false, error: '请输入要解码的 Base64 文本' };
      }
      const decoded = decodeURIComponent(escape(atob(input)));
      return { success: true, data: decoded };
    } catch (error) {
      return {
        success: false,
        error: `解码失败: ${error instanceof Error ? error.message : '请检查 Base64 格式是否正确'}`,
      };
    }
  },
};

/**
 * URL 编码解码
 */
export const urlUtils = {
  encode: (input: string): ProcessResult => {
    try {
      if (!input) {
        return { success: false, error: '请输入要编码的 URL' };
      }
      const encoded = encodeURIComponent(input);
      return { success: true, data: encoded };
    } catch (error) {
      return {
        success: false,
        error: `编码失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  },

  decode: (input: string): ProcessResult => {
    try {
      if (!input) {
        return { success: false, error: '请输入要解码的 URL' };
      }
      const decoded = decodeURIComponent(input);
      return { success: true, data: decoded };
    } catch (error) {
      return {
        success: false,
        error: `解码失败: ${
          error instanceof Error ? error.message : '请检查 URL 编码格式是否正确'
        }`,
      };
    }
  },
};

/**
 * 文本处理工具
 */
export const textUtils = {
  toUpperCase: (input: string): ProcessResult => {
    if (!input) {
      return { success: false, error: '请输入文本' };
    }
    return { success: true, data: input.toUpperCase() };
  },

  toLowerCase: (input: string): ProcessResult => {
    if (!input) {
      return { success: false, error: '请输入文本' };
    }
    return { success: true, data: input.toLowerCase() };
  },

  removeSpaces: (input: string): ProcessResult => {
    if (!input) {
      return { success: false, error: '请输入文本' };
    }
    return { success: true, data: input.replace(/\s+/g, '') };
  },

  wordCount: (input: string): ProcessResult => {
    if (!input) {
      return { success: false, error: '请输入文本' };
    }
    const words = input
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, '').length;
    const lines = input.split('\n').length;

    const result = `字符数: ${chars}\n字符数(不含空格): ${charsNoSpaces}\n单词数: ${words.length}\n行数: ${lines}`;
    return { success: true, data: result };
  },
};

/**
 * 通用的异步处理函数
 */
export async function processWithLoading<T>(
  processor: () => Promise<T> | T,
  setLoading: (loading: boolean) => void
): Promise<T> {
  setLoading(true);
  try {
    const result = await processor();
    return result;
  } finally {
    setLoading(false);
  }
}

/**
 * 颜色处理工具
 */
export const colorUtils = {
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  rgbToHex: (r: number, g: number, b: number): string => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  hexToHsl: (hex: string): { h: number; s: number; l: number } | null => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return null;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  },

  generateRandomColor: (): string => {
    const randomHex = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomHex}`;
  },

  getColorFormats: (hex: string) => {
    const rgb = colorUtils.hexToRgb(hex);
    const hsl = colorUtils.hexToHsl(hex);

    return {
      hex: hex.toUpperCase(),
      rgb: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '',
      hsl: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '',
      css: `--color: ${hex};`,
    };
  },
};

/**
 * 示例数据生成器
 */
export const exampleData = {
  json: () =>
    JSON.stringify(
      {
        name: '张三',
        age: 30,
        city: '北京',
        hobbies: ['阅读', '旅行', '编程'],
        address: {
          street: '中关村大街',
          number: 123,
        },
      },
      null,
      2
    ),

  base64Text: () => 'Hello, 世界! 这是一个测试文本。',

  url: () => 'https://example.com/search?q=测试查询&category=技术&page=1',

  longText: () => `这是一个示例文本，用于测试各种文本处理功能。
它包含多行内容，有中文和英文混合。
可以用来测试字符统计、大小写转换等功能。

This is a sample text for testing various text processing features.
It contains multiple lines with mixed Chinese and English content.
You can use it to test character counting, case conversion, and other functions.`,

  color: () => '#3b82f6',

  timestamp: () => Math.floor(Date.now() / 1000).toString(),

  datetime: () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },
};

/**
 * 时间处理工具
 */
export const timeUtils = {
  timestampToDatetime: (timestamp: string): ProcessResult => {
    try {
      if (!timestamp.trim()) {
        return { success: false, error: '请输入时间戳' };
      }

      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        return { success: false, error: '请输入有效的时间戳' };
      }

      // 判断是秒级还是毫秒级时间戳
      const date = ts.toString().length === 10 ? new Date(ts * 1000) : new Date(ts);

      if (isNaN(date.getTime())) {
        return { success: false, error: '无效的时间戳' };
      }

      // 格式化为本地时间
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      const result = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return { success: true, data: result };
    } catch {
      return { success: false, error: '转换失败，请检查时间戳格式' };
    }
  },

  datetimeToTimestamp: (datetime: string): ProcessResult => {
    try {
      if (!datetime.trim()) {
        return { success: false, error: '请输入日期时间' };
      }

      const date = new Date(datetime);

      if (isNaN(date.getTime())) {
        return { success: false, error: '请输入有效的日期时间格式' };
      }

      const ts = Math.floor(date.getTime() / 1000);
      return { success: true, data: ts.toString() };
    } catch {
      return { success: false, error: '转换失败，请检查日期时间格式' };
    }
  },

  getCurrentTimestamp: (): ProcessResult => {
    const now = Math.floor(Date.now() / 1000);
    return { success: true, data: now.toString() };
  },

  getCurrentDatetime: (): ProcessResult => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const result = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return { success: true, data: result };
  },
};

/**
 * 密码生成工具
 */
export const passwordUtils = {
  generate: (options: {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    excludeSimilar: boolean;
  }): ProcessResult => {
    const {
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeSimilar,
    } = options;

    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeSimilar) {
      charset = charset.replace(/[0O1lI]/g, '');
    }

    if (charset === '') {
      return { success: false, error: '请至少选择一种字符类型' };
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return { success: true, data: result };
  },

  calculateStrength: (password: string): number => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(score, 5);
  },
};

/**
 * 单位转换工具
 */
export const unitUtils = {
  length: {
    convert: (value: number, from: string, to: string): ProcessResult => {
      const meters: Record<string, number> = {
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        inch: 0.0254,
        ft: 0.3048,
        yard: 0.9144,
        mile: 1609.34,
      };

      if (!meters[from] || !meters[to]) {
        return { success: false, error: '不支持的单位' };
      }

      const result = (value * meters[from]) / meters[to];
      return { success: true, data: result.toString() };
    },
  },

  weight: {
    convert: (value: number, from: string, to: string): ProcessResult => {
      const grams: Record<string, number> = {
        mg: 0.001,
        g: 1,
        kg: 1000,
        t: 1000000,
        oz: 28.3495,
        lb: 453.592,
      };

      if (!grams[from] || !grams[to]) {
        return { success: false, error: '不支持的单位' };
      }

      const result = (value * grams[from]) / grams[to];
      return { success: true, data: result.toString() };
    },
  },

  temperature: {
    convert: (value: number, from: string, to: string): ProcessResult => {
      let celsius: number;

      // 转换为摄氏度
      switch (from) {
        case 'C':
          celsius = value;
          break;
        case 'F':
          celsius = ((value - 32) * 5) / 9;
          break;
        case 'K':
          celsius = value - 273.15;
          break;
        default:
          return { success: false, error: '不支持的单位' };
      }

      // 从摄氏度转换为目标单位
      let result: number;
      switch (to) {
        case 'C':
          result = celsius;
          break;
        case 'F':
          result = (celsius * 9) / 5 + 32;
          break;
        case 'K':
          result = celsius + 273.15;
          break;
        default:
          return { success: false, error: '不支持的单位' };
      }

      return { success: true, data: result.toFixed(2) };
    },
  },
};

/**
 * 计算器工具
 */
export const calculatorUtils = {
  evaluate: (expression: string): ProcessResult => {
    try {
      if (!expression.trim()) {
        return { success: false, error: '请输入表达式' };
      }

      // 安全的数学表达式求值
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      if (sanitized !== expression) {
        return { success: false, error: '表达式包含无效字符' };
      }

      const result = Function('"use strict"; return (' + sanitized + ')')();

      if (typeof result !== 'number' || !isFinite(result)) {
        return { success: false, error: '计算结果无效' };
      }

      return { success: true, data: result.toString() };
    } catch {
      return { success: false, error: '表达式语法错误' };
    }
  },
};

/**
 * 哈希工具
 */
export const hashUtils = {
  md5: async (text: string): Promise<ProcessResult> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('MD5', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return { success: true, data: hashHex };
    } catch {
      // MD5 不被所有浏览器支持，使用简单的哈希算法
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // 转换为32位整数
      }
      return { success: true, data: Math.abs(hash).toString(16) };
    }
  },

  sha256: async (text: string): Promise<ProcessResult> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return { success: true, data: hashHex };
    } catch {
      return { success: false, error: '浏览器不支持 SHA-256' };
    }
  },
};