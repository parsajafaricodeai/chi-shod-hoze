import React from 'react';
import { motion } from 'motion/react';
import { Camera, Mic, Film, Radio, CheckCircle2, ArrowUpRight, HelpCircle } from 'lucide-react';
import { PRODUCTION_TIMELINE } from '../data/mockData';

export const AboutPage: React.FC = () => {
  const faqs = [
    {
      q: 'ایده برنامه «چی شد حوزه؟» از کجا آمد؟',
      a: 'از این سؤال ساده و در عین حال پیچیده که در ذهن بسیاری از جوانان شکل می‌گیرد: چه انگیزه‌ای کسی را از دانشگاه، بازار یا زندگی معمولی به حوزه می‌کشاند و واقعیت این انتخاب پس از سال‌ها چیست؟'
    },
    {
      q: 'آیا این برنامه وابسته به نهاد رسمی خاصی است؟',
      a: '«چی شد حوزه؟» یک اثر مستند و رسانه‌ای مستقل است که تلاش دارد فضایی باز برای روایت‌های بدون سانسور، انتقادات مصلحانه و تجربیات واقعی فراهم کند.'
    },
    {
      q: 'مهمان‌های برنامه بر چه اساسی انتخاب می‌شوند؟',
      a: 'تنوع سابقه تحصیلی، صداقت در بیان، داشتن تجربه زیسته قابل اعتنا و شجاعت در بازگویی تردیدها و نقاط عطف زندگی، ملاک‌های اصلی دعوت از مهمان‌ها هستند.'
    },
    {
      q: 'چطور می‌توانم سوژه یا مهمان جدیدی پیشنهاد دهم؟',
      a: 'از طریق ارتباط مستقیم در کانال ایتا به نشانی chi_shod_hozeh@ می‌توانید نظرات و سوژه‌های پیشنهادی خود را با گروه پژوهش برنامه به اشتراک بگذارید.'
    }
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-right max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs font-semibold mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>رویکرد و رسالت رسانه‌ای</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#12281D] tracking-tight mb-4">
            درباره برنامه «چی شد حوزه؟»
          </h1>
          <p className="text-base sm:text-lg text-[#4A554E] leading-relaxed">
            روایت آدم‌هایی که این مسیر را زندگی کرده‌اند؛ نه قضاوت‌های بیرونی، نه تمجیدهای رسمی، بلکه حقیقتِ جاری در تصمیم‌ها.
          </p>
        </div>

        {/* Narrative Feature Card */}
        <div className="p-6 sm:p-12 rounded-3xl bg-white border border-[#1B3B2B]/10 shadow-lg mb-16 text-right">
          <div className="max-w-4xl space-y-6 text-base sm:text-lg text-[#3E4943] leading-relaxed">
            <p className="font-semibold text-xl text-[#12281D]">
              «تا حالا برات سؤال شده چرا یکی تصمیم می‌گیره طلبه بشه؟ چی شد که اومد حوزه؟ اصلاً از کجا فهمید این مسیر براش مناسبه؟»
            </p>
            <p>
              توی برنامه «چی شد حوزه؟» می‌خوایم پای حرف اساتید، مدیران و برخی شخصیت‌های معروف حوزوی بشینیم و از تجربه واقعیشون بشنویم؛ از انتخاب حوزه، سختی‌ها، شیرینی‌ها و چیزهایی که شاید قبل از ورود به حوزه کسی بهت نگفته باشه!
            </p>
            <p>
              اینجا قراره حوزه رو از زبان آدم‌هایی بشناسیم که خودشون این مسیر رو زندگی کردن.
            </p>
            <div className="p-6 rounded-2xl bg-[#FAF9F5] border-r-4 border-[#1B3B2B] font-bold text-lg sm:text-xl text-[#1B3B2B]">
              «چی شد حوزه؟؛ شاید جواب سؤال تو هم همین‌جا باشه.»
            </div>
          </div>
        </div>

        {/* Visual Behind the Scenes Gallery */}
        <div className="mb-20">
          <div className="text-right mb-6">
            <span className="text-xs font-bold text-[#886F35]">گالری استودیو</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#12281D]">
              پشت صحنه تولید
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-3xl overflow-hidden shadow-md aspect-4/3 bg-stone-900 group">
              <img
                src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80"
                alt="تنظیم میکروفون و صدابرداری"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-md aspect-4/3 bg-stone-900 group">
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
                alt="نورپردازی سینمایی استودیو"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-md aspect-4/3 bg-stone-900 group">
              <img
                src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80"
                alt="فضای مصاحبه و صندلی‌های گفتگو"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Production Timeline: ایده ↓ گفتگو ↓ روایت ↓ انتشار */}
        <div className="mb-20">
          <div className="text-right mb-8">
            <span className="text-xs font-bold text-[#886F35]">فرآیند مستندسازی</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#12281D]">
              چهار گام تولید هر روایت
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTION_TIMELINE.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-[#1B3B2B]/10 shadow-xs text-right"
              >
                <span className="text-3xl font-black text-[#1B3B2B] block mb-3">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-[#12281D] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#525E56] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-right mb-8">
            <span className="text-xs font-bold text-[#886F35]">پرسش‌های متداول</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#12281D]">
              سؤالاتی که ممکن است برای شما هم پیش آمده باشد
            </h2>
          </div>

          <div className="space-y-4 max-w-4xl text-right">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#1B3B2B]/10 shadow-xs"
              >
                <h4 className="text-base font-bold text-[#12281D] mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#1B3B2B] shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-sm text-[#4A554E] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Follow CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#12281D] text-white text-center flex flex-col items-center">
          <h3 className="text-2xl sm:text-3xl font-black mb-3 text-white">
            شما هم به این گفتگو بپیوندید
          </h3>
          <p className="text-sm text-stone-300 max-w-xl mb-6">
            با دنبال کردن کانال برنامه در ایتا، می‌توانید در نظرسنجی‌ها شرکت کرده و دیدگاه‌های خود درباره هر قسمت را ارسال کنید.
          </p>
          <a
            href="https://eitaa.com/chi_shod_hozeh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F3ECE1] text-[#12281D] font-bold text-sm hover:bg-white transition-all shadow-md"
          >
            <span>عضویت در کانال ایتا</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
