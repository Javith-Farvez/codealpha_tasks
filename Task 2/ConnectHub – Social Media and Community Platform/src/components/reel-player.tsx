'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface ReelPlayerProps {
  videoUrl: string;
  caption: string;
  autoPlay?: boolean;
  onPlayChange?: (isPlaying: boolean) => void;
  isFullscreen?: boolean;
}

export default function ReelPlayer({
  videoUrl,
  caption,
  autoPlay = true,
  onPlayChange,
  isFullscreen = false,
}: ReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoUrl, autoPlay]);

  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.innerHeight > window.innerWidth) {
        setIsLandscape(false);
      } else {
        setIsLandscape(true);
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
      onPlayChange?.(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(
        (videoRef.current.currentTime / videoRef.current.duration) * 100
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  return (
    <div className="relative w-full bg-black rounded-2xl overflow-hidden group">
      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        loop
        muted={isMuted}
        onClick={handlePlayPause}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPause}
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition">
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white fill-white" />
          ) : (
            <Play className="w-8 h-8 text-white fill-white" />
          )}
        </div>
      </button>

      {/* Controls Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
        {/* Progress Bar */}
        <div
          onClick={handleProgressClick}
          className="w-full h-1 bg-white/20 rounded-full cursor-pointer hover:h-2 transition-all"
        >
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMuteToggle}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
          </div>
          <span className="text-xs text-white/60">
            {progress.toFixed(0)}s / {Math.floor(duration)}s
          </span>
        </div>
      </div>

      {/* Caption Overlay */}
      {caption && (
        <div className="absolute bottom-12 left-0 right-0 px-4 pb-4">
          <p className="text-white text-sm font-medium line-clamp-2 drop-shadow-lg">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
