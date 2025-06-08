'use client';

import React from 'react';
import { Lock, Unlock, RotateCcw, FileDown, ArrowUpDown } from 'lucide-react';
import { ToolLayout } from '@/components/layout/tool-layout';
import { DualTextarea } from '@/components/ui/dual-textarea';
import { ToolActions } from '@/components/ui/tool-actions';
import { useToolState } from '@/hooks/use-tool-state';
import { base64Utils, exampleData } from '@/lib/tool-utils';

export default function Base64SimplePage() {
  const [{ input, output, error }, { setInput, setOutput, setError, clearAll }] = useToolState();

  const encodeBase64 = () => {
    const result = base64Utils.encode(input);
    if (result.success) {
      setOutput(result.data!);
      setError('');
    } else {
      setError(result.error!);
      setOutput('');
    }
  };

  const decodeBase64 = () => {
    const result = base64Utils.decode(input);
    if (result.success) {
      setOutput(result.data!);
      setError('');
    } else {
      setError(result.error!);
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
    setInput(exampleData.base64Text());
    setError('');
    setOutput('');
  };

  const actions = [
    {
      label: '编码',
      onClick: encodeBase64,
      icon: Lock,
    },
    {
      label: '解码',
      onClick: decodeBase64,
      icon: Unlock,
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
        <h4 className="font-medium mb-2">什么是 Base64？</h4>
        <p className="text-sm text-muted-foreground">
          Base64
          是一种基于64个可打印字符来表示二进制数据的表示方法。常用于在HTTP环境下传递较长的标识信息，或者在需要将二进制数据存储在文本格式中的场景。
        </p>
      </div>
      <div>
        <h4 className="font-medium mb-2">功能特点</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 支持中文字符的编码和解码</li>
          <li>• 自动处理 UTF-8 编码</li>
          <li>• 实时错误检测和提示</li>
          <li>• 一键复制结果</li>
          <li>• 支持输入输出交换</li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">常见用途</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 在 URL 中传递二进制数据</li>
          <li>• 在 JSON 中嵌入图片数据</li>
          <li>• 在邮件中传输附件</li>
          <li>• 在 HTML 中嵌入小图片</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Base64 编码工具"
      description="Base64 编码和解码工具，支持中文字符"
      icon={Lock}
      actions={<ToolActions actions={actions} />}
      helpContent={helpContent}
    >
      <DualTextarea
        inputTitle="输入文本"
        outputTitle="输出结果"
        inputPlaceholder="在此输入要编码/解码的文本..."
        outputPlaceholder="编码/解码结果将显示在这里..."
        inputValue={input}
        outputValue={output}
        onInputChange={setInput}
        error={error}
      />
    </ToolLayout>
  );
}