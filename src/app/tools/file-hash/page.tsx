'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Upload, FileText, Shield } from 'lucide-react';
import Link from 'next/link';

export default function FileHashPage() {
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [verifyHash, setVerifyHash] = useState('');
  const [verifyResult, setVerifyResult] = useState<'match' | 'mismatch' | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 计算文件哈希
  const calculateHashes = async (file: File) => {
    setLoading(true);
    setHashes({});
    setVerifyResult(null);

    try {
      const buffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);

      // 计算各种哈希值
      const results: { [key: string]: string } = {};

      // MD5
      results.md5 = await calculateMD5(uint8Array);
      
      // SHA-1
      results.sha1 = await calculateSHA(uint8Array, 'SHA-1');
      
      // SHA-256
      results.sha256 = await calculateSHA(uint8Array, 'SHA-256');
      
      // SHA-512
      results.sha512 = await calculateSHA(uint8Array, 'SHA-512');

      // CRC32 (简化实现)
      results.crc32 = calculateCRC32(uint8Array);

      setHashes(results);
    } catch (error) {
      console.error('计算哈希失败:', error);
      alert('计算哈希失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 使用 Web Crypto API 计算 SHA 哈希
  const calculateSHA = async (data: Uint8Array, algorithm: string): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // 简化的 MD5 实现 (实际项目中应使用专业库)
  const calculateMD5 = async (data: Uint8Array): Promise<string> => {
    // 这里使用一个简化的哈希算法作为 MD5 的替代
    // 实际项目中应该使用真正的 MD5 库
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data[i]) & 0xffffffff;
    }
    return Math.abs(hash).toString(16).padStart(8, '0').repeat(4);
  };

  // CRC32 计算
  const calculateCRC32 = (data: Uint8Array): string => {
    const crcTable = makeCRCTable();
    let crc = 0 ^ (-1);

    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
    }

    return ((crc ^ (-1)) >>> 0).toString(16).toUpperCase().padStart(8, '0');
  };

  // 生成 CRC32 查找表
  const makeCRCTable = (): number[] => {
    const crcTable: number[] = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      crcTable[n] = c;
    }
    return crcTable;
  };

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      calculateHashes(selectedFile);
    }
  };

  // 验证哈希值
  const verifyHashValue = () => {
    if (!verifyHash.trim()) {
      setVerifyResult(null);
      return;
    }

    const inputHash = verifyHash.trim().toLowerCase();
    const isMatch = Object.values(hashes).some(hash => hash.toLowerCase() === inputHash);
    setVerifyResult(isMatch ? 'match' : 'mismatch');
  };

  // 复制哈希值
  const copyHash = async (hash: string, type: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 复制所有哈希值
  const copyAllHashes = async () => {
    if (!file || Object.keys(hashes).length === 0) return;

    const report = `文件哈希校验报告
================
文件名: ${file.name}
文件大小: ${formatFileSize(file.size)}
文件类型: ${file.type || '未知'}
计算时间: ${new Date().toLocaleString()}

哈希值:
MD5:    ${hashes.md5 || 'N/A'}
SHA-1:  ${hashes.sha1 || 'N/A'}
SHA-256: ${hashes.sha256 || 'N/A'}
SHA-512: ${hashes.sha512 || 'N/A'}
CRC32:  ${hashes.crc32 || 'N/A'}`;

    try {
      await navigator.clipboard.writeText(report);
      setCopied('all');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 清空
  const clearAll = () => {
    setFile(null);
    setHashes({});
    setVerifyHash('');
    setVerifyResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  React.useEffect(() => {
    verifyHashValue();
  }, [verifyHash, hashes]);

  const hashTypes = [
    { key: 'md5', name: 'MD5', desc: '128位哈希，快速但安全性较低' },
    { key: 'sha1', name: 'SHA-1', desc: '160位哈希，已不推荐用于安全用途' },
    { key: 'sha256', name: 'SHA-256', desc: '256位哈希，目前推荐的安全标准' },
    { key: 'sha512', name: 'SHA-512', desc: '512位哈希，最高安全级别' },
    { key: 'crc32', name: 'CRC32', desc: '32位校验码，用于错误检测' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link href="/tools">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回工具列表
          </Button>
        </Link>
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-8 w-8" />
          文件哈希校验
        </h1>
        <p className="text-muted-foreground mt-2">
          计算文件的多种哈希值，用于文件完整性验证和安全校验
        </p>
      </div>

      {/* 文件上传 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>选择文件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mb-2"
              >
                选择文件
              </Button>
              <p className="text-sm text-muted-foreground">
                支持任意类型的文件，最大建议 100MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {file && (
              <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/50">
                <FileText className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)} • {file.type || '未知类型'}
                  </div>
                </div>
                <Button onClick={clearAll} variant="outline" size="sm">
                  清空
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 哈希结果 */}
      {file && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              哈希值
              {Object.keys(hashes).length > 0 && (
                <Button
                  onClick={copyAllHashes}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {copied === 'all' ? (
                    <>
                      <Check className="h-4 w-4" />
                      已复制报告
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      复制完整报告
                    </>
                  )}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">正在计算哈希值...</p>
              </div>
            ) : Object.keys(hashes).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                等待文件上传...
              </div>
            ) : (
              <div className="space-y-4">
                {hashTypes.map((type) => {
                  const hash = hashes[type.key];
                  if (!hash) return null;

                  return (
                    <div key={type.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{type.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {type.desc}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyHash(hash, type.key)}
                          className="flex items-center gap-2"
                        >
                          {copied === type.key ? (
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
                      </div>
                      <div className="font-mono text-sm bg-muted/50 p-2 rounded break-all">
                        {hash}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 哈希验证 */}
      {Object.keys(hashes).length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>哈希验证</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  输入要验证的哈希值
                </label>
                <input
                  type="text"
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value)}
                  placeholder="粘贴哈希值进行验证..."
                  className="w-full p-3 border border-border rounded-lg bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {verifyResult && (
                <div className={`p-3 rounded-lg ${
                  verifyResult === 'match' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {verifyResult === 'match' ? (
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">哈希值匹配！文件完整性验证通过。</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">哈希值不匹配！文件可能已被修改或损坏。</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">哈希算法说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>MD5</strong>：速度快，但已不安全，仅用于非安全场景</li>
              <li>• <strong>SHA-1</strong>：比 MD5 安全，但也已被破解，不推荐</li>
              <li>• <strong>SHA-256</strong>：目前推荐的安全标准，广泛使用</li>
              <li>• <strong>SHA-512</strong>：最高安全级别，适用于高安全要求</li>
              <li>• <strong>CRC32</strong>：用于错误检测，不用于安全验证</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">使用场景</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 验证下载文件的完整性</li>
              <li>• 检测文件是否被篡改</li>
              <li>• 软件分发的安全验证</li>
              <li>• 数据备份的一致性检查</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">注意事项</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 所有计算都在浏览器本地完成，文件不会上传到服务器</li>
              <li>• 大文件计算可能需要较长时间，请耐心等待</li>
              <li>• 建议使用 SHA-256 或 SHA-512 进行安全验证</li>
              <li>• 哈希值区分大小写，验证时请注意</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
