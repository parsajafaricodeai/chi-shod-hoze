import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { useAppData } from '../context/DataContext';

interface QuoteSliderProps {
  onSelectEpisode: (episodeId: string) => void;
}

export const QuoteSlider: React.FC<QuoteSliderProps> = ({ onSelectEpisode }) => {
  const { quotes } = useAppData();
  const [currentIndex, setCurrentIndex] = useState(0);

  const safeQuotes = quotes.length > 0 ? quotes : [];

  const nextQuote = () => {
    if (safeQuotes.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % safeQuotes.length);
  };

  const prevQuote = () => {
    if (safeQuotes.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + safeQuotes.length) % safeQuotes.length);
  };

  useEffect(() => {
    if (safeQuotes.length <= 1) return;
    const timer = setInterval(() => {
      nextQuote();
    }, 7000);
    return () => clearInterval(timer);
  }, [safeQuotes.length]);

  if (safeQuotes.length === 0) return null;

  const current = safeQuotes[currentIndex % safeQuotes.length];

  return (
    <section id="quotes-section" className="py-24 sm:py-32 bg-[#12281D] text-white relative overflow-hidden">
      {/* Background Decorative Quote Watermark */}
      <div className="absolute -top-10 right-10 text-white/5 pointer-events-none">
        <Quote className="w-80 h-80 rotate-180" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Small Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#C5A869] text-xs font-bold mb-8">
          <Quote className="w-3 h-3 fill-current" />
          <span>جملات ماندگار گفتگوها</span>
        </div>

        {/* Animated Quote Content */}
        <div className="min-h-[220px] sm:min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Very Large Headline Typography */}
              <blockquote className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FAF9F5] leading-relaxed tracking-tight max-w-4xl mb-8">
                {current.text}
              </blockquote>

              {/* Guest Attribution */}
              <div className="flex items-center gap-3.5">
                <img
                  src={current.guestImage}
                  alt={current.guestName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#C5A869]/50 shadow-md"
                />
                <div className="text-right">
                  <cite className="not-italic font-extrabold text-base sm:text-lg text-[#E2D8BE] block">
                    {current.guestName}
                  </cite>
                  <span className="text-xs text-stone-300">
                    {current.guestRole} • قسمت {current.episodeNumber}
                  </span>
                </div>

                <button
                  onClick={() => onSelectEpisode(current.episodeId)}
                  className="mr-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-stone-200 transition-colors flex items-center gap-1"
                >
                  <span>شنیدن مصاحبه</span>
                  <ArrowLeft className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Navigation Dots & Controls */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={prevQuote}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="نقل‌قول قبلی"
            aria-label="قبلی"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {safeQuotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === i ? 'w-8 bg-[#C5A869]' : 'w-2 bg-white/25 hover:bg-white/40'
                }`}
                aria-label={`رفتن به نقل‌قول ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextQuote}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="نقل‌قول بعدی"
            aria-label="بعدی"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
