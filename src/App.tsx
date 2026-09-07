import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchOverlay } from './components/SearchOverlay';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { ClipModalPlayer } from './components/ClipModalPlayer';
import { HomePage } from './pages/HomePage';
import { EpisodesPage } from './pages/EpisodesPage';
import { EpisodeDetailPage } from './pages/EpisodeDetailPage';
import { GuestsPage } from './pages/GuestsPage';
import { GuestDetailPage } from './pages/GuestDetailPage';
import { ClipsPage } from './pages/ClipsPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { Episode, Clip } from './types';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [activeClip, setActiveClip] = useState<Clip | null>(null);

  // Sync with browser history popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global key listener for '/' search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !searchOpen &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlayEpisode = (episode: Episode) => {
    setActiveEpisode(episode);
  };

  const handleSelectEpisode = (episodeId: string) => {
    navigate(`/episodes/${episodeId}`);
  };

  const handleSelectGuest = (guestId: string) => {
    navigate(`/guests/${guestId}`);
  };

  const handlePlayClip = (clip: Clip) => {
    setActiveClip(clip);
  };

  // Route matching
  const renderRoute = () => {
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomePage
          onPlayEpisode={handlePlayEpisode}
          onSelectEpisode={handleSelectEpisode}
          onSelectGuest={handleSelectGuest}
          onPlayClip={handlePlayClip}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/episodes') {
      return (
        <EpisodesPage
          onPlayEpisode={handlePlayEpisode}
          onSelectEpisode={handleSelectEpisode}
        />
      );
    }

    if (currentPath.startsWith('/episodes/')) {
      const episodeId = currentPath.replace('/episodes/', '');
      return (
        <EpisodeDetailPage
          episodeId={episodeId}
          onPlayEpisode={handlePlayEpisode}
          onSelectEpisode={handleSelectEpisode}
          onSelectGuest={handleSelectGuest}
          onPlayClip={handlePlayClip}
          onBack={() => navigate('/episodes')}
        />
      );
    }

    if (currentPath === '/guests') {
      return <GuestsPage onSelectGuest={handleSelectGuest} />;
    }

    if (currentPath.startsWith('/guests/')) {
      const guestId = currentPath.replace('/guests/', '');
      return (
        <GuestDetailPage
          guestId={guestId}
          onSelectEpisode={handleSelectEpisode}
          onPlayEpisode={handlePlayEpisode}
          onBack={() => navigate('/guests')}
        />
      );
    }

    if (currentPath === '/clips') {
      return <ClipsPage onPlayClip={handlePlayClip} />;
    }

    if (currentPath === '/about') {
      return <AboutPage />;
    }

    if (currentPath === '/admin') {
      return <AdminPage onNavigate={navigate} />;
    }

    // Default fallback to HomePage
    return (
      <HomePage
        onPlayEpisode={handlePlayEpisode}
        onSelectEpisode={handleSelectEpisode}
        onSelectGuest={handleSelectGuest}
        onPlayClip={handlePlayClip}
        onNavigate={navigate}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1E2320] selection:bg-[#1B3B2B] selection:text-[#E8F5E9]">
      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Global Sticky Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Routed Page with Smooth Transition */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {renderRoute()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Minimalist Editorial Footer */}
      <Footer onNavigate={navigate} />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectEpisode={handleSelectEpisode}
        onSelectGuest={handleSelectGuest}
        onSelectClip={handlePlayClip}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        episode={activeEpisode}
        onClose={() => setActiveEpisode(null)}
        onGoToEpisodeDetail={handleSelectEpisode}
      />

      {/* Vertical 9:16 Clip Modal Player */}
      <ClipModalPlayer
        clip={activeClip}
        onClose={() => setActiveClip(null)}
        onGoToEpisode={handleSelectEpisode}
      />
    </div>
  );
}
