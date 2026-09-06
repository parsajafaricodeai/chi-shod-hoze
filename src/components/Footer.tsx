import React from 'react';
import { ArrowUpRight, Heart, Lock } from 'lucide-react';
import { useAppData } from '../context/DataContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useAppData();

  return (
    <footer id="main-footer" className="bg-[#12281D] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10 text-right">
          {/* Brand & Slogan (6 cols) */}
          <div className="md:col-span-6 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <span className="font-black text-base text-[#E2D8BE]">؟</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {settings.showTitle || 'چی شد حوزه؟'}
                </h3>
                <span className="text-xs text-[#C5A869] font-medium block">
                  {settings.showSubtitle || 'روایت آدم‌هایی که این مسیر را زندگی کرده‌اند.'}
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-300/80 leading-relaxed max-w-md mb-6 font-normal">
              برنامه‌ای مستقل و مستند برای شنیدن روایت‌های بدون روتوش از انتخاب، چالش‌ها و واقعیت زیست طلبگی از زبان اساتید، مدیران و طلاب معاصر.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#E2D8BE] font-medium leading-relaxed max-w-md">
              «چی شد حوزه؟؛ شاید جواب سؤال تو هم همین‌جا باشه.»
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 text-right">
            <h4 className="text-sm font-bold text-[#E2D8BE] uppercase tracking-wider mb-4">
              دسترسی سریع
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-white transition-colors"
                >
                  صفحه اصلی
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/episodes')}
                  className="hover:text-white transition-colors"
                >
                  همه قسمت‌ها
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/guests')}
                  className="hover:text-white transition-colors"
                >
                  مهمان‌های برنامه
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/clips')}
                  className="hover:text-white transition-colors"
                >
                  کلیپ‌های کوتاه
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  درباره برنامه
                </button>
              </li>
              <li className="pt-2 border-t border-white/10">
                <button
                  id="admin-panel-footer-link"
                  onClick={() => onNavigate('/admin')}
                  className="inline-flex items-center gap-1.5 text-xs text-[#C5A869] hover:text-white transition-colors font-medium"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>ورود مدیر (پنل مدیریت)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Social Channels (3 cols) */}
          <div className="md:col-span-3 text-right">
            <h4 className="text-sm font-bold text-[#E2D8BE] uppercase tracking-wider mb-4">
              ارتباط و شبکه‌های اجتماعی
            </h4>
            <p className="text-xs text-stone-300/80 leading-relaxed mb-4">
              پخش اصلی قسمت‌ها و کلیپ‌های روزانه در پیام‌رسان ایتا:
            </p>
            <a
              href={settings.eitaaUrl || 'https://eitaa.com/chi_shod_hozeh'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#234F3A] text-white text-xs font-bold transition-colors border border-white/15"
            >
              <span>کانال ایتا: chi_shod_hozeh@</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© تمامی حقوق برای برنامه مستند «چی شد حوزه؟» محفوظ است.</p>
          <div className="flex items-center gap-1">
            <span>تولید شده با دغدغه شفافیت و گفتگو</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
