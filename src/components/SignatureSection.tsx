import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';

export const SignatureSection: React.FC = () => {
  const steps = [
    { title: 'یک سؤال', desc: 'شروع از یک کنجکاوی صادقانه؛ من برای چه زندگی می‌کنم؟' },
    { title: 'یک تصمیم', desc: 'انتخاب ایستادن در جایی که شاید دیگران از آن گریزان بودند' },
    { title: 'یک انتخاب', desc: 'دل بریدن از مسیرهای معمول برای چشیدن حقیقت' },
    { title: 'یک مسیر', desc: 'سال‌ها مباحثه، تدریس، زیستن با مردم و تحمل سختی‌ها' },
    { title: 'یک زندگی', desc: 'جایی که طلبگی از یک لباس عبور می‌کند و به هویت تبدیل می‌شود' },
  ];

  return (
    <section id="signature-section" className="py-24 sm:py-32 bg-[#12281D] text-white relative overflow-hidden">
      {/* Subtle background textural watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <span className="text-[24vw] font-black text-white select-none">چی شد؟</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Giant Iconic Hook */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="inline-block text-xs uppercase tracking-widest text-[#C5A869] font-bold mb-3">
            امضای برنامه
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-[#F3ECE1] tracking-tight">
            چی شد؟
          </h2>
          <div className="w-16 h-1 bg-[#C5A869] mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Stepped Words Sequence */}
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all w-full max-w-lg cursor-default"
              >
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#E2D8BE] group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300/80 mt-1 font-normal">
                      {step.desc}
                    </p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-[#C5A869]">
                    ۰{idx + 1}
                  </span>
                </div>
              </motion.div>

              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 0.8, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.15 + 0.1 }}
                  className="text-[#C5A869]/70 my-1"
                >
                  <ArrowDown className="w-5 h-5 animate-bounce" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Climax Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-20 pt-10 border-t border-white/15"
        >
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#E2D8BE] leading-relaxed max-w-2xl mx-auto">
            «حوزه را از زبان کسانی بشناس که خودشان این مسیر را زندگی کرده‌اند.»
          </p>
          <p className="text-xs sm:text-sm text-stone-400 mt-3 font-normal">
            نه قضاوت‌های بیرونی، نه تعارفات رسمی؛ فقط واقعیت جاری در لحظات زندگی
          </p>
        </motion.div>
      </div>
    </section>
  );
};
