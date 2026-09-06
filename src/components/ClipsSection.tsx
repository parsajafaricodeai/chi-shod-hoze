import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Flame, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { Clip } from '../types';
import { ClipCard } from './ClipCard';

interface ClipsSectionProps {
  clips: Clip[];
  onPlayClip: (clip: Clip) => void;
  onViewAllClips: () => void;
}

export const ClipsSection: React.FC<ClipsSectionProps> = ({
  clips,
  onPlayClip,
  onViewAllClips,
}) => {
  if (!clips || clips.length === 0) return null;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      // Note: In RTL browsers, scrollLeft can be negative or inverted depending on browser implementation
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="clips-section" className="py-20 sm:py-28 bg-[#FAF9F5] border-b border-[#1B3B2B]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs font-semibold mb-3">
              <Flame className="w-3.5 h-3.5 text-[#3FA36A]" />
              <span>ویدیوهای کوتاه و برش‌های طلایی</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#12281D] tracking-tight mb-2">
              از دل گفتگوها
            </h2>
            <p className="text-base text-[#525E56] font-normal">
              بعضی جواب‌ها را باید کوتاه شنید.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll Navigation Controls */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-xl bg-white border border-stone-200 text-[#12281D] hover:bg-stone-100 transition-colors shadow-2xs"
                title="قبلی"
                aria-label="کلیپ قبلی"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-xl bg-white border border-stone-200 text-[#12281D] hover:bg-stone-100 transition-colors shadow-2xs"
                title="بعدی"
                aria-label="کلیپ بعدی"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onViewAllClips}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1B3B2B] hover:text-[#2E7D52] transition-colors"
            >
              <span>مشاهده آرشیو کلیپ‌ها</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 px-1 no-scrollbar scroll-smooth"
        >
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} onPlay={onPlayClip} />
          ))}
        </div>
      </div>
    </section>
  );
};
