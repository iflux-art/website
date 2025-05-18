/**
 * 环境变量加载工具
 * 用于确保翻译脚本能正确获取配置信息
 */
import { config } from 'dotenv';
import path from 'path';

// 加载环境变量
export function loadEnv() {
  // 尝试加载.env.local文件
  const localEnvPath = path.resolve(process.cwd(), '.env.local');
  const result = config({ path: localEnvPath });
  
  // 如果.env.local不存在，尝试加载.env文件
  if (!result.parsed) {
    const envPath = path.resolve(process.cwd(), '.env');
    config({ path: envPath });
  }
  
  // 检查是否有翻译API密钥
  if (!process.env.AZURE_TRANSLATOR_KEY) {
    console.warn('警告: 未找到AZURE_TRANSLATOR_KEY环境变量，将使用模拟翻译');
  }
}