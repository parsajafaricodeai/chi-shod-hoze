import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Clock, Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Episode } from '../types';

interface FeaturedEpisodeProps {
  episode: Episode;
  onPlay: (episode: Episode) => void;
  onSelect: (episodeId: string) => void;
}

export const FeaturedEpisode: React.FC<FeaturedEpisodeProps> = ({
  episode,
  onPlay,
  onSelect,
}) => {
  if (!episode) return null;

  const thumbnailSrc =
    episode.thumbnail ||
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80';

  return (
    <section id="featured-episode-section" className="py-16 sm:py-24 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 text-right">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A869]/15 text-[#886F35] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>قسمت ویژه و برگزیده</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#12281D]">
              پیشنهاد تماشای سردبیر
            </h2>
          </div>
          <button
            onClick={() => onSelect(episode.id)}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#1B3B2B] hover:text-[#2E7D52] transition-colors"
          >
            <span>مشاهده صفحه کامل</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Big Card Container */}
        <div className="relative bg-white rounded-3xl border border-[#1B3B2B]/10 overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12">
          {/* Visual Player Preview (6 cols) */}
          <div className="relative lg:col-span-7 bg-stone-900 aspect-16/10 lg:aspect-auto min-h-[300px] sm:min-h-[380px] overflow-hidden group">
            <img
              src={thumbnailSrc}
              alt={episode.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

            {/* Top Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#3FA36A] text-white text-xs font-extrabold tracking-wide shadow-md">
                قسمت جدید
              </span>
              <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                قسمت {episode.number}
              </span>
            </div>

            {/* Giant Centered Play Trigger */}
            <button
              onClick={() => onPlay(episode)}
              className="absolute inset-0 m-auto w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#FAF9F5] text-[#1B3B2B] flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-white active:scale-95 transition-all duration-300 z-10 group/btn"
              aria-label="تماشای کامل قسمت"
            >
              <Play className="w-8 h-8 fill-current ml-1 text-[#1B3B2B] group-hover/btn:text-[#2E7D52] transition-colors" />
            </button>

            {/* Bottom on-image duration */}
            <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white/90 text-xs">
              <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5 text-[#C5A869]" />
                مدت زمان: {episode.duration}
              </span>
              <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-md">
                کیفیت Full HD
              </span>
            </div>
          </div>

          {/* Details Column (5 cols) */}
          <div className="p-6 sm:p-8 lg:p-10 lg:col-span-5 flex flex-col justify-between text-right bg-[#FFFFFF]">
            <div>
              {/* Guest Profile Strip */}
              <div className="flex items-center gap-3.5 mb-5 pb-5 border-b border-stone-100">
                <img
                  src={episode.guestAvatar}
                  alt={episode.guest}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-[#1B3B2B]/10 shadow-xs"
                />
                <div>
                  <h4 className="font-extrabold text-base sm:text-lg text-[#12281D]">
                    {episode.guest}
                  </h4>
                  <p className="text-xs text-[#525E56] mt-0.5">
                    {episode.guestRole}
                  </p>
                </div>
              </div>

              {/* Title & Show Name */}
              <div className="mb-4">
                <span className="text-xs font-bold text-[#886F35] block mb-1">
                  مجموعه گفتگوهای مستند چی شد حوزه؟
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#12281D] leading-snug">
                  {episode.title}
                </h3>
              </div>

              {/* Synopsis */}
              <p className="text-sm text-[#4A554E] leading-relaxed mb-6">
                {episode.description}
              </p>

              {/* Featured Quote Preview */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border-r-3 border-[#1B3B2B] text-xs text-[#2A5A43] font-medium leading-relaxed mb-6 italic">
                {episode.quote}
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {episode.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#1B3B2B]/5 text-[#1B3B2B] font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
              <button
                onClick={() => onPlay(episode)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-[#1B3B2B] hover:bg-[#234F3A] active:scale-98 transition-all shadow-md"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>تماشای کامل قسمت</span>
              </button>
              <button
                onClick={() => onSelect(episode.id)}
                className="px-4 py-3.5 rounded-xl text-sm font-semibold text-[#12281D] bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                جزئیات و نکات
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
