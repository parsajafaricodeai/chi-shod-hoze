import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Film, Play, Clock, ArrowLeft } from 'lucide-react';
import { EPISODES_DATA } from '../data/mockData';
import { Episode, CategoryKey } from '../types';
import { EpisodeCard } from '../components/EpisodeCard';
import { EmptyState } from '../components/StateViews';

interface EpisodesPageProps {
  onPlayEpisode: (episode: Episode) => void;
  onSelectEpisode: (episodeId: string) => void;
}

export const EpisodesPage: React.FC<EpisodesPageProps> = ({
  onPlayEpisode,
  onSelectEpisode,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  const categories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: 'همه قسمت‌ها' },
    { key: 'scholars', label: 'اساتید حوزه' },
    { key: 'managers', label: 'مدیران' },
    { key: 'figures', label: 'شخصیت‌های حوزوی' },
    { key: 'special', label: 'روایت‌های ویژه' },
  ];

  const filtered = EPISODES_DATA.filter((ep) => {
    const matchesCategory =
      activeCategory === 'all' || ep.category === activeCategory;
    const cleanQ = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !cleanQ ||
      ep.title.toLowerCase().includes(cleanQ) ||
      ep.guest.toLowerCase().includes(cleanQ) ||
      ep.description.toLowerCase().includes(cleanQ) ||
      ep.topics.some((t) => t.toLowerCase().includes(cleanQ));
    return matchesCategory && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.viewsCount - a.viewsCount;
    return parseInt(b.number) - parseInt(a.number);
  });

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-right max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs font-semibold mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>آرشیو ویدیویی فصل اول</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#12281D] tracking-tight mb-4">
            تمام قسمت‌های «چی شد حوزه؟»
          </h1>
          <p className="text-base text-[#4A554E] leading-relaxed">
            آرشیو کامل مصاحبه‌های برنامه؛ هر قسمت یک روایت صادقانه و بی‌پرده از نقطه عطف زندگی یکی از اهالی حوزه است.
          </p>
        </div>

        {/* Controls Bar: Search + Category + Sort */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در عنوان یا مهمان..."
              className="w-full pr-10 pl-4 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 text-[#12281D] focus:outline-hidden focus:border-[#1B3B2B]"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-[#1B3B2B] text-white'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs font-medium text-stone-600 shrink-0">
            <span>مرتب‌سازی:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-[#12281D] focus:outline-hidden"
            >
              <option value="latest">جدیدترین قسمت‌ها</option>
              <option value="popular">پربازدیدترین‌ها</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                onPlay={onPlayEpisode}
                onSelect={onSelectEpisode}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            message="هیچ قسمتی با این مشخصات یافت نشد."
            actionLabel="پاک کردن فیلترها"
            onAction={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          />
        )}
      </div>
    </div>
  );
};
