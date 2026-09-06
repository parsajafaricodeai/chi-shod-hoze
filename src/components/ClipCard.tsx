import React from 'react';
import { motion } from 'motion/react';
import { Play, Eye, Clock } from 'lucide-react';
import { Clip } from '../types';

interface ClipCardProps {
  clip: Clip;
  onPlay: (clip: Clip) => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({ clip, onPlay }) => {
  return (
    <motion.div
      id={`clip-card-${clip.id}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={() => onPlay(clip)}
      className="group relative flex-none w-[230px] sm:w-[260px] aspect-9/16 rounded-3xl overflow-hidden bg-stone-900 border border-[#1B3B2B]/15 shadow-md hover:shadow-2xl transition-all cursor-pointer select-none"
    >
      {/* 9:16 Background Image */}
      <img
        src={clip.thumbnail}
        alt={clip.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        loading="lazy"
      />

      {/* Cinematic Gradient Tint */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 group-hover:opacity-90 transition-opacity" />

      {/* Category Pill */}
      <div className="absolute top-3.5 right-3.5 flex items-center justify-between left-3.5">
        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-[#E2D8BE]">
          {clip.highlightCategory}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-medium flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-[#C5A869]" />
          {clip.duration}
        </span>
      </div>

      {/* Floating Center Play Action */}
      <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 text-[#1B3B2B] flex items-center justify-center shadow-lg group-hover:scale-115 group-hover:bg-white transition-transform duration-300">
        <Play className="w-4 h-4 fill-current ml-0.5 text-[#1B3B2B]" />
      </div>

      {/* Bottom Clip Information */}
      <div className="absolute bottom-4 right-4 left-4 text-right">
        <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug drop-shadow-sm mb-1.5 group-hover:text-[#D4E8DC] transition-colors">
          {clip.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-stone-300 pt-2 border-t border-white/15">
          <span className="font-medium text-stone-200 line-clamp-1">{clip.guest}</span>
          <span className="text-[11px] text-[#C5A869] font-bold flex items-center gap-1 shrink-0">
            <Eye className="w-3 h-3" />
            {clip.views}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
