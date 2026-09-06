import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ArrowLeft, ExternalLink } from 'lucide-react';
import { Clip } from '../types';
import { UniversalVideoPlayer } from './UniversalVideoPlayer';

interface ClipModalPlayerProps {
  clip: Clip | null;
  onClose: () => void;
  onGoToEpisode: (episodeId: string) => void;
}

export const ClipModalPlayer: React.FC<ClipModalPlayerProps> = ({
  clip,
  onClose,
  onGoToEpisode,
}) => {
  useEffect(() => {
    if (clip) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [clip]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (clip) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clip, onClose]);

  if (!clip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* 9:16 Vertical Reel Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className="relative w-full max-w-[380px] aspect-9/16 rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/20 z-10 text-right flex flex-col justify-between"
      >
        {/* Universal Video Player for 9:16 */}
        <div className="absolute inset-0 w-full h-full">
          <UniversalVideoPlayer
            videoUrl={clip.videoUrl}
            poster={clip.thumbnail}
            title={clip.title}
            autoPlay={true}
            aspectRatio="9/16"
            className="w-full h-full rounded-none"
          />
        </div>

        {/* Top bar controls */}
        <div className="relative z-20 p-4 flex items-center justify-between text-white pointer-events-auto">
          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-white border border-white/15">
            {clip.highlightCategory}
          </span>
          <div className="flex items-center gap-2">
            <a
              href={clip.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black text-white transition-colors"
              title="مشاهده مستقیم کلیپ"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black text-white transition-colors"
              title="بستن"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Details & CTA */}
        <div className="relative z-20 p-5 text-white flex flex-col gap-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-auto">
          <div>
            <span className="text-xs text-[#E2D8BE] font-bold block mb-1">
              {clip.guest} • {clip.guestRole}
            </span>
            <h3 className="text-sm sm:text-base font-bold leading-snug">
              {clip.title}
            </h3>
          </div>

          <button
            onClick={() => {
              onGoToEpisode(clip.episodeId);
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-[#12281D] hover:bg-[#FAF9F5] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
          >
            <span>تماشای کامل این قسمت در برنامه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
