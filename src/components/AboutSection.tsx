import React from 'react';
import { motion } from 'motion/react';
import { Video, Mic, Heart, Camera, Radio, ArrowLeft } from 'lucide-react';
import { PRODUCTION_TIMELINE } from '../data/mockData';

interface AboutSectionProps {
  onGoToAboutPage?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onGoToAboutPage }) => {
  return (
    <section id="about-section" className="py-20 sm:py-28 bg-[#FAF9F5] border-b border-[#1B3B2B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Split Section: Story & Studio Behind The Scenes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          {/* Right Column: Editorial Philosophy & Full Narrative */}
          <div className="lg:col-span-7 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs font-semibold mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>پشت صحنه و چشم‌انداز تولید</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#12281D] tracking-tight leading-snug mb-6">
              یک رسانه صریح، مستند و بدون تعارف
            </h2>

            <div className="space-y-4 text-base text-[#3E4943] leading-relaxed mb-8">
              <p>
                برنامه <strong className="text-[#12281D]">«چی شد حوزه؟»</strong> حاصل دغدغه جمعی از مستندسازان و پژوهشگران جوان است که احساس کردند تصویر رسانه‌ای رایج از حوزه، فرسنگ‌ها با زیست واقعی و درونی طلاب فاصله دارد.
              </p>
              <p>
                ما تلاش کردیم با ایجاد فضایی صمیمی و سینمایی، بستری فراهم کنیم که چهره‌های حوزوی بتوانند بدون نقاب‌های رسمی، از دل‌نگرانی‌ها، شیرینی‌ها، تلخی‌های انتخاب و حتی لحظات پشیمانی و بازگشت خود سخن بگویند.
              </p>
              <p className="font-semibold text-[#1B3B2B]">
                هدف ما ترویج یک‌سویه نیست؛ هدف ما گشودن پنجره‌ای شفاف برای تفکر است تا هر جوان پرسشگر بتواند با نگاهی واقع‌بینانه به این مسیر نگاه کند.
              </p>
            </div>

            {onGoToAboutPage && (
              <button
                onClick={onGoToAboutPage}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#1B3B2B] hover:bg-[#234F3A] transition-all shadow-xs"
              >
                <span>درباره تیم و فرآیند تولید بیشتر بخوانید</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Left Column: Behind the Scenes Photo Mosaic */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4">
            <div className="space-y-3.5 sm:space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-md aspect-4/5">
                <img
                  src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80"
                  alt="میکروفون استودیو و تجهیزات صدا"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#1B3B2B]/10 shadow-xs text-right">
                <span className="text-xl font-black text-[#1B3B2B] block">۴K HDR</span>
                <span className="text-xs text-[#627068]">ضبط با استانداردهای سینمایی</span>
              </div>
            </div>

            <div className="space-y-3.5 sm:space-y-4 pt-6">
              <div className="p-4 rounded-2xl bg-[#1B3B2B] text-white shadow-xs text-right">
                <span className="text-xl font-black text-[#E2D8BE] block">صداقت ۱۰۰٪</span>
                <span className="text-xs text-stone-200">بدون سانسور روایت‌های واقعی</span>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md aspect-4/5">
                <img
                  src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80"
                  alt="فضای گفتگو و استودیو ضبط"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Short Timeline Section: ایده ↓ گفتگو ↓ روایت ↓ انتشار */}
        <div className="pt-12 border-t border-[#1B3B2B]/10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#886F35] block mb-1">
              مراحل شکل‌گیری هر قسمت
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#12281D]">
              از جرقه تا قاب دوربین
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTION_TIMELINE.map((item, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-white border border-[#1B3B2B]/10 shadow-xs text-right hover:border-[#1B3B2B]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-[#1B3B2B]">
                      {item.step}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3FA36A]" />
                  </div>
                  <h4 className="text-lg font-bold text-[#12281D] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#525E56] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
