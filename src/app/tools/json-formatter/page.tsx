'use client';

import React from 'react';
import { FileText, Minimize, Maximize, RotateCcw, FileDown } from 'lucide-react';
import { ToolLayout } from '@/components/layouts/tool-layout';
import { DualTextarea } from '@/components/ui/dual-textarea';
import { ToolActions } from '@/components/ui/tool-actions';
import { useToolState } from '@/hooks/use-tool-state';
import { jsonUtils, exampleData } from '@/lib/tool-utils';

export default function JsonFormatterPage() {
  const [{ input, output, error }, { setInput, setOutput, setError, clearAll }] = useToolState();

  const formatJson = () => {
    const result = jsonUtils.format(input);
    if (result.success) {
      setOutput(result.data!);
      setError('');
    } else {
      setError(result.error!);
      setOutput('');
    }
  };

  const minifyJson = () => {
    const result = jsonUtils.minify(input);
    if (result.success) {
      setOutput(result.data!);
      setError('');
    } else {
      setError(result.error!);
      setOutput('');
    }
  };

  const validateJson = () => {
    const result = jsonUtils.validate(input);
    if (result.success) {
      setOutput(result.data!);
      setError('');
    } else {
      setError(result.error!);
      setOutput('');
    }
  };

  const loadExample = () => {
    setInput(exampleData.json());
    setError('');
    setOutput('');
  };

  const actions = [
    {
      label: '格式化',
      onClick: formatJson,
      icon: Maximize,
    },
    {
      label: '压缩',
      onClick: minifyJson,
      icon: Minimize,
      variant: 'outline' as const,
    },
    {
      label: '验证',
      onClick: validateJson,
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
            • <strong>格式化</strong>：将压缩的 JSON 格式化为易读的缩进格式
          </li>
          <li>
            • <strong>压缩</strong>：移除所有空格和换行，压缩 JSON 大小
          </li>
          <li>
            • <strong>验证</strong>：检查 JSON 语法是否正确
          </li>
          <li>
            • <strong>复制</strong>：一键复制格式化后的结果
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">快捷键</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + A</kbd> 全选文本
          </li>
          <li>
            • <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + C</kbd> 复制文本
          </li>
          <li>
            • <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + V</kbd> 粘贴文本
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="JSON 格式化工具"
      description="格式化、压缩和验证 JSON 数据"
      icon={FileText}
      actions={<ToolActions actions={actions} />}
      helpContent={helpContent}
    >
      <DualTextarea
        inputTitle="输入 JSON"
        outputTitle="输出结果"
        inputPlaceholder="在此输入 JSON 数据..."
        outputPlaceholder="格式化后的 JSON 将显示在这里..."
        inputValue={input}
        outputValue={output}
        onInputChange={setInput}
        error={error}
      />
    </ToolLayout>
  );
}
