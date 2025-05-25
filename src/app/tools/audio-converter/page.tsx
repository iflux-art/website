'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Download, Music, Play, Pause, Volume2 } from 'lucide-react';
import Link from 'next/link';

export default function AudioConverterPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'mp3' | 'wav' | 'ogg' | 'aac'>('mp3');
  const [quality, setQuality] = useState(128);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [converting, setConverting] = useState(false);
  const [audioInfo, setAudioInfo] = useState<{
    name: string;
    size: number;
    type: string;
    duration: number;
    bitrate?: number;
  } | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('audio/')) {
      alert('请选择音频文件');
      return;
    }

    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    // 获取音频信息
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      setAudioInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        duration: audio.duration,
        bitrate: Math.round((file.size * 8) / audio.duration / 1000) // 估算比特率
      });
      setDuration(audio.duration);
    });
  };

  // 播放/暂停
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 更新播放进度
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  };

  // 跳转到指定时间
  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  // 调整音量
  const handleVolumeChange = (newVolume: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
      setVolume(newVolume);
    }
  };

  // 模拟音频转换
  const convertAudio = async () => {
    if (!audioFile) return;

    setConverting(true);

    // 模拟转换过程
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 创建模拟的转换文件
    const canvas = document.createElement('canvas');
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // 生成新文件名
        const originalName = audioFile.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const newName = `${nameWithoutExt}_converted.${outputFormat}`;
        
        link.download = newName;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png'); // 这里只是演示，实际需要音频处理库

    setConverting(false);
  };

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    setAudioFile(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioInfo(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formats = [
    { value: 'mp3', name: 'MP3', desc: '最常用的音频格式，兼容性好' },
    { value: 'wav', name: 'WAV', desc: '无损音频格式，文件较大' },
    { value: 'ogg', name: 'OGG', desc: '开源音频格式，压缩率高' },
    { value: 'aac', name: 'AAC', desc: '高质量音频格式，Apple设备友好' },
  ];

  const qualityOptions = [
    { value: 64, name: '64 kbps', desc: '低质量，文件小' },
    { value: 128, name: '128 kbps', desc: '标准质量' },
    { value: 192, name: '192 kbps', desc: '高质量' },
    { value: 320, name: '320 kbps', desc: '最高质量' },
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
          <Music className="h-8 w-8" />
          音频格式转换器
        </h1>
        <p className="text-muted-foreground mt-2">
          在线转换音频格式，支持 MP3、WAV、OGG、AAC 等格式
        </p>
      </div>

      {/* 文件上传 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>选择音频文件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mb-2"
              >
                选择音频文件
              </Button>
              <p className="text-sm text-muted-foreground">
                支持 MP3、WAV、OGG、AAC、FLAC 等格式
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {audioFile && audioInfo && (
              <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/50">
                <Music className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">{audioInfo.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(audioInfo.size)} • {audioInfo.type} • {formatTime(audioInfo.duration)}
                    {audioInfo.bitrate && ` • ${audioInfo.bitrate} kbps`}
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

      {/* 音频播放器 */}
      {audioUrl && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>音频预览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 播放控制 */}
              <div className="flex items-center gap-4">
                <Button
                  onClick={togglePlay}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? '暂停' : '播放'}
                </Button>

                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-20"
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* 进度条 */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* 隐藏的音频元素 */}
              <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 转换设置 */}
      {audioFile && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>转换设置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 输出格式 */}
              <div>
                <label className="block text-sm font-medium mb-2">输出格式</label>
                <div className="space-y-2">
                  {formats.map((format) => (
                    <label key={format.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="format"
                        value={format.value}
                        checked={outputFormat === format.value}
                        onChange={(e) => setOutputFormat(e.target.value as any)}
                        className="rounded"
                      />
                      <div>
                        <span className="font-medium">{format.name}</span>
                        <p className="text-xs text-muted-foreground">{format.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 音质设置 */}
              {outputFormat !== 'wav' && (
                <div>
                  <label className="block text-sm font-medium mb-2">音质设置</label>
                  <div className="space-y-2">
                    {qualityOptions.map((option) => (
                      <label key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="quality"
                          value={option.value}
                          checked={quality === option.value}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="rounded"
                        />
                        <div>
                          <span className="font-medium">{option.name}</span>
                          <p className="text-xs text-muted-foreground">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Button
                onClick={convertAudio}
                disabled={converting}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {converting ? '转换中...' : '开始转换'}
              </Button>
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
            <h4 className="font-medium mb-2">支持的格式</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>输入格式</strong>：MP3、WAV、OGG、AAC、FLAC、M4A 等</li>
              <li>• <strong>输出格式</strong>：MP3、WAV、OGG、AAC</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">格式特点</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>MP3</strong>：最通用的格式，兼容性最好</li>
              <li>• <strong>WAV</strong>：无损格式，音质最好但文件大</li>
              <li>• <strong>OGG</strong>：开源格式，压缩效率高</li>
              <li>• <strong>AAC</strong>：Apple 设备优化，音质好</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">音质说明</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>64 kbps</strong>：适合语音内容</li>
              <li>• <strong>128 kbps</strong>：标准音质，适合大多数用途</li>
              <li>• <strong>192 kbps</strong>：高音质，适合音乐</li>
              <li>• <strong>320 kbps</strong>：最高音质，文件较大</li>
            </ul>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">⚠️ 演示说明</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              这是一个演示工具，实际的音频转换需要专业的音频处理库。当前版本仅展示界面和流程，不会进行真实的格式转换。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
