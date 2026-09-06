import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Mic, Film, Quote, Sparkles } from 'lucide-react';

interface IntroSectionProps {
  onLearnMore?: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onLearnMore }) => {
  return (
    <section id="intro-section" className="py-20 sm:py-28 bg-[#FAF9F5] border-b border-[#1B3B2B]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Right Text Column (in RTL, Right is the start) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col items-start text-right"
          >
            {/* Editorial Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs sm:text-sm font-semibold mb-4">
              <Mic className="w-3.5 h-3.5 text-[#2A5A43]" />
              <span>درباره مستند «چی شد حوزه؟»</span>
            </div>

            {/* Big Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#12281D] tracking-tight leading-tight mb-6">
              هر مسیر، از یک تصمیم شروع می‌شود.
            </h2>

            {/* Narrative Paragraphs */}
            <div className="space-y-4 text-base sm:text-lg text-[#3E4943] leading-relaxed mb-8">
              <p className="font-medium text-[#1B3B2B]">
                تا حالا برات سؤال شده چرا یکی تصمیم می‌گیره طلبه بشه؟ چی شد که اومد حوزه؟ اصلاً از کجا فهمید این مسیر براش مناسبه؟
              </p>
              <p>
                توی برنامه <strong className="text-[#12281D]">«چی شد حوزه؟»</strong> می‌خوایم پای حرف اساتید، مدیران و برخی شخصیت‌های معروف حوزوی بشینیم و از تجربه واقعیشون بشنویم؛ از انتخاب حوزه، سختی‌ها، شیرینی‌ها و چیزهایی که شاید قبل از ورود به حوزه کسی بهت نگفته باشه!
              </p>
              <p>
                اینجا قرار نیست شعار بشنوی؛ اینجا قراره حوزه رو از زبان آدم‌هایی بشناسیم که خودشون این مسیر رو با گوشت و پوست زندگی کردن، زمین خوردن، تردید داشتن، ایستادگی کردن و راهشونو ساختن.
              </p>
            </div>

            {/* Closing Signature Quote Box */}
            <div className="p-5 rounded-2xl bg-white border border-[#1B3B2B]/15 shadow-2xs w-full flex items-start gap-4 mb-6">
              <div className="p-2.5 rounded-xl bg-[#1B3B2B]/10 text-[#1B3B2B] shrink-0">
                <Quote className="w-5 h-5 fill-current" />
              </div>
              <div className="text-right">
                <p className="text-base sm:text-lg font-bold text-[#12281D]">
                  «چی شد حوزه؟؛ شاید جواب سؤال تو هم همین‌جا باشه.»
                </p>
                <span className="text-xs text-[#627068]">نگاهی صادقانه به تجربه زیسته طلاب معاصر</span>
              </div>
            </div>

            {/* Core Values List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {[
                'روایت‌های بدون روتوش و بدون تعارف',
                'پاسخ به چالش‌ها و شبهات جوانان',
                'گفت‌وگو با چهره‌های متنوع و متفاوت',
                'تصویربرداری و تدوین مستند سینمایی',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 text-sm font-medium text-[#29322D]">
                  <CheckCircle2 className="w-4 h-4 text-[#3FA36A] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Left Visual Column with Subtle Parallax Framing */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative framing box */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#1B3B2B]/15 to-[#C5A869]/20 transform rotate-1 -z-10" />

              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/60 bg-white aspect-4/5 sm:aspect-square lg:aspect-4/5">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
                  alt="فضای مصاحبه و ضبط برنامه چی شد حوزه"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />

                {/* Ambient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#12281D]/90 via-transparent to-black/20" />

                {/* Floating On-Image Card */}
                <div className="absolute bottom-5 right-5 left-5 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white shadow-lg text-right">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#1B3B2B] bg-[#1B3B2B]/10 px-2.5 py-0.5 rounded-full">
                      استودیوی اختصاصی ضبط
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                      در حال تولید
                    </span>
                  </div>
                  <p className="text-xs text-[#4A554E] leading-relaxed">
                    فضایی صمیمی و آرام برای شنیدن عمیق‌ترین اعترافات و صادقانه‌ترین تردیدها
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
