import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Quote, Sparkles, BookOpen, Film, Play } from 'lucide-react';
import { Guest, Episode } from '../types';
import { useAppData } from '../context/DataContext';
import { EpisodeCard } from '../components/EpisodeCard';

interface GuestDetailPageProps {
  guestId: string;
  onSelectEpisode: (episodeId: string) => void;
  onPlayEpisode: (episode: Episode) => void;
  onBack: () => void;
}

export const GuestDetailPage: React.FC<GuestDetailPageProps> = ({
  guestId,
  onSelectEpisode,
  onPlayEpisode,
  onBack,
}) => {
  const { guests, episodes } = useAppData();
  const guest = guests.find((g) => g.id === guestId) || (guests.length > 0 ? guests[0] : null);

  if (!guest) {
    return (
      <div className="pt-28 pb-24 min-h-screen bg-[#FAF9F5] text-right">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3B2B] hover:text-[#2E7D52] mb-6 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به فهرست مهمان‌ها</span>
          </button>
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
            <h2 className="text-xl font-bold text-[#12281D] mb-2">مهمان مورد نظر یافت نشد</h2>
            <p className="text-sm text-stone-500">اطلاعاتی برای نمایش این مهمان وجود ندارد.</p>
          </div>
        </div>
      </div>
    );
  }

  const guestEpisodes = episodes.filter((ep) =>
    (guest.episodeIds && guest.episodeIds.includes(ep.id)) || ep.guest === guest.name
  );

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3B2B] hover:text-[#2E7D52] mb-6 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست مهمان‌ها</span>
        </button>

        {/* Profile Card Header */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#1B3B2B]/10 shadow-lg mb-12 text-right">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Portrait (4 cols) */}
            <div className="md:col-span-4 relative mx-auto md:mx-0 w-full max-w-[280px]">
              <div className="rounded-3xl overflow-hidden aspect-4/5 shadow-xl border-4 border-white bg-stone-900">
                <img
                  src={guest.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
                  alt={guest.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Bio Details (8 cols) */}
            <div className="md:col-span-8 flex flex-col justify-center">
              <span className="text-xs font-bold text-[#886F35] bg-[#C5A869]/15 px-3 py-1 rounded-full self-start mb-3">
                {guest.fieldOfExpertise}
              </span>

              <h1 className="text-2xl sm:text-4xl font-black text-[#12281D] mb-2">
                {guest.name}
              </h1>

              <p className="text-sm sm:text-base text-[#525E56] font-medium mb-6">
                {guest.role}
              </p>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border-r-4 border-[#1B3B2B] text-sm sm:text-base text-[#1B3B2B] font-medium leading-relaxed italic mb-6">
                <Quote className="w-4 h-4 inline ml-2 opacity-60" />
                {guest.quote}
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#3E4943] leading-relaxed">
                <p>{guest.bio}</p>
              </div>

              {/* Key turning point badge */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C5A869] shrink-0 mt-0.5" />
                <span className="text-xs text-[#525E56] font-medium">
                  <strong>نقطه عطف مسیر: </strong>
                  {guest.keyMoment}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Guest's Episodes in the show */}
        <div>
          <div className="flex items-center gap-2 mb-6 text-right">
            <Film className="w-5 h-5 text-[#1B3B2B]" />
            <h2 className="text-2xl font-black text-[#12281D]">
              قسمت‌های این مهمان در «چی شد حوزه؟»
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {guestEpisodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                onPlay={onPlayEpisode}
                onSelect={onSelectEpisode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
