import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Quote, Sparkles } from 'lucide-react';
import { Guest } from '../types';

interface GuestCardProps {
  guest: Guest;
  onSelect: (guestId: string) => void;
}

export const GuestCard: React.FC<GuestCardProps> = ({ guest, onSelect }) => {
  if (!guest) return null;

  const imageSrc =
    guest.image ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';

  return (
    <motion.div
      id={`guest-card-${guest.id}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(guest.id)}
      className="group relative rounded-3xl overflow-hidden bg-white border border-[#1B3B2B]/10 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Portrait Image with Vignette */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-stone-900">
        <img
          src={imageSrc}
          alt={guest.name || ''}
          className="w-full h-full object-cover grayscale-25 group-hover:grayscale-0 group-hover:scale-106 transition-all duration-700 ease-out"
          loading="lazy"
        />

        {/* Cinematic Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12281D]/90 via-[#12281D]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

        {/* Field of Expertise Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-medium border border-white/15">
            {guest.fieldOfExpertise}
          </span>
        </div>

        {/* Slide-up Quote on Hover (or persistent mobile) */}
        <div className="absolute bottom-3 right-3 left-3 text-right">
          <p className="text-white text-xs sm:text-sm font-medium line-clamp-2 leading-relaxed drop-shadow-md mb-1 italic opacity-90 group-hover:opacity-100">
            {guest.quote}
          </p>
          <div className="flex items-center justify-between text-[11px] text-[#C5A869] font-bold mt-2">
            <span>{guest.episodesCount} قسمت گفتگو</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              مشاهده پروفایل ←
            </span>
          </div>
        </div>
      </div>

      {/* Info Strip */}
      <div className="p-4 text-right bg-white flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#12281D] group-hover:text-[#1B3B2B] transition-colors">
            {guest.name}
          </h3>
          <p className="text-xs text-[#525E56] mt-0.5 line-clamp-1">
            {guest.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
