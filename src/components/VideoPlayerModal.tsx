import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Check,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { Episode } from '../types';
import { UniversalVideoPlayer } from './UniversalVideoPlayer';
import { parseVideoUrl } from '../utils/videoUtils';

interface VideoPlayerModalProps {
  episode: Episode | null;
  onClose: () => void;
  onGoToEpisodeDetail: (id: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  episode,
  onClose,
  onGoToEpisodeDetail,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (episode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [episode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (episode) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [episode, onClose]);

  if (!episode) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const videoInfo = parseVideoUrl(episode.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-5xl bg-[#171E1A] rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 text-right flex flex-col max-h-[90vh]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-[#12281D]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-md bg-[#3FA36A] text-white text-xs font-bold">
              قسمت {episode.number}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
              {episode.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={episode.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-stone-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              title="مشاهده مستقیم ویدیو"
            >
              <span>{videoInfo.type === 'aparat' ? 'آپارات' : videoInfo.type === 'youtube' ? 'یوتیوب' : 'لینک اصلی'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              title="کپی لینک قسمت"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              title="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="w-full bg-black flex items-center justify-center overflow-hidden">
          <UniversalVideoPlayer
            videoUrl={episode.videoUrl}
            poster={episode.thumbnail}
            title={episode.title}
            autoPlay={true}
            aspectRatio="16/9"
          />
        </div>

        {/* Modal Footer Info */}
        <div className="p-4 sm:p-6 bg-[#12281D] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={episode.guestAvatar}
              alt={episode.guest}
              className="w-11 h-11 rounded-full object-cover border border-white/20"
            />
            <div>
              <h4 className="font-bold text-sm sm:text-base text-white">
                {episode.guest}
              </h4>
              <p className="text-xs text-stone-300">
                {episode.guestRole}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onGoToEpisodeDetail(episode.id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors self-end sm:self-auto"
          >
            <span>مشاهده صفحه کامل قسمت و یادداشت‌ها</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
