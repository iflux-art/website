"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Copy,
  Check,
  Dices,
  Hash,
  QrCode,
  Key,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function RandomGeneratorPage() {
  const [activeTab, setActiveTab] = useState<
    "random" | "uuid" | "qrcode" | "hash" | "password"
  >("random");
  const [copied, setCopied] = useState<string | null>(null);

  // 随机生成器状态
  const [results, setResults] = useState<string[]>([]);
  const [numberMin, setNumberMin] = useState(1);
  const [numberMax, setNumberMax] = useState(100);
  const [numberCount, setNumberCount] = useState(1);

  // UUID生成器状态
  const [uuidVersion, setUuidVersion] = useState<"v1" | "v4">("v4");
  const [uuidCount, setUuidCount] = useState(1);
  const [uuidResults, setUuidResults] = useState<string[]>([]);

  // 二维码生成器状态
  const [qrText, setQrText] = useState("");
  const [qrSize, setQrSize] = useState(200);
  const [qrResult, setQrResult] = useState("");

  // 哈希生成器状态
  const [hashText, setHashText] = useState("");
  const [hashAlgorithm, setHashAlgorithm] = useState<
    "SHA1" | "SHA256" | "SHA512"
  >("SHA256");
  const [hashResult, setHashResult] = useState("");

  // 密码生成器状态
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  // 生成随机数字
  const generateNumbers = () => {
    const numbers: number[] = [];
    for (let i = 0; i < numberCount; i++) {
      const num =
        Math.floor(Math.random() * (numberMax - numberMin + 1)) + numberMin;
      numbers.push(num);
    }
    setResults(numbers.map((n) => n.toString()));
  };

  // UUID生成器
  const generateUUID = () => {
    const uuids: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      let uuid: string;
      if (uuidVersion === "v4") {
        uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          },
        );
      } else {
        const timestamp = Date.now().toString(16);
        const random = Math.random().toString(16).substring(2, 8);
        uuid = `${timestamp.substring(0, 8)}-${timestamp.substring(8, 12)}-1${timestamp.substring(
          12,
          15,
        )}-${random.substring(0, 4)}-${random.substring(4, 16)}`;
      }
      uuids.push(uuid);
    }
    setUuidResults(uuids);
  };

  // 二维码生成器
  const generateQRCode = () => {
    if (!qrText.trim()) {
      alert("请输入要生成二维码的文本");
      return;
    }
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(
      qrText,
    )}`;
    setQrResult(qrUrl);
  };

  // 哈希生成器
  const generateHash = async () => {
    if (!hashText.trim()) {
      alert("请输入要生成哈希的文本");
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(hashText);

      let hashBuffer: ArrayBuffer;
      switch (hashAlgorithm) {
        case "SHA1":
          hashBuffer = await crypto.subtle.digest("SHA-1", data);
          break;
        case "SHA256":
          hashBuffer = await crypto.subtle.digest("SHA-256", data);
          break;
        case "SHA512":
          hashBuffer = await crypto.subtle.digest("SHA-512", data);
          break;
        default:
          hashBuffer = await crypto.subtle.digest("SHA-256", data);
      }

      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setHashResult(hashHex);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setHashResult("生成哈希时出错");
    }
  };

  // 密码生成器
  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (charset === "") {
      alert("请至少选择一种字符类型");
      return;
    }

    let result = "";
    for (let i = 0; i < passwordLength; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <Link href="/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">随机生成器</h1>
            <p className="text-muted-foreground">
              全能随机生成工具，支持随机数、UUID、密码、颜色、名字等多种生成
            </p>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex overflow-x-auto border-b">
            {[
              { key: "random", name: "随机生成", icon: Dices },
              { key: "uuid", name: "UUID生成", icon: Key },
              { key: "qrcode", name: "二维码生成", icon: QrCode },
              { key: "hash", name: "哈希生成", icon: Hash },
              { key: "password", name: "密码生成", icon: Shield },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() =>
                    setActiveTab(
                      tab.key as
                        | "random"
                        | "uuid"
                        | "qrcode"
                        | "hash"
                        | "password",
                    )
                  }
                  className={`flex min-w-[120px] flex-1 items-center justify-center gap-2 border-b-2 p-4 text-center transition-colors ${
                    activeTab === tab.key
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 随机生成器标签页 */}
      {activeTab === "random" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>随机数字生成器</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    最小值
                  </label>
                  <input
                    type="number"
                    value={numberMin}
                    onChange={(e) => setNumberMin(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background p-3"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    最大值
                  </label>
                  <input
                    type="number"
                    value={numberMax}
                    onChange={(e) => setNumberMax(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background p-3"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">数量</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={numberCount}
                    onChange={(e) => setNumberCount(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background p-3"
                  />
                </div>
              </div>

              <Button onClick={generateNumbers} className="w-full">
                生成随机数字
              </Button>

              {results.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium">
                      生成结果
                    </label>
                    <Button
                      onClick={() => copyToClipboard(results.join(", "))}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {copied === results.join(", ") ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      复制
                    </Button>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 font-mono text-sm">
                    {results.join(", ")}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* UUID生成器标签页 */}
      {activeTab === "uuid" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>UUID生成器</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    UUID版本
                  </label>
                  <select
                    value={uuidVersion}
                    onChange={(e) =>
                      setUuidVersion(e.target.value as "v1" | "v4")
                    }
                    className="w-full rounded-lg border border-border bg-background p-3"
                  >
                    <option value="v4">UUID v4 (随机)</option>
                    <option value="v1">UUID v1 (时间戳)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    生成数量
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={uuidCount}
                    onChange={(e) => setUuidCount(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background p-3"
                  />
                </div>
              </div>

              <Button onClick={generateUUID} className="w-full">
                生成UUID
              </Button>

              {uuidResults.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium">
                      生成结果
                    </label>
                    <Button
                      onClick={() => copyToClipboard(uuidResults.join("\n"))}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {copied === uuidResults.join("\n") ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      复制全部
                    </Button>
                  </div>
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {uuidResults.map((uuid, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                      >
                        <span className="flex-1 font-mono text-sm">{uuid}</span>
                        <Button
                          onClick={() => copyToClipboard(uuid)}
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                        >
                          {copied === uuid ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 二维码生成器标签页 */}
      {activeTab === "qrcode" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>二维码生成器</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  输入文本或URL
                </label>
                <textarea
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  placeholder="输入要生成二维码的文本或URL..."
                  className="h-32 w-full resize-none rounded-lg border border-border bg-background p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  二维码尺寸
                </label>
                <select
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background p-3"
                >
                  <option value={150}>150x150</option>
                  <option value={200}>200x200</option>
                  <option value={300}>300x300</option>
                  <option value={400}>400x400</option>
                </select>
              </div>

              <Button onClick={generateQRCode} className="w-full">
                生成二维码
              </Button>

              {qrResult && (
                <div className="text-center">
                  <div className="mb-4">
                    <img
                      src={qrResult}
                      alt="Generated QR Code"
                      className="mx-auto rounded-lg border"
                    />
                  </div>
                  <Button
                    onClick={() => copyToClipboard(qrResult)}
                    variant="outline"
                    className="mx-auto flex items-center gap-2"
                  >
                    {copied === qrResult ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    复制图片链接
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 哈希生成器标签页 */}
      {activeTab === "hash" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>哈希生成器</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  输入文本
                </label>
                <textarea
                  value={hashText}
                  onChange={(e) => setHashText(e.target.value)}
                  placeholder="输入要生成哈希的文本..."
                  className="h-32 w-full resize-none rounded-lg border border-border bg-background p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  哈希算法
                </label>
                <select
                  value={hashAlgorithm}
                  onChange={(e) =>
                    setHashAlgorithm(
                      e.target.value as "SHA1" | "SHA256" | "SHA512",
                    )
                  }
                  className="w-full rounded-lg border border-border bg-background p-3"
                >
                  <option value="SHA1">SHA-1</option>
                  <option value="SHA256">SHA-256</option>
                  <option value="SHA512">SHA-512</option>
                </select>
              </div>

              <Button onClick={generateHash} className="w-full">
                生成哈希
              </Button>

              {hashResult && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium">
                      哈希结果
                    </label>
                    <Button
                      onClick={() => copyToClipboard(hashResult)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {copied === hashResult ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      复制
                    </Button>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 font-mono text-sm break-all">
                    {hashResult}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 密码生成器标签页 */}
      {activeTab === "password" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>密码生成器</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  密码长度
                </label>
                <input
                  type="number"
                  min="4"
                  max="128"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background p-3"
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">包含字符类型</h4>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">大写字母 (A-Z)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeLowercase}
                      onChange={(e) => setIncludeLowercase(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">小写字母 (a-z)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">数字 (0-9)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">特殊符号</span>
                  </label>
                </div>
              </div>

              <Button onClick={generatePassword} className="w-full">
                生成密码
              </Button>

              {password && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium">
                      生成的密码
                    </label>
                    <Button
                      onClick={() => copyToClipboard(password)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {copied === password ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      复制
                    </Button>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 font-mono text-lg">
                    {password}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
