
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type ConversionType = 'encode' | 'decode' | 'hash';

interface ConversionResult {
  input: string;
  output: string;
  type: ConversionType;
  method: string;
  timestamp: number;
}

interface ConversionOptions {
  method: string;
  type: ConversionType;
}

export default function StringConverterPage() {
  const [input, setInput] = useState<string>("");
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [options, setOptions] = useState<ConversionOptions>({
    method: "base64",
    type: "encode"
  });

  const convertString = async (input: string, options: ConversionOptions): Promise<string> => {
    switch (options.method) {
      case "base64": {
        if (options.type === "encode") {
          return btoa(input);
        } else {
          return atob(input);
        }
      }
      case "url": {
        if (options.type === "encode") {
          return encodeURIComponent(input);
        } else {
          return decodeURIComponent(input);
        }
      }
      case "hex": {
        if (options.type === "encode") {
          return Array.from(input)
            .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');
        } else {
          return input
            .match(/.{1,2}/g)
            ?.map(byte => String.fromCharCode(parseInt(byte, 16)))
            .join('') || '';
        }
      }
      case "md5": {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
      default: {
        return input;
      }
    }
  };

  const validateInput = (input: string, options: ConversionOptions): boolean => {
    if (!input) return false;

    if (options.type === "decode") {
      switch (options.method) {
        case "base64": {
          try {
            atob(input);
            return true;
          } catch {
            return false;
          }
        }
        case "hex": {
          return /^[0-9A-Fa-f]+$/.test(input) && input.length % 2 === 0;
        }
        default: {
          return true;
        }
      }
    }

    return true;
  };

  const handleConvert = async () => {
    if (!validateInput(input, options)) {
      alert("Invalid input for selected conversion method");
      return;
    }

    try {
      const output = await convertString(input, options);
      const result: ConversionResult = {
        input,
        output,
        type: options.type,
        method: options.method,
        timestamp: Date.now()
      };
      setResults([result, ...results]);
    } catch (error) {
      alert("Conversion failed: " + error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card className="p-4">
        <h2 className="text-2xl font-bold mb-4">字符串转换器</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>转换方法</Label>
              <Select
                value={options.method}
                onValueChange={(value) => setOptions({...options, method: value})}
              >
                <option value="base64">Base64</option>
                <option value="url">URL</option>
                <option value="hex">Hex</option>
                <option value="md5">MD5</option>
              </Select>
            </div>

            <div>
              <Label>操作类型</Label>
              <Select
                value={options.type}
                onValueChange={(value) => 
                  setOptions({...options, type: value as ConversionType})}
              >
                <option value="encode">编码</option>
                <option value="decode">解码</option>
                {options.method === "md5" && <option value="hash">哈希</option>}
              </Select>
            </div>
          </div>

          <div>
            <Label>输入文本</Label>
            <Textarea
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                setInput(e.target.value)}
              placeholder="请输入要转换的文本..."
              rows={4}
            />
          </div>

          <Button 
            onClick={handleConvert}
            className="w-full"
            disabled={!input}
          >
            转换
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-xl font-bold mb-4">转换历史</h3>
        <div className="space-y-2">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-2 border rounded space-y-2"
            >
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{result.method.toUpperCase()} {result.type}</span>
                <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="font-mono break-all">
                <div>输入: {result.input}</div>
                <div>输出: {result.output}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}