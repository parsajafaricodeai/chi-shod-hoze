import React from 'react';
import { motion } from 'motion/react';
import { Play, Clock, Eye, Sparkles } from 'lucide-react';
import { Episode } from '../types';

interface EpisodeCardProps {
  episode: Episode;
  onPlay: (episode: Episode) => void;
  onSelect: (episodeId: string) => void;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, onPlay, onSelect }) => {
  if (!episode) return null;

  const thumbnailSrc =
    episode.thumbnail ||
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.article
      id={`episode-card-${episode.id}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#1B3B2B]/10 shadow-xs hover:shadow-xl transition-all duration-300"
    >
      {/* Thumbnail Container with Play Overlay */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-stone-900">
        <img
          src={thumbnailSrc}
          alt={episode.title || ''}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Cinematic Gradient Tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-md bg-[#1B3B2B]/90 backdrop-blur-md text-white text-xs font-bold shadow-xs">
            قسمت {episode.number}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white/90 text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#C5A869]" />
            {episode.duration}
          </span>
        </div>

        {/* Center Play Button Overlay */}
        <button
          onClick={() => onPlay(episode)}
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#FAF9F5]/95 text-[#1B3B2B] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white transition-all duration-300 z-10"
          aria-label={`پخش قسمت ${episode.number}`}
        >
          <Play className="w-5 h-5 fill-current ml-0.5 text-[#1B3B2B]" />
        </button>

        {/* Guest Thumbnail Stamp */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <img
            src={episode.guestAvatar}
            alt={episode.guest}
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
          />
          <div className="text-right">
            <p className="text-xs font-bold text-white leading-tight drop-shadow-xs">
              {episode.guest}
            </p>
            <p className="text-[10px] text-stone-300 leading-tight">
              {episode.guestRole}
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 text-right">
        {/* Title */}
        <h3
          onClick={() => onSelect(episode.id)}
          className="text-base sm:text-lg font-bold text-[#12281D] group-hover:text-[#1B3B2B] transition-colors line-clamp-2 cursor-pointer mb-2"
        >
          {episode.title}
        </h3>

        {/* Synopsis */}
        <p className="text-xs text-[#525E56] line-clamp-2 leading-relaxed mb-4 flex-1">
          {episode.description}
        </p>

        {/* Topics Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {episode.topics.slice(0, 2).map((topic, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#1B3B2B]/5 text-[#2A5A43] font-medium"
            >
              #{topic}
            </span>
          ))}
          {episode.topics.length > 2 && (
            <span className="text-[10px] px-1.5 py-0.5 text-stone-400 font-medium">
              +{episode.topics.length - 2}
            </span>
          )}
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-[#717E76]">
          <span className="flex items-center gap-1 font-medium">
            <Eye className="w-3.5 h-3.5" />
            {episode.viewsCount.toLocaleString('fa-IR')} بازدید
          </span>
          <button
            onClick={() => onSelect(episode.id)}
            className="font-bold text-[#1B3B2B] hover:text-[#2E7D52] transition-colors inline-flex items-center gap-1"
          >
            مشاهده جزئیات
            <span className="text-sm">←</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
};
