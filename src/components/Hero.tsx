import React from 'react';
import { motion } from 'motion/react';
import { Play, ArrowLeft, ArrowUpRight, Sparkles, Radio } from 'lucide-react';

interface HeroProps {
  onWatchEpisodes: () => void;
  onFollowEitaa: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onWatchEpisodes, onFollowEitaa }) => {
  return (
    <section
      id="hero-section"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Cinematic Background with Slow Ambient Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=2000&q=85')`,
          }}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: 'easeOut' }}
        />
        {/* Editorial Gradients & Tint */}
        <div className="absolute inset-0 bg-[#12281D]/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F5] via-[#12281D]/60 to-[#12281D]/90" />
        <div className="absolute inset-0 bg-radial at-center from-transparent via-[#12281D]/40 to-[#12281D]/95" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Subtle Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-medium mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#3FA36A] animate-pulse" />
          <span>یک برنامه گفت‌وگومحور و مستند</span>
          <span className="text-white/40">•</span>
          <span className="text-[#E2D8BE]">فصل اول</span>
        </motion.div>

        {/* Main Title Reveal */}
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight mb-4"
        >
          چی شد حوزه؟
        </motion.h1>

        {/* Primary Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#D4E8DC] max-w-3xl mb-4 leading-relaxed"
        >
          «روایت آدم‌هایی که این مسیر را زندگی کرده‌اند.»
        </motion.p>

        {/* Question Hook */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-base sm:text-lg md:text-xl text-stone-200/90 max-w-2xl mb-8 leading-relaxed font-normal"
        >
          تا حالا برات سؤال شده چرا یکی تصمیم می‌گیره طلبه بشه؟ اصلاً چی شد که اومد حوزه و از کجا فهمید این مسیر براش مناسبه؟
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
        >
          {/* Watch Episodes CTA */}
          <button
            id="hero-watch-btn"
            onClick={onWatchEpisodes}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-bold text-[#12281D] bg-[#F3ECE1] hover:bg-white active:scale-98 transition-all shadow-lg hover:shadow-xl group"
          >
            <div className="w-6 h-6 rounded-full bg-[#1B3B2B] flex items-center justify-center text-white transition-transform group-hover:scale-110">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
            <span>تماشای قسمت‌ها</span>
          </button>

          {/* Follow CTA */}
          <button
            id="hero-follow-btn"
            onClick={onFollowEitaa}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/25 backdrop-blur-md transition-all active:scale-98"
          >
            <span>دنبال کردن برنامه</span>
            <ArrowUpRight className="w-4 h-4 text-[#D4E8DC]" />
          </button>
        </motion.div>

        {/* Quick Media Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="grid grid-cols-3 gap-6 sm:gap-12 mt-12 pt-8 border-t border-white/15 text-white/90"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black text-white">۶+</span>
            <span className="text-xs sm:text-sm text-stone-300">قسمت منتشرشده</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black text-[#E2D8BE]">۵۰۰+</span>
            <span className="text-xs sm:text-sm text-stone-300">دقیقه گفت‌وگوی صریح</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black text-white">۱۵۰k+</span>
            <span className="text-xs sm:text-sm text-stone-300">بازدید در شبکه‌ها</span>
          </div>
        </motion.div>
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-2 rounded-full bg-[#E2D8BE]"
          />
        </div>
      </div>
    </section>
  );
};
