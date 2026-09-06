import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Play, Clock, Search } from 'lucide-react';
import { useAppData } from '../context/DataContext';
import { Clip } from '../types';
import { ClipCard } from '../components/ClipCard';
import { EmptyState } from '../components/StateViews';

interface ClipsPageProps {
  onPlayClip: (clip: Clip) => void;
}

export const ClipsPage: React.FC<ClipsPageProps> = ({ onPlayClip }) => {
  const { clips } = useAppData();
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tags = ['all', 'تصورات اولیه', 'چالش‌ها', 'نگاه به گذشته', 'حقایق پنهان', 'تجربه زیسته'];

  const filteredClips = clips.filter((clip) => {
    const matchesTag = selectedTag === 'all' || clip.highlightCategory === selectedTag;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      clip.title.toLowerCase().includes(q) ||
      clip.guest.toLowerCase().includes(q);
    return matchesTag && matchesQuery;
  });

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-right max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 text-[#3FA36A]" />
            <span>آرشیو کلیپ‌های کوتاه عمودی</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#12281D] tracking-tight mb-4">
            از دل گفتگوها (برش‌های کوتاه)
          </h1>
          <p className="text-base text-[#4A554E] leading-relaxed">
            برش‌های یک تا دو دقیقه‌ای از تأمل‌برانگیزترین بخش‌های مصاحبه‌ها، مناسب تماشا در گوشی و اشتراک‌گذاری با دوستان.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedTag === t
                    ? 'bg-[#1B3B2B] text-white'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {t === 'all' ? 'همه کلیپ‌ها' : t}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در کلیپ‌ها..."
              className="w-full pr-10 pl-4 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 text-[#12281D] focus:outline-hidden focus:border-[#1B3B2B]"
            />
          </div>
        </div>

        {/* Vertical Reels Grid or Empty State */}
        {filteredClips.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredClips.map((clip) => (
              <div key={clip.id} className="flex justify-center">
                <ClipCard clip={clip} onPlay={onPlayClip} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            message="هنوز کلیپ یا برشی در این بخش ثبت نشده است."
            actionLabel={searchQuery || selectedTag !== 'all' ? 'پاک کردن فیلترها' : undefined}
            onAction={() => {
              setSearchQuery('');
              setSelectedTag('all');
            }}
          />
        )}
      </div>
    </div>
  );
};
