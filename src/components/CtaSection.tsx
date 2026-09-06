import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Bell, Send, Check } from 'lucide-react';

export const CtaSection: React.FC = () => {
  return (
    <section id="eitaa-cta-section" className="py-20 sm:py-24 bg-[#FAF9F5] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#12281D] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-[#C5A869]/20 text-center flex flex-col items-center">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#1B3B2B] blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#C5A869] blur-3xl opacity-20 pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#E2D8BE] text-xs font-bold mb-6">
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            <span>کانال رسمی برنامه در ایتا</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            قسمت‌های جدید را از دست نده.
          </h2>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-stone-200/90 max-w-2xl leading-relaxed mb-8 font-normal">
            برای دیدن قسمت‌های جدید، کلیپ‌ها و اطلاع‌رسانی‌های برنامه ما را در ایتا دنبال کن و نظرات، پرسش‌ها و سوژه‌های پیشنهادی خودت را با ما در میان بگذار.
          </p>

          {/* Main Action Button */}
          <a
            id="cta-join-eitaa-btn"
            href="https://eitaa.com/chi_shod_hozeh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-extrabold text-[#12281D] bg-[#F3ECE1] hover:bg-white active:scale-98 transition-all shadow-xl hover:shadow-2xl group"
          >
            <span>عضویت در کانال ایتا</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          {/* Bullet points */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-10 text-xs sm:text-sm text-stone-300">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#3FA36A]" />
              اطلاع‌رسانی لحظه‌ای انتشار قسمت‌ها
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#3FA36A]" />
              گزیده ویدیوها و دیالوگ‌های مهم
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#3FA36A]" />
              ارتباط مستقیم با عوامل برنامه
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
