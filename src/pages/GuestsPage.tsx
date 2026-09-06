import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Search } from 'lucide-react';
import { GUESTS_DATA } from '../data/mockData';
import { Guest } from '../types';
import { GuestCard } from '../components/GuestCard';
import { EmptyState } from '../components/StateViews';

interface GuestsPageProps {
  onSelectGuest: (guestId: string) => void;
}

export const GuestsPage: React.FC<GuestsPageProps> = ({ onSelectGuest }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuests = GUESTS_DATA.filter((g) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      g.name.toLowerCase().includes(q) ||
      g.role.toLowerCase().includes(q) ||
      g.fieldOfExpertise.toLowerCase().includes(q) ||
      g.bio.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-right max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>راویان و مهمانان برنامه</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#12281D] tracking-tight mb-4">
            مهمان‌های «چی شد حوزه؟»
          </h1>
          <p className="text-base text-[#4A554E] leading-relaxed">
            استادان، مدیران، نخبگان دانشگاهیِ مهاجرت‌کرده به حوزه، و چهره‌های فعال فرهنگی که با شجاعت روبروی دوربین نشستند تا از حقیقت مسیر بگویند.
          </p>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs mb-8 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در نام، تخصص یا سمت مهمان..."
              className="w-full pr-10 pl-4 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 text-[#12281D] focus:outline-hidden focus:border-[#1B3B2B]"
            />
          </div>
        </div>

        {/* Guests Grid */}
        {filteredGuests.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredGuests.map((guest) => (
              <GuestCard
                key={guest.id}
                guest={guest}
                onSelect={onSelectGuest}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            message="مهمانی با این مشخصات پیدا نشد."
            actionLabel="پاک کردن جستجو"
            onAction={() => setSearchQuery('')}
          />
        )}
      </div>
    </div>
  );
};
