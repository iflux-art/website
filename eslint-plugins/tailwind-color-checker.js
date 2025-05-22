/**
 * ESLint 插件：检测 Tailwind CSS 传统颜色名称的使用
 * 
 * 此插件用于检测代码中使用的传统 Tailwind CSS 颜色名称，
 * 并建议使用 CSS 变量或 OKLCH 颜色格式替代。
 */

// 传统颜色名称列表
const traditionalColorNames = [
  // 灰度系列
  'gray', 'slate', 'zinc', 'neutral', 'stone',
  // 颜色系列
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 
  'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 
  'fuchsia', 'pink', 'rose',
];

// 颜色强度列表
const colorIntensities = [
  '50', '100', '200', '300', '400', '500', 
  '600', '700', '800', '900', '950',
];

// 生成所有可能的颜色类名组合
const generateColorClassPatterns = () => {
  const patterns = [];
  
  // 文本颜色: text-{color}-{intensity}
  traditionalColorNames.forEach(color => {
    colorIntensities.forEach(intensity => {
      patterns.push(`text-${color}-${intensity}`);
    });
  });
  
  // 背景颜色: bg-{color}-{intensity}
  traditionalColorNames.forEach(color => {
    colorIntensities.forEach(intensity => {
      patterns.push(`bg-${color}-${intensity}`);
    });
  });
  
  // 边框颜色: border-{color}-{intensity}
  traditionalColorNames.forEach(color => {
    colorIntensities.forEach(intensity => {
      patterns.push(`border-${color}-${intensity}`);
    });
  });
  
  // 轮廓颜色: outline-{color}-{intensity}
  traditionalColorNames.forEach(color => {
    colorIntensities.forEach(intensity => {
      patterns.push(`outline-${color}-${intensity}`);
    });
  });
  
  // 阴影颜色: shadow-{color}-{intensity}
  traditionalColorNames.forEach(color => {
    colorIntensities.forEach(intensity => {
      patterns.push(`shadow-${color}-${intensity}`);
    });
  });
  
  // 环颜色: ring-{color}-{intensity}
  traditionalColorNames.forEach(color => {
    colorIntensities.forEach(intensity => {
      patterns.push(`ring-${color}-${intensity}`);
    });
  });
  
  // 分割线颜色: divide-{color}-{intensity}
  traditionalColorNames.forEach(color => {
    colorIntensities.forEach(intensity => {
      patterns.push(`divide-${color}-${intensity}`);
    });
  });
  
  // 占位符颜色: placeholder-{color}-{intensity}
  traditionalColorNames.forEach(color => {
    colorIntensities.forEach(intensity => {
      patterns.push(`placeholder-${color}-${intensity}`);
    });
  });
  
  return patterns;
};

// 所有传统颜色类名模式
const traditionalColorPatterns = generateColorClassPatterns();

// 推荐的替代方案
const recommendations = {
  // 灰度系列
  'gray': 'text-foreground, text-muted-foreground 或 text-[oklch(0.4_0_0)]',
  'slate': 'text-foreground, text-muted-foreground 或 text-[oklch(0.4_0.02_240)]',
  'zinc': 'text-foreground, text-muted-foreground 或 text-[oklch(0.4_0_0)]',
  'neutral': 'text-foreground, text-muted-foreground 或 text-[oklch(0.4_0_0)]',
  'stone': 'text-foreground, text-muted-foreground 或 text-[oklch(0.4_0.02_80)]',
  
  // 颜色系列
  'red': 'text-destructive 或 text-[oklch(0.5_0.15_20)]',
  'orange': 'text-[oklch(0.5_0.15_60)]',
  'amber': 'text-[oklch(0.7_0.15_80)]',
  'yellow': 'text-[oklch(0.7_0.15_85)]',
  'lime': 'text-[oklch(0.7_0.15_120)]',
  'green': 'text-success 或 text-[oklch(0.5_0.15_140)]',
  'emerald': 'text-[oklch(0.5_0.15_150)]',
  'teal': 'text-[oklch(0.5_0.15_180)]',
  'cyan': 'text-[oklch(0.5_0.15_200)]',
  'sky': 'text-[oklch(0.5_0.15_220)]',
  'blue': 'text-primary 或 text-[oklch(0.5_0.15_240)]',
  'indigo': 'text-[oklch(0.5_0.15_260)]',
  'violet': 'text-[oklch(0.5_0.15_270)]',
  'purple': 'text-[oklch(0.5_0.15_280)]',
  'fuchsia': 'text-[oklch(0.5_0.15_300)]',
  'pink': 'text-[oklch(0.5_0.15_320)]',
  'rose': 'text-[oklch(0.5_0.15_10)]',
};

// 创建 ESLint 规则
module.exports = {
  rules: {
    'no-traditional-colors': {
      meta: {
        type: 'suggestion',
        docs: {
          description: '检测 Tailwind CSS 传统颜色名称的使用',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: null,
        schema: [],
      },
      create(context) {
        return {
          // 检查 JSX 属性
          JSXAttribute(node) {
            if (
              node.name.name === 'className' && 
              node.value && 
              node.value.type === 'Literal' && 
              typeof node.value.value === 'string'
            ) {
              const classNames = node.value.value.split(/\s+/);
              
              for (const className of classNames) {
                // 检查是否使用了传统颜色名称
                if (traditionalColorPatterns.some(pattern => {
                  // 精确匹配或带有修饰符的匹配（如 hover:text-blue-500）
                  return className === pattern || className.endsWith(`:${pattern}`);
                })) {
                  // 提取颜色名称以提供具体建议
                  const colorMatch = className.match(/(?:^|:)(?:text|bg|border|outline|shadow|ring|divide|placeholder)-([a-z]+)-\d+$/);
                  const colorName = colorMatch ? colorMatch[1] : null;
                  
                  let message = `避免使用传统 Tailwind 颜色名称 "${className}"，请使用 CSS 变量或 OKLCH 颜色格式`;
                  
                  // 如果能识别具体的颜色，提供更具体的建议
                  if (colorName && recommendations[colorName]) {
                    message += `。建议使用: ${recommendations[colorName]}`;
                  }
                  
                  context.report({
                    node,
                    message,
                  });
                }
              }
            }
          },
          
          // 检查模板字符串中的类名
          TemplateLiteral(node) {
            // 处理 cn() 或 clsx() 等工具函数中的模板字符串
            node.quasis.forEach(quasi => {
              const value = quasi.value.cooked;
              if (value) {
                const classNames = value.split(/\s+/);
                
                for (const className of classNames) {
                  if (traditionalColorPatterns.some(pattern => {
                    return className === pattern || className.endsWith(`:${pattern}`);
                  })) {
                    const colorMatch = className.match(/(?:^|:)(?:text|bg|border|outline|shadow|ring|divide|placeholder)-([a-z]+)-\d+$/);
                    const colorName = colorMatch ? colorMatch[1] : null;
                    
                    let message = `避免使用传统 Tailwind 颜色名称 "${className}"，请使用 CSS 变量或 OKLCH 颜色格式`;
                    
                    if (colorName && recommendations[colorName]) {
                      message += `。建议使用: ${recommendations[colorName]}`;
                    }
                    
                    context.report({
                      node,
                      message,
                    });
                  }
                }
              }
            });
          },
        };
      },
    },
  },
};
