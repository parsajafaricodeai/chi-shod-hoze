import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { parseVideoUrl } from '../utils/videoUtils';

interface UniversalVideoPlayerProps {
  videoUrl: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  aspectRatio?: '16/9' | '9/16' | 'video';
  className?: string;
}

export const UniversalVideoPlayer: React.FC<UniversalVideoPlayerProps> = ({
  videoUrl,
  poster,
  title,
  autoPlay = true,
  aspectRatio = '16/9',
  className = '',
}) => {
  const videoInfo = parseVideoUrl(videoUrl);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset states on videoUrl change
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setIsPlaying(autoPlay);
  }, [videoUrl, autoPlay]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay with sound might fail; retry muted
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const aspectClass =
    aspectRatio === '9/16' ? 'aspect-9/16' : 'aspect-16/9';

  // 1. IFRAME EMBED (Aparat or YouTube)
  if (videoInfo.isEmbeddable) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full ${aspectClass} bg-black overflow-hidden rounded-2xl flex flex-col items-center justify-center group ${className}`}
      >
        <iframe
          src={videoInfo.embedUrl}
          title={title || 'پخش ویدیو'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0 z-10"
        />

        {/* Quick fallback bar on hover at the top corner */}
        <div className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          <a
            href={videoInfo.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1 shadow-md transition-transform active:scale-95"
          >
            <span>مشاهده در {videoInfo.type === 'aparat' ? 'آپارات' : 'یوتیوب'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // 2. DIRECT HTML5 VIDEO (.mp4, .webm, sample urls)
  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectClass} bg-black overflow-hidden rounded-2xl flex items-center justify-center group select-none ${className}`}
    >
      {!hasError ? (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            poster={poster}
            playsInline
            autoPlay={autoPlay}
            onTimeUpdate={() => {
              if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
            }}
            onLoadedMetadata={() => {
              setIsLoading(false);
              if (videoRef.current) setDuration(videoRef.current.duration);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
          />

          {/* Large Center Play Overlay when paused */}
          {!isPlaying && !isLoading && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1B3B2B]/90 hover:bg-[#234F3A] backdrop-blur-md text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20 group/play"
              title="پخش ویدیو"
            >
              <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1 text-white" />
            </button>
          )}

          {/* Controls Bar on hover or pause */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-2 z-20 opacity-90 group-hover:opacity-100 transition-opacity">
            {/* Range seeker */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#3FA36A]"
            />

            <div className="flex items-center justify-between text-white text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1 text-white hover:text-[#3FA36A] transition-colors"
                  title={isPlaying ? 'توقف' : 'پخش'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-1 text-white hover:text-[#3FA36A] transition-colors"
                  title={isMuted ? 'صدادار' : 'بی‌صدا'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <span className="text-stone-300 text-xs font-mono">
                  {formatTime(currentTime)} / {formatTime(duration || 2700)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] font-medium transition-colors"
                  title="باز کردن لینک اصلی"
                >
                  پیوند مستقیم
                </a>
                <button
                  onClick={toggleFullscreen}
                  className="p-1 text-white hover:text-[#3FA36A] transition-colors"
                  title="تمام صفحه"
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Graceful Fallback Card when video URL cannot be decoded by HTML5 directly */
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-[#12281D]">
          {poster && (
            <img
              src={poster}
              alt="پوستر ویدیو"
              className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xs"
            />
          )}
          <div className="relative z-10 max-w-md flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 text-[#C5A869]">
              <Play className="w-7 h-7 fill-current ml-0.5" />
            </div>
            <h4 className="text-base sm:text-lg font-bold mb-2">
              پخش آنلاین ویدیو
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
              این ویدیو از طریق پیوند اختصاصی در بستر آپارات یا رسانه اصلی قابل مشاهده و دریافت است.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3FA36A] hover:bg-[#328555] text-white text-xs sm:text-sm font-bold shadow-lg transition-transform active:scale-95"
              >
                <span>مشاهده مستقیم در پنجره جدید</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تلاش مجدد</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
