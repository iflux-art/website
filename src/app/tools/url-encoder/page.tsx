'use client';

import React from 'react';
import { Link, Unlink, RotateCcw, FileDown, ArrowUpDown } from 'lucide-react';
import { ToolLayout } from '@/components/layout/tool-layout';
import { DualTextarea } from '@/components/ui/dual-textarea';
import { ToolActions } from '@/components/ui/tool-actions';
import { useToolState } from '@/hooks/use-tool-state';
import { urlUtils, exampleData } from '@/lib/tool-utils';

function UrlEncoderPage() {
  const [{ input, output, error }, { setInput, setOutput, setError, clearAll }] = useToolState();

  const encodeUrl = () => {
    const result = urlUtils.encode(input);
    if (result.success && result.data) {
      setOutput(result.data);
      setError('');
    } else {
      setError(result.error || '编码失败');
      setOutput('');
    }
  };

  const decodeUrl = () => {
    const result = urlUtils.decode(input);
    if (result.success && result.data) {
      setOutput(result.data);
      setError('');
    } else {
      setError(result.error || '解码失败');
      setOutput('');
    }
  };

  const swapInputOutput = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setError('');
  };

  const loadExample = () => {
    setInput(exampleData.url());
    setError('');
    setOutput('');
  };

  const actions = [
    {
      label: '编码',
      onClick: encodeUrl,
      icon: Link,
    },
    {
      label: '解码',
      onClick: decodeUrl,
      icon: Unlink,
      variant: 'outline' as const,
    },
    {
      label: '交换',
      onClick: swapInputOutput,
      icon: ArrowUpDown,
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
        <h4 className="font-medium mb-2">什么是 URL 编码？</h4>
        <p className="text-sm text-muted-foreground">
          URL 编码是一种将特殊字符转换为 %XX 格式的编码方式，其中 XX 是字符的十六进制 ASCII
          值。这样可以确保 URL 中的特殊字符不会被误解。
        </p>
      </div>
      <div>
        <h4 className="font-medium mb-2">常见用途</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 在 URL 参数中传递中文字符</li>
          <li>• 处理包含特殊字符的 URL</li>
          <li>• 表单数据的 URL 编码</li>
          <li>• API 请求参数编码</li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">需要编码的字符</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 空格 → %20</li>
          <li>• 中文字符 → %E4%B8%AD%E6%96%87</li>
          <li>• 特殊符号：& ? = # % + 等</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="URL 编码工具"
      description="URL 编码和解码工具，处理特殊字符和中文"
      icon={Link}
      actions={<ToolActions actions={actions} />}
      helpContent={helpContent}
    >
      <DualTextarea
        inputTitle="输入 URL"
        outputTitle="输出结果"
        inputPlaceholder="在此输入要编码/解码的 URL..."
        outputPlaceholder="编码/解码结果将显示在这里..."
        inputValue={input}
        outputValue={output}
        onInputChange={setInput}
        error={error}
      />
    </ToolLayout>
  );
}

UrlEncoderPage.displayName = 'UrlEncoderPage';

export default UrlEncoderPage;