'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/cards/card';
import { Copy, Check } from 'lucide-react';

interface DualTextareaProps {
  inputTitle: string;
  outputTitle: string;
  inputPlaceholder: string;
  outputPlaceholder: string;
  inputValue: string;
  outputValue: string;
  onInputChange: (value: string) => void;
  error?: string;
  height?: string;
  readOnlyOutput?: boolean;
}

export function DualTextarea({
  inputTitle,
  outputTitle,
  inputPlaceholder,
  outputPlaceholder,
  inputValue,
  outputValue,
  onInputChange,
  error,
  height = 'h-96',
  readOnlyOutput = true,
}: DualTextareaProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 输入区域 */}
      <Card>
        <CardHeader>
          <CardTitle>{inputTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={inputValue}
            onChange={e => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            className={`w-full ${height} p-3 border border-border rounded-lg bg-background font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-2 rounded">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 输出区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {outputTitle}
            {outputValue && (
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    复制
                  </>
                )}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={outputValue}
            readOnly={readOnlyOutput}
            placeholder={outputPlaceholder}
            className={`w-full ${height} p-3 border border-border rounded-lg ${
              readOnlyOutput ? 'bg-muted/50' : 'bg-background'
            } font-mono text-sm resize-none ${
              !readOnlyOutput
                ? 'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                : ''
            }`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
