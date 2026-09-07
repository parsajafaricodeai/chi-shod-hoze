import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, BookOpen, HeartHandshake, Sparkles, Flame, Play, ArrowLeft, RefreshCw } from 'lucide-react';
import { INTERACTIVE_OPTIONS } from '../data/mockData';
import { InteractiveOption } from '../types';
import { useAppData } from '../context/DataContext';

interface InteractiveQuizProps {
  onSelectEpisode: (episodeId: string) => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ onSelectEpisode }) => {
  const { episodes } = useAppData();
  const [selectedOption, setSelectedOption] = useState<InteractiveOption | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Compass':
        return <Compass className="w-5 h-5 text-[#2E7D52]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#2E7D52]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-[#2E7D52]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#2E7D52]" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-[#2E7D52]" />;
      default:
        return <Compass className="w-5 h-5 text-[#2E7D52]" />;
    }
  };

  const recommendedEpisodes = selectedOption
    ? episodes.filter((ep) =>
        selectedOption.recommendedEpisodeIds.includes(ep.id)
      )
    : [];

  return (
    <section id="interactive-section" className="py-20 sm:py-28 bg-[#F3ECE1]/60 border-b border-[#1B3B2B]/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>تجربه تعاملی مخاطب</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#12281D] tracking-tight mb-3">
            اگر جای او بودی، چه تصمیمی می‌گرفتی؟
          </h2>
          <p className="text-base sm:text-lg text-[#3E4943] font-medium">
            اگر امروز بخواهی مسیر زندگی‌ات را انتخاب کنی، چه چیزی برایت مهم‌تر است؟
          </p>
          <span className="text-xs text-[#717E76] block mt-1">
            یک تأمل کوتاه و سرگرم‌کننده بر پایه روایت‌های واقعی برنامه
          </span>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mb-10 text-right">
          {INTERACTIVE_OPTIONS.map((opt) => {
            const isSelected = selectedOption?.id === opt.id;
            return (
              <button
                key={opt.id}
                id={`quiz-option-${opt.id}`}
                onClick={() => setSelectedOption(opt)}
                className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1B3B2B] text-white border-[#1B3B2B] shadow-lg scale-102'
                    : 'bg-white hover:bg-white/90 text-[#12281D] border-stone-200/90 shadow-2xs hover:border-[#1B3B2B]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isSelected ? 'bg-white/10 text-white' : 'bg-[#1B3B2B]/5'
                    }`}
                  >
                    {getIcon(opt.iconName)}
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-white/15 text-[#E2D8BE]' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    انتخاب
                  </span>
                </div>
                <div>
                  <h3
                    className={`text-base font-bold mb-1.5 ${
                      isSelected ? 'text-white' : 'text-[#12281D]'
                    }`}
                  >
                    {opt.title}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed ${
                      isSelected ? 'text-stone-200' : 'text-[#525E56]'
                    }`}
                  >
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Result Area */}
        <AnimatePresence>
          {selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1B3B2B]/15 shadow-xl text-right max-w-4xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-stone-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1B3B2B] flex items-center justify-center text-white">
                    {getIcon(selectedOption.iconName)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#886F35]">بازتاب انتخاب شما</span>
                    <h4 className="text-lg font-black text-[#12281D]">
                      تمرکز شما بر «{selectedOption.title}» است
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOption(null)}
                  className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#12281D] self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>انتخاب مجدد</span>
                </button>
              </div>

              {/* Insight Text */}
              <p className="text-base text-[#2D3831] leading-relaxed mb-6 font-medium bg-[#FAF9F5] p-4 rounded-xl border-r-3 border-[#1B3B2B]">
                {selectedOption.insight}
              </p>

              {/* Recommended Episodes for this Path */}
              {recommendedEpisodes.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-[#525E56] mb-3">
                    قسمت‌های پیشنهادی بر اساس انتخاب شما:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recommendedEpisodes.map((ep) => (
                      <div
                        key={ep.id}
                        onClick={() => onSelectEpisode(ep.id)}
                        className="p-3 rounded-xl bg-stone-50 hover:bg-[#FAF9F5] border border-stone-200/80 hover:border-[#1B3B2B]/40 transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={ep.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'}
                            alt={ep.title}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="text-right overflow-hidden">
                            <span className="text-[11px] font-bold text-[#1B3B2B]">
                              قسمت {ep.number} • {ep.guest}
                            </span>
                            <h6 className="text-xs font-bold text-[#12281D] truncate group-hover:text-[#1B3B2B] transition-colors">
                              {ep.title}
                            </h6>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#1B3B2B] group-hover:translate-x-1 transition-transform shrink-0 mr-2">
                          تماشا ←
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
