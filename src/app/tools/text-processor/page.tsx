'use client';

import React from 'react';
import { Type, RotateCcw, FileDown, Calculator, ArrowUp, ArrowDown } from 'lucide-react';
import { ToolLayout } from '@/components/layout/tool-layout';
import { DualTextarea } from '@/components/ui/dual-textarea';
import { ToolActions } from '@/components/ui/tool-actions';
import { useToolState } from '@/hooks/use-tool-state';
import { textUtils, exampleData } from '@/lib/tool-utils';

export default function TextProcessorPage() {
  const [{ input, output, error }, { setInput, setOutput, setError, clearAll }] = useToolState();

  const toUpperCase = () => {
    const result = textUtils.toUpperCase(input);
    if (result.success) {
      setOutput(result.data!);
      setError('');
    } else {
      setError(result.error!);
      setOutput('');
    }
  };

  const toLowerCase = () => {
    const result = textUtils.toLowerCase(input);
    if (result.success) {
      setOutput(result.data!);
      setError('');
    } else {
      setError(result.error!);
      setOutput('');
    }
  };

  const removeSpaces = () => {
    const result = textUtils.removeSpaces(input);
    if (result.success) {
      setOutput(result.data!);
      setError('');
    } else {
      setError(result.error!);
      setOutput('');
    }
  };

  const countWords = () => {
    const result = textUtils.wordCount(input);
    if (result.success) {
      setOutput(result.data!);
      setError('');
    } else {
      setError(result.error!);
      setOutput('');
    }
  };

  const loadExample = () => {
    setInput(exampleData.longText());
    setError('');
    setOutput('');
  };

  const actions = [
    {
      label: '转大写',
      onClick: toUpperCase,
      icon: ArrowUp,
    },
    {
      label: '转小写',
      onClick: toLowerCase,
      icon: ArrowDown,
      variant: 'outline' as const,
    },
    {
      label: '移除空格',
      onClick: removeSpaces,
      variant: 'outline' as const,
    },
    {
      label: '字符统计',
      onClick: countWords,
      icon: Calculator,
      variant: 'outline' as const,
    },
    {
      label: '加载示例',
      onClick: loadExample,
      icon: FileDown,
      variant: 'outline' as const,
    },
    {
      label: '清空',
      onClick: clearAll,
      icon: RotateCcw,
      variant: 'outline' as const,
    },
  ];

  const helpContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">功能介绍</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <strong>转大写</strong>：将所有字母转换为大写
          </li>
          <li>
            • <strong>转小写</strong>：将所有字母转换为小写
          </li>
          <li>
            • <strong>移除空格</strong>：删除文本中的所有空格字符
          </li>
          <li>
            • <strong>字符统计</strong>：统计字符数、单词数、行数等
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">使用场景</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 文档格式化处理</li>
          <li>• 代码变量名转换</li>
          <li>• 文本内容分析</li>
          <li>• 数据清洗预处理</li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">统计信息说明</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <strong>字符数</strong>：包含所有字符（含空格）
          </li>
          <li>
            • <strong>字符数(不含空格)</strong>：不包含空格的字符数
          </li>
          <li>
            • <strong>单词数</strong>：以空格分隔的单词数量
          </li>
          <li>
            • <strong>行数</strong>：文本的行数
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="文本处理工具"
      description="文本格式转换、字符统计等文本处理功能"
      icon={Type}
      actions={<ToolActions actions={actions} />}
      helpContent={helpContent}
    >
      <DualTextarea
        inputTitle="输入文本"
        outputTitle="处理结果"
        inputPlaceholder="在此输入要处理的文本..."
        outputPlaceholder="处理结果将显示在这里..."
        inputValue={input}
        outputValue={output}
        onInputChange={setInput}
        error={error}
      />
    </ToolLayout>
  );
}