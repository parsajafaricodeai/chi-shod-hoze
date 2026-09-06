import React from 'react';
import { motion } from 'motion/react';
import { Users, ArrowLeft } from 'lucide-react';
import { Guest } from '../types';
import { GuestCard } from './GuestCard';

interface GuestsSectionProps {
  guests: Guest[];
  onSelectGuest: (guestId: string) => void;
  onViewAllGuests: () => void;
}

export const GuestsSection: React.FC<GuestsSectionProps> = ({
  guests,
  onSelectGuest,
  onViewAllGuests,
}) => {
  if (!guests || guests.length === 0) return null;

  return (
    <section id="guests-section" className="py-20 sm:py-28 bg-[#FAF9F5] border-b border-[#1B3B2B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3B2B]/10 text-[#1B3B2B] text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>راویان مسیر</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#12281D] tracking-tight mb-2">
              مهمان‌های چی شد حوزه؟
            </h2>
            <p className="text-base text-[#525E56] font-normal">
              چهره‌هایی از نسل‌های گوناگون؛ با سوابق تحصیلی، فکری و تجربیات زیسته متفاوت
            </p>
          </div>

          <button
            onClick={onViewAllGuests}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1B3B2B] hover:text-[#2E7D52] transition-colors self-start md:self-auto"
          >
            <span>مشاهده همه مهمان‌ها</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Guests Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {guests.slice(0, 4).map((guest) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              onSelect={onSelectGuest}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
