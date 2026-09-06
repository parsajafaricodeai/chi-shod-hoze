import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Film } from 'lucide-react';
import { Episode, CategoryKey } from '../types';
import { EpisodeCard } from './EpisodeCard';

interface EpisodesSectionProps {
  episodes: Episode[];
  onPlay: (episode: Episode) => void;
  onSelect: (episodeId: string) => void;
  onViewAll: () => void;
}

export const EpisodesSection: React.FC<EpisodesSectionProps> = ({
  episodes,
  onPlay,
  onSelect,
  onViewAll,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');

  const categories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: 'همه قسمت‌ها' },
    { key: 'scholars', label: 'اساتید حوزه' },
    { key: 'managers', label: 'مدیران و مسئولان' },
    { key: 'figures', label: 'شخصیت‌های حوزوی' },
    { key: 'special', label: 'روایت‌های ویژه' },
  ];

  const filteredEpisodes =
    activeCategory === 'all'
      ? episodes
      : episodes.filter((ep) => ep.category === activeCategory);

  return (
    <section id="episodes-section" className="py-20 sm:py-28 bg-[#FAF9F5] border-b border-[#1B3B2B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs font-semibold mb-3">
              <Film className="w-3.5 h-3.5" />
              <span>آرشیو کامل گفتگوها</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#12281D] tracking-tight mb-2">
              قسمت‌های برنامه
            </h2>
            <p className="text-base text-[#525E56] font-normal">
              پای حرف کسانی بنشین که این مسیر را زندگی کرده‌اند.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1B3B2B] hover:text-[#2E7D52] transition-colors self-start md:self-auto"
          >
            <span>مشاهده همه در آرشیو</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat.key
                  ? 'bg-[#1B3B2B] text-white shadow-xs'
                  : 'bg-white text-[#4A554E] hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Episodes Grid or Empty State */}
        {filteredEpisodes.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence>
              {filteredEpisodes.map((episode) => (
                <motion.div
                  key={episode.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <EpisodeCard
                    episode={episode}
                    onPlay={onPlay}
                    onSelect={onSelect}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-14 px-6 text-center bg-white rounded-3xl border border-stone-200/80 shadow-2xs max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4 text-[#1B3B2B]">
              <Film className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-[#12281D] mb-2">
              هنوز قسمتی ثبت نشده است
            </h3>
            <p className="text-sm text-[#525E56] leading-relaxed mb-6">
              قسمت‌های برنامه پس از ثبت در پنل مدیریت با پیوند ویدیو، در این بخش نمایش داده می‌شوند.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
