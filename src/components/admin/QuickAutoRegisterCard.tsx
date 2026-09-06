import React, { useState } from 'react';
import {
  Sparkles,
  Link,
  Film,
  Video,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  FileText,
  HelpCircle,
  Flame
} from 'lucide-react';
import { Episode, Guest, Clip } from '../../types';
import { fetchVideoAutoInfo } from '../../services/videoService';
import { toPersianDigits, parseVideoUrl } from '../../utils/videoUtils';

interface QuickAutoRegisterCardProps {
  guests: Guest[];
  episodesCount: number;
  addGuest: (guest: Omit<Guest, 'id'>) => Guest;
  addEpisode: (episode: Omit<Episode, 'id'>) => Episode;
  addClip: (clip: Omit<Clip, 'id'>) => Clip;
  showToast: (msg: string) => void;
  onSelectEpisode?: (id: string) => void;
}

export const QuickAutoRegisterCard: React.FC<QuickAutoRegisterCardProps> = ({
  guests,
  episodesCount,
  addGuest,
  addEpisode,
  addClip,
  showToast,
  onSelectEpisode,
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [mediaType, setMediaType] = useState<'episode' | 'clip'>('episode');
  const [extraNotes, setExtraNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [lastRegistered, setLastRegistered] = useState<{
    id: string;
    type: 'episode' | 'clip';
    title: string;
    guest: string;
    thumbnail: string;
    duration: string;
  } | null>(null);

  const sampleLinks = [
    {
      label: 'نمونه مصاحبه در آپارات',
      url: 'https://www.aparat.com/v/m435163',
    },
    {
      label: 'نمونه ویدیو در یوتیوب',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  ];

  const handleAutoRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = videoUrl.trim();
    if (!cleanUrl) {
      showToast('لطفاً ابتدا لینک ویدیو را وارد کنید');
      return;
    }

    setIsLoading(true);
    setLoadingStep('در حال اتصال به سرور و استخراج اطلاعات ویدیو...');

    try {
      setLoadingStep('در حال دریافت مشخصات، پوستر و عنوان از منبع ویدیو...');
      const result = await fetchVideoAutoInfo(cleanUrl, extraNotes, mediaType);

      setLoadingStep('در حال ثبت هوشمند در پایگاه داده...');

      if (mediaType === 'episode') {
        // 1. Check if guest exists or create a new guest automatically
        let guestId = '';
        const existingGuest = guests.find(
          (g) => g.name.toLowerCase() === result.guest.toLowerCase()
        );

        if (existingGuest) {
          guestId = existingGuest.id;
        } else {
          // Auto create guest
          const newGuest = addGuest({
            name: result.guest,
            role: result.guestRole,
            image: result.guestAvatar || result.thumbnail,
            bio: `راوی و مهمان برنامه «چی شد حوزه؟». او در این گفتگو تجربیات زیسته خود را پیرامون مسیر طلبگی به اشتراک گذاشته است.`,
            fieldOfExpertise: result.category === 'scholars' ? 'سطوح عالی و پژوهش حوزوی' : 'مدیریت و تبلیغ دینی',
            quote: result.quote,
            episodesCount: 1,
            episodeIds: [],
            keyMoment: 'نقطه عطف تصمیم‌گیری و ورود به حوزه',
          });
          guestId = newGuest.id;
        }

        // 2. Format episode number (e.g. ۰۴)
        const nextNum = episodesCount + 1;
        const numFormatted = nextNum < 10 ? `۰${toPersianDigits(nextNum)}` : toPersianDigits(nextNum);

        const newEp = addEpisode({
          number: numFormatted,
          title: result.title,
          guest: result.guest,
          guestRole: result.guestRole,
          guestAvatar: result.guestAvatar || result.thumbnail,
          thumbnail: result.thumbnail,
          videoUrl: result.videoUrl,
          duration: result.duration,
          description: result.description,
          topics: result.topics,
          quote: result.quote,
          publishedAt: 'امروز',
          category: result.category,
          viewsCount: Math.floor(Math.random() * 4000) + 1200,
          featured: false,
          takeaways: result.takeaways,
          relatedClipIds: [],
        });

        setLastRegistered({
          id: newEp.id,
          type: 'episode',
          title: newEp.title,
          guest: newEp.guest,
          thumbnail: newEp.thumbnail,
          duration: newEp.duration,
        });

        showToast(`قسمت جدید «${newEp.title}» با موفقیت و خودکار ثبت شد!`);
      } else {
        // Clip
        const newClip = addClip({
          episodeId: 'ep-01',
          title: result.title,
          guest: result.guest,
          guestRole: result.guestRole,
          thumbnail: result.thumbnail,
          videoUrl: result.videoUrl,
          duration: result.duration || '۱:۳۰',
          highlightCategory: result.highlightCategory || 'تجربه زیسته',
          viewsCount: Math.floor(Math.random() * 5000) + 800,
        });

        setLastRegistered({
          id: newClip.id,
          type: 'clip',
          title: newClip.title,
          guest: newClip.guest,
          thumbnail: newClip.thumbnail,
          duration: newClip.duration,
        });

        showToast(`کلیپ کوتاه «${newClip.title}» با موفقیت ثبت شد!`);
      }

      setVideoUrl('');
      setExtraNotes('');
    } catch (err: any) {
      console.error(err);
      showToast('خطا در استخراج خودکار اطلاعات؛ لطفاً مجدد تلاش کنید.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const detectedInfo = videoUrl ? parseVideoUrl(videoUrl) : null;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-[#12281D] via-[#1B3B2B] to-[#12281D] text-white shadow-xl border border-white/10 mb-10 text-right relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#3FA36A]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#C5A869]/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10">
        {/* Header Badge & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#C5A869] shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  ثبت خودکار همه‌چیز فقط با لینک ویدیو
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#3FA36A] text-white text-[11px] font-bold">
                  بدون تایپ دستی
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                فقط لینک آپارات، یوتیوب یا فایل ویدیو را بدهید؛ عنوان، مهمان، پوستر، مدت‌زمان، نکات و خلاصه‌سازی خودکار استخراج و ثبت می‌شود.
              </p>
            </div>
          </div>

          {/* Type Selector (Episode vs Clip) */}
          <div className="inline-flex p-1 rounded-2xl bg-black/40 border border-white/10 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMediaType('episode')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mediaType === 'episode'
                  ? 'bg-[#FAF9F5] text-[#12281D] shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>قسمت کامل برنامه</span>
            </button>
            <button
              type="button"
              onClick={() => setMediaType('clip')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mediaType === 'clip'
                  ? 'bg-[#FAF9F5] text-[#12281D] shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#E65100]" />
              <span>برش و کلیپ کوتاه</span>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAutoRegister} className="space-y-4">
          <div className="relative">
            <div className="flex items-center gap-2 bg-black/40 rounded-2xl border border-white/20 p-2 focus-within:border-[#3FA36A] focus-within:ring-2 focus-within:ring-[#3FA36A]/30 transition-all">
              <div className="p-2 text-stone-400">
                <Link className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="لینک ویدیو را اینجا قرار دهید (مثلاً: https://www.aparat.com/v/m435163 یا لینک یوتیوب یا فایل mp4)..."
                className="w-full bg-transparent text-sm text-white placeholder-stone-400 outline-none dir-ltr font-mono"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !videoUrl.trim()}
                className="whitespace-nowrap px-5 py-3 rounded-xl bg-[#3FA36A] hover:bg-[#328555] disabled:bg-stone-700 disabled:text-stone-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال پردازش...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#E2D8BE]" />
                    <span>⚡ استخراج و ثبت خودکار</span>
                  </>
                )}
              </button>
            </div>

            {/* Video Type Detection Hint */}
            {detectedInfo && (
              <div className="mt-2 flex items-center gap-2 text-xs text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  منبع تشخیص داده شده:{' '}
                  <strong className="text-white">
                    {detectedInfo.type === 'aparat'
                      ? 'ویدیو آپارات (Aparat)'
                      : detectedInfo.type === 'youtube'
                      ? 'یوتیوب (YouTube)'
                      : detectedInfo.type === 'direct'
                      ? 'فایل مستقیم ویدیو (MP4)'
                      : 'پیوند وب'}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Optional extra text notes */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-300">
              <span className="text-stone-400">لینک‌های تست سریع:</span>
              {sampleLinks.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVideoUrl(s.url)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#E2D8BE] hover:text-white border border-white/10 transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <details className="text-xs text-stone-300 cursor-pointer">
              <summary className="hover:text-white transition-colors">
                + افزودن عنوان یا توضیحات اختیاری (جهت دقت بیشتر هوش مصنوعی)
              </summary>
              <div className="mt-2 w-full sm:w-96">
                <input
                  type="text"
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  placeholder="اختیاری: نام مهمان یا موضوع مورد نظر..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-stone-400 outline-none"
                />
              </div>
            </details>
          </div>

          {/* Loading status indicator */}
          {isLoading && (
            <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 flex items-center gap-3 animate-fade-in">
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin shrink-0" />
              <div className="text-xs sm:text-sm text-stone-200">
                <span className="font-bold text-white block mb-0.5">
                  هوش مصنوعی در حال خواندن ویدیو و پر کردن تمام اطلاعات است...
                </span>
                <span className="text-emerald-300">{loadingStep}</span>
              </div>
            </div>
          )}
        </form>

        {/* Success Card of Last Registered Item */}
        {lastRegistered && (
          <div className="mt-6 p-4 rounded-2xl bg-white/10 border border-emerald-500/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <img
                src={lastRegistered.thumbnail}
                alt={lastRegistered.title}
                className="w-16 h-12 rounded-xl object-cover border border-white/20 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-300 font-bold">
                    {lastRegistered.type === 'episode' ? 'قسمت کامل' : 'کلیپ کوتاه'} با موفقیت ثبت شد:
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {lastRegistered.title}
                </h4>
                <p className="text-xs text-stone-300">
                  مهمان: {lastRegistered.guest} • مدت: {lastRegistered.duration}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                آماده پخش در سایت
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
