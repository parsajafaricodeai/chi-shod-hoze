import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Play,
  Clock,
  Calendar,
  Share2,
  Check,
  Tag,
  Quote,
  Eye,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { Episode, Clip } from '../types';
import { useAppData } from '../context/DataContext';
import { ClipCard } from '../components/ClipCard';
import { EpisodeCard } from '../components/EpisodeCard';
import { UniversalVideoPlayer } from '../components/UniversalVideoPlayer';
import { parseVideoUrl } from '../utils/videoUtils';

interface EpisodeDetailPageProps {
  episodeId: string;
  onPlayEpisode: (episode: Episode) => void;
  onSelectEpisode: (episodeId: string) => void;
  onSelectGuest: (guestId: string) => void;
  onPlayClip: (clip: Clip) => void;
  onBack: () => void;
}

export const EpisodeDetailPage: React.FC<EpisodeDetailPageProps> = ({
  episodeId,
  onPlayEpisode,
  onSelectEpisode,
  onSelectGuest,
  onPlayClip,
  onBack,
}) => {
  const { episodes, guests, clips } = useAppData();
  const [copied, setCopied] = useState(false);
  const [isPlayingInline, setIsPlayingInline] = useState(false);

  const episode =
    episodes.find((e) => e.id === episodeId) || episodes[0];

  const guest =
    guests.find((g) => g.name === episode?.guest) || guests[0];

  // Related clips for this episode
  const relatedClips = clips.filter((c) =>
    episode?.relatedClipIds?.includes(c.id) || c.episodeId === episode?.id
  );

  // Suggested other episodes
  const suggestedEpisodes = episodes.filter(
    (e) => e.id !== episode?.id
  ).slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3B2B] hover:text-[#2E7D52] mb-6 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست قسمت‌ها</span>
        </button>

        {/* Big Video Player Stage */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-stone-800 mb-8 group">
          {isPlayingInline ? (
            <div className="w-full h-full relative">
              <UniversalVideoPlayer
                videoUrl={episode.videoUrl}
                poster={episode.thumbnail}
                title={episode.title}
                autoPlay={true}
                aspectRatio="16/9"
                className="w-full h-full rounded-none"
              />
              <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingInline(false)}
                  className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-semibold backdrop-blur-md transition-colors"
                  title="بستن پخش مستقیم"
                >
                  بازگشت به پوستر
                </button>
              </div>
            </div>
          ) : (
            <>
              <img
                src={episode.thumbnail}
                alt={episode.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

              {/* Top Badges */}
              <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-xl bg-[#1B3B2B] text-white text-xs sm:text-sm font-bold shadow-md">
                  قسمت {episode.number}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C5A869]" />
                    {episode.duration}
                  </span>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-white hover:text-[#12281D] transition-colors"
                    title="اشتراک‌گذاری قسمت"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Large Center Play Trigger */}
              <button
                onClick={() => setIsPlayingInline(true)}
                className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FAF9F5]/95 text-[#1B3B2B] flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-white transition-all duration-300 z-10 group/btn"
                aria-label="پخش کامل ویدیو"
              >
                <Play className="w-9 h-9 fill-current ml-1 text-[#1B3B2B] group-hover/btn:text-[#2E7D52] transition-colors" />
              </button>

              {/* Bottom Title on Player */}
              <div className="absolute bottom-6 right-6 left-6 text-right text-white pointer-events-none">
                <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-md">
                  {episode.title}
                </h1>
                <p className="text-xs sm:text-sm text-stone-200 mt-2 flex items-center gap-3">
                  <span>مهمان: {episode.guest}</span>
                  <span>•</span>
                  <span>تاریخ انتشار: {episode.publishedAt}</span>
                  <span>•</span>
                  <span>{episode.viewsCount.toLocaleString('fa-IR')} بازدید</span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          {/* Main Info Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8 text-right">
            {/* Guest Summary Card with Link */}
            <div className="p-6 rounded-3xl bg-white border border-[#1B3B2B]/10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={episode.guestAvatar}
                  alt={episode.guest}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#1B3B2B]/10 shadow-xs"
                />
                <div>
                  <h3 className="text-lg font-black text-[#12281D]">
                    {episode.guest}
                  </h3>
                  <p className="text-xs text-[#525E56] mt-0.5">
                    {episode.guestRole}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectGuest(guest.id)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#1B3B2B] transition-colors self-end sm:self-auto"
              >
                مشاهده بیوگرافی مهمان ←
              </button>
            </div>

            {/* Episode Synopsis */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1B3B2B]/10 shadow-xs">
              <h2 className="text-xl font-black text-[#12281D] mb-4">
                توضیحات و خلاصه گفتگو
              </h2>
              <p className="text-sm sm:text-base text-[#3E4943] leading-relaxed mb-6 font-normal">
                {episode.description}
              </p>

              {/* Highlight Quote Box */}
              <div className="p-5 rounded-2xl bg-[#FAF9F5] border-r-4 border-[#1B3B2B] text-sm sm:text-base text-[#1B3B2B] font-medium leading-relaxed italic flex items-start gap-3">
                <Quote className="w-5 h-5 shrink-0 fill-[#1B3B2B]/20 text-[#1B3B2B]" />
                <span>{episode.quote}</span>
              </div>
            </div>

            {/* In this episode: Topics discussed */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1B3B2B]/10 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-[#886F35]" />
                <h3 className="text-lg font-black text-[#12281D]">
                  در این قسمت درباره چه چیزهایی صحبت شد؟
                </h3>
              </div>

              {/* Topic tags list */}
              <div className="flex flex-wrap gap-2 mb-6">
                {episode.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#1B3B2B]/5 text-[#1B3B2B] font-semibold border border-[#1B3B2B]/10"
                  >
                    #{topic}
                  </span>
                ))}
              </div>

              {/* Key takeaways list */}
              {episode.takeaways && (
                <div className="space-y-2.5 pt-4 border-t border-stone-100">
                  <span className="text-xs font-bold text-[#525E56] block mb-2">
                    نکات کلیدی و فرازهای این مصاحبه:
                  </span>
                  {episode.takeaways.map((point, index) => (
                    <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2D3831]">
                      <CheckCircle2 className="w-4 h-4 text-[#3FA36A] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Related Short Clips */}
            {relatedClips.length > 0 && (
              <div>
                <h3 className="text-xl font-black text-[#12281D] mb-4">
                  برش‌های کوتاه مرتبط با این قسمت
                </h3>
                <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {relatedClips.map((clip) => (
                    <ClipCard key={clip.id} clip={clip} onPlay={onPlayClip} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6 text-right">
            {/* Watch CTA Box */}
            <div className="p-6 rounded-3xl bg-[#12281D] text-white shadow-xl flex flex-col gap-4">
              <span className="text-xs font-bold text-[#C5A869]">
                پخش با کیفیت کامل
              </span>
              <h4 className="text-lg font-black text-white">
                آماده شنیدن این روایت هستید؟
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                این قسمت ۴۸ دقیقه گفت‌وگوی صادقانه و صریح با دکتر حسینی پیرامون انتخاب‌های بزرگ زندگی است.
              </p>
              <button
                onClick={() => onPlayEpisode(episode)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#F3ECE1] text-[#12281D] hover:bg-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>پخش ویدیو در پلیر اختصاصی</span>
              </button>
            </div>

            {/* Suggested other episodes */}
            <div className="p-6 rounded-3xl bg-white border border-[#1B3B2B]/10 shadow-xs">
              <h4 className="text-base font-black text-[#12281D] mb-4">
                قسمت‌های پیشنهادی دیگر
              </h4>
              <div className="space-y-4">
                {suggestedEpisodes.map((sug) => (
                  <div
                    key={sug.id}
                    onClick={() => onSelectEpisode(sug.id)}
                    className="p-2.5 rounded-2xl hover:bg-[#FAF9F5] border border-stone-100 transition-colors flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={sug.thumbnail}
                      alt={sug.title}
                      className="w-16 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold text-[#886F35]">
                        قسمت {sug.number} • {sug.guest}
                      </span>
                      <h5 className="text-xs font-bold text-[#12281D] truncate group-hover:text-[#1B3B2B] transition-colors">
                        {sug.title}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
