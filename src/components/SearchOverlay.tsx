import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Film, Users, Play, ArrowLeft } from 'lucide-react';
import { useAppData } from '../context/DataContext';
import { Episode, Guest, Clip } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEpisode: (episodeId: string) => void;
  onSelectGuest: (guestId: string) => void;
  onSelectClip: (clip: Clip) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onSelectEpisode,
  onSelectGuest,
  onSelectClip,
}) => {
  const { episodes, guests, clips } = useAppData();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const cleanQuery = query.trim().toLowerCase();

  const filteredEpisodes = cleanQuery
    ? episodes.filter(
        (ep) =>
          ep.title.toLowerCase().includes(cleanQuery) ||
          ep.guest.toLowerCase().includes(cleanQuery) ||
          ep.description.toLowerCase().includes(cleanQuery) ||
          ep.topics.some((t) => t.toLowerCase().includes(cleanQuery))
      )
    : [];

  const filteredGuests = cleanQuery
    ? guests.filter(
        (g) =>
          g.name.toLowerCase().includes(cleanQuery) ||
          g.role.toLowerCase().includes(cleanQuery) ||
          g.bio.toLowerCase().includes(cleanQuery) ||
          g.fieldOfExpertise.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredClips = cleanQuery
    ? clips.filter(
        (c) =>
          c.title.toLowerCase().includes(cleanQuery) ||
          c.guest.toLowerCase().includes(cleanQuery) ||
          c.highlightCategory.toLowerCase().includes(cleanQuery)
      )
    : [];

  const hasResults =
    filteredEpisodes.length > 0 ||
    filteredGuests.length > 0 ||
    filteredClips.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#12281D]/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="relative w-full max-w-3xl bg-[#FAF9F5] rounded-3xl shadow-2xl border border-[#1B3B2B]/20 overflow-hidden z-10 text-right"
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#1B3B2B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در نام مهمان، موضوع، شماره قسمت یا کلیدواژه..."
            className="w-full bg-transparent text-base sm:text-lg font-medium text-[#12281D] placeholder:text-stone-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors"
          >
            <span className="text-xs font-bold px-2 py-1 rounded bg-stone-100 border border-stone-200">
              ESC
            </span>
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {!query && (
            <div className="text-center py-10 text-stone-500">
              <p className="text-sm font-medium mb-3">
                می‌توانید عباراتی مثل «فلسفه»، «دکتر حسینی»، «مهندسی»، «مدیریت» یا «روایت» را جستجو کنید.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['مهندسی برق', 'فلسفه اسلامی', 'تغییر مسیر', 'مدارس علمیه', 'نسل Z', 'بانوان طلبه'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-[#1B3B2B]/5 hover:border-[#1B3B2B]/20 text-[#1B3B2B] transition-colors"
                    >
                      #{tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {query && !hasResults && (
            <div className="text-center py-12 text-stone-500">
              <p className="text-base font-bold text-[#12281D] mb-1">
                نتیجه‌ای برای «{query}» پیدا نشد.
              </p>
              <p className="text-xs text-stone-400">
                لطفاً املای کلمات را بررسی کنید یا عبارت دیگری را جستجو کنید.
              </p>
            </div>
          )}

          {/* Episodes Matches */}
          {filteredEpisodes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#1B3B2B] flex items-center gap-1.5 mb-3">
                <Film className="w-4 h-4" />
                <span>قسمت‌های یافت‌شده ({filteredEpisodes.length})</span>
              </h4>
              <div className="space-y-2.5">
                {filteredEpisodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => {
                      onSelectEpisode(ep.id);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-white hover:bg-[#FAF9F5] border border-stone-200/80 hover:border-[#1B3B2B]/30 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={ep.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80'}
                        alt={ep.title}
                        className="w-16 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <span className="text-[11px] font-bold text-[#886F35]">
                          قسمت {ep.number} • {ep.guest}
                        </span>
                        <h5 className="text-sm font-bold text-[#12281D] group-hover:text-[#1B3B2B] truncate">
                          {ep.title}
                        </h5>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-[#1B3B2B] group-hover:-translate-x-1 transition-all shrink-0 mr-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guests Matches */}
          {filteredGuests.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#1B3B2B] flex items-center gap-1.5 mb-3">
                <Users className="w-4 h-4" />
                <span>مهمان‌های برنامه ({filteredGuests.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredGuests.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      onSelectGuest(g.id);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-white hover:bg-[#FAF9F5] border border-stone-200/80 hover:border-[#1B3B2B]/30 transition-all flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={g.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                      alt={g.name}
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h5 className="text-sm font-bold text-[#12281D] group-hover:text-[#1B3B2B] truncate">
                        {g.name}
                      </h5>
                      <span className="text-[11px] text-stone-500 line-clamp-1">
                        {g.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clips Matches */}
          {filteredClips.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#1B3B2B] flex items-center gap-1.5 mb-3">
                <Play className="w-4 h-4" />
                <span>کلیپ‌های کوتاه ({filteredClips.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredClips.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectClip(c);
                      onClose();
                    }}
                    className="p-2.5 rounded-2xl bg-white hover:bg-[#FAF9F5] border border-stone-200/80 hover:border-[#1B3B2B]/30 transition-all flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-stone-900 shrink-0">
                      <img
                        src={c.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80'}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-3 h-3 fill-white text-white" />
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="text-xs font-bold text-[#12281D] line-clamp-2">
                        {c.title}
                      </h5>
                      <span className="text-[10px] text-stone-500 mt-1 block">
                        {c.guest} • {c.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
