import React from 'react';
import { Hero } from '../components/Hero';
import { IntroSection } from '../components/IntroSection';
import { FeaturedEpisode } from '../components/FeaturedEpisode';
import { EpisodesSection } from '../components/EpisodesSection';
import { SignatureSection } from '../components/SignatureSection';
import { GuestsSection } from '../components/GuestsSection';
import { ClipsSection } from '../components/ClipsSection';
import { InteractiveQuiz } from '../components/InteractiveQuiz';
import { QuoteSlider } from '../components/QuoteSlider';
import { AboutSection } from '../components/AboutSection';
import { CtaSection } from '../components/CtaSection';
import { useAppData } from '../context/DataContext';
import { Episode, Clip } from '../types';

interface HomePageProps {
  onPlayEpisode: (episode: Episode) => void;
  onSelectEpisode: (episodeId: string) => void;
  onSelectGuest: (guestId: string) => void;
  onPlayClip: (clip: Clip) => void;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onPlayEpisode,
  onSelectEpisode,
  onSelectGuest,
  onPlayClip,
  onNavigate,
}) => {
  const { episodes, guests, clips } = useAppData();
  const featuredEpisode = episodes.find((e) => e.featured) || (episodes.length > 0 ? episodes[0] : null);

  const handleScrollToEpisodes = () => {
    const el = document.getElementById('episodes-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else onNavigate('/episodes');
  };

  const handleOpenEitaa = () => {
    window.open('https://eitaa.com/chi_shod_hozeh', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero
        onWatchEpisodes={handleScrollToEpisodes}
        onFollowEitaa={handleOpenEitaa}
      />

      {/* 2. Intro Section */}
      <IntroSection onLearnMore={() => onNavigate('/about')} />

      {/* 3. Featured Episode */}
      {featuredEpisode && (
        <FeaturedEpisode
          episode={featuredEpisode}
          onPlay={onPlayEpisode}
          onSelect={onSelectEpisode}
        />
      )}

      {/* 4. Episodes Section */}
      <EpisodesSection
        episodes={episodes}
        onPlay={onPlayEpisode}
        onSelect={onSelectEpisode}
        onViewAll={() => onNavigate('/episodes')}
      />

      {/* 5. Signature Section: چی شد؟ */}
      <SignatureSection />

      {/* 6. Guests Section */}
      <GuestsSection
        guests={guests}
        onSelectGuest={onSelectGuest}
        onViewAllGuests={() => onNavigate('/guests')}
      />

      {/* 7. Short Clips Section (9:16 Reels) */}
      <ClipsSection
        clips={clips}
        onPlayClip={onPlayClip}
        onViewAllClips={() => onNavigate('/clips')}
      />

      {/* 8. Interactive Experience */}
      <InteractiveQuiz onSelectEpisode={onSelectEpisode} />

      {/* 9. Quotes Slider */}
      <QuoteSlider onSelectEpisode={onSelectEpisode} />

      {/* 10. About Section & Timeline */}
      <AboutSection onGoToAboutPage={() => onNavigate('/about')} />

      {/* 11. Social CTA */}
      <CtaSection />
    </div>
  );
};
