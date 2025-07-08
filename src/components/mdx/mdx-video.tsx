"use client";

import React from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MDXVideoProps {
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  width?: number | string;
  height?: number | string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
}

export const MDXVideo = ({
  src,
  title,
  poster,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  className,
  width = "100%",
  height = "auto",
  onPlay,
  onPause,
  onEnded,
  onError,
}: MDXVideoProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(muted);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        onPlay?.();
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg bg-black", className)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        width={width}
        height={height}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        className="h-full w-full"
        onEnded={onEnded}
        onError={onError}
      />

      {controls && (
        <div className="absolute right-0 bottom-0 left-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-4 py-2">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="rounded-full p-1 hover:bg-white/20"
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="rounded-full p-1 hover:bg-white/20"
              aria-label={isMuted ? "取消静音" : "静音"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-white" />
              ) : (
                <Volume2 className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
          <button
            onClick={toggleFullscreen}
            className="rounded-full p-1 hover:bg-white/20"
            aria-label={isFullscreen ? "退出全屏" : "全屏"}
          >
            <Maximize2 className="h-5 w-5 text-white" />
          </button>
        </div>
      )}

      {title && (
        <div className="absolute top-0 right-0 left-0 bg-gradient-to-b from-black/60 to-transparent px-4 py-2">
          <h3 className="text-sm font-medium text-white">{title}</h3>
        </div>
      )}
    </div>
  );
};
