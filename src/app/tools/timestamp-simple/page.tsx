'use client';

import React from 'react';
import { Clock, ArrowRight, ArrowLeft, RotateCcw, FileDown } from 'lucide-react';
import { ToolLayout } from '@/components/layouts/tool-layout';
import { DualTextarea } from '@/components/ui/dual-textarea';
import { ToolActions } from '@/components/ui/tool-actions';
import { useToolState } from '@/hooks/use-tool-state';
import { timeUtils, exampleData } from '@/lib/tool-utils';

export default function TimestampSimplePage() {
  const [{ input, output, error }, { setInput, setOutput, setError, clearAll }] = useToolState();

  const timestampToDatetime = () => {
    const result = timeUtils.timestampToDatetime(input);
    if (result.success) {
      setOutput(result.data!);
      setError('');
    } else {
      setError(result.error!);
      setOutput('');
    }
  };

  const datetimeToTimestamp = () => {
    const result = timeUtils.datetimeToTimestamp(input);
    if (result.success) {
      setOutput(result.data!);
      setError('');
    } else {
      setError(result.error!);
      setOutput('');
    }
  };

  const loadCurrentTimestamp = () => {
    const result = timeUtils.getCurrentTimestamp();
    if (result.success) {
      setInput(result.data!);
      setError('');
      setOutput('');
    }
  };

  const loadCurrentDatetime = () => {
    const result = timeUtils.getCurrentDatetime();
    if (result.success) {
      setInput(result.data!);
      setError('');
      setOutput('');
    }
  };

  const actions = [
    {
      label: '时间戳→日期',
      onClick: timestampToDatetime,
      icon: ArrowRight,
    },
    {
      label: '日期→时间戳',
      onClick: datetimeToTimestamp,
      icon: ArrowLeft,
      variant: 'outline' as const,
    },
    {
      label: '当前时间戳',
      onClick: loadCurrentTimestamp,
      icon: Clock,
      variant: 'outline' as const,
    },
    {
      label: '当前日期',
      onClick: loadCurrentDatetime,
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
        <h4 className="font-medium mb-2">支持格式</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>时间戳</strong>：支持秒级（10位）和毫秒级（13位）</li>
          <li>• <strong>日期时间</strong>：YYYY-MM-DD HH:mm:ss 格式</li>
          <li>• <strong>ISO 格式</strong>：2024-01-01T12:00:00.000Z</li>
          <li>• <strong>自然语言</strong>：2024/1/1 12:00:00</li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">使用说明</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 在输入框中输入时间戳或日期时间</li>
          <li>• 点击对应的转换按钮进行转换</li>
          <li>• 可以快速获取当前时间戳或日期时间</li>
          <li>• 支持一键复制转换结果</li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">示例</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 时间戳：1704067200（秒级）</li>
          <li>• 时间戳：1704067200000（毫秒级）</li>
          <li>• 日期时间：2024-01-01 12:00:00</li>
          <li>• ISO 格式：2024-01-01T12:00:00Z</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="时间戳转换工具"
      description="时间戳与日期时间相互转换，支持多种格式"
      icon={Clock}
      actions={<ToolActions actions={actions} />}
      helpContent={helpContent}
    >
      <DualTextarea
        inputTitle="输入时间戳或日期时间"
        outputTitle="转换结果"
        inputPlaceholder="输入时间戳（如：1704067200）或日期时间（如：2024-01-01 12:00:00）"
        outputPlaceholder="转换结果将显示在这里..."
        inputValue={input}
        outputValue={output}
        onInputChange={setInput}
        error={error}
      />
    </ToolLayout>
  );
}
