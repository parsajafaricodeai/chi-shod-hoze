import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Menu, X, ArrowUpRight, Play, Sparkles, Shield } from 'lucide-react';
import { useAppData } from '../context/DataContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const { settings } = useAppData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'خانه', path: '/' },
    { label: 'قسمت‌ها', path: '/episodes' },
    { label: 'مهمان‌ها', path: '/guests' },
    { label: 'کلیپ‌ها', path: '/clips' },
    { label: 'درباره برنامه', path: '/about' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF9F5]/90 backdrop-blur-md shadow-xs border-b border-[#1B3B2B]/10 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Right: Typography Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2.5 text-right group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1B3B2B] flex items-center justify-center text-white shadow-xs group-hover:bg-[#234F3A] transition-colors">
              <span className="font-black text-sm tracking-tight text-[#E2D8BE]">؟</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl text-[#12281D] tracking-tight group-hover:text-[#1B3B2B] transition-colors">
                چی شد حوزه؟
              </span>
              <span className="text-[10px] sm:text-xs text-[#5C6760] font-medium -mt-1 tracking-normal">
                برنامه گفت‌وگومحور و مستند
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 mr-4">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(link.path);
              return (
                <button
                  key={link.path}
                  id={`nav-link-${link.path.replace('/', '') || 'home'}`}
                  onClick={() => handleLinkClick(link.path)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive
                      ? 'text-[#1B3B2B] font-bold'
                      : 'text-[#4A554E] hover:text-[#12281D] hover:bg-[#1B3B2B]/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#1B3B2B] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Left: Actions (Search + Eitaa Follow + Mobile Menu Toggle) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search Button */}
          <button
            id="open-search-button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#4A554E] bg-white/80 hover:bg-white border border-[#1B3B2B]/10 hover:border-[#1B3B2B]/30 shadow-2xs transition-all hover:text-[#1B3B2B]"
            title="جستجو در قسمتها و مهمانها"
          >
            <Search className="w-4 h-4 text-[#1B3B2B]" />
            <span className="hidden lg:inline text-xs text-[#717E76]">جستجو...</span>
            <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 bg-[#FAF9F5] border border-stone-200 rounded text-stone-500">
              /
            </kbd>
          </button>

          {/* Eitaa Channel CTA Button */}
          <a
            id="eitaa-header-cta"
            href={settings.eitaaUrl || 'https://eitaa.com/chi_shod_hozeh'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#1B3B2B] hover:bg-[#234F3A] active:scale-98 transition-all shadow-xs group"
          >
            <span>دنبال کردن در ایتا</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          {/* Admin Panel Quick Access */}
          <button
            id="admin-nav-button"
            onClick={() => handleLinkClick('/admin')}
            title="پنل مدیریت برنامه"
            className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
              currentPath === '/admin'
                ? 'bg-[#1B3B2B] text-white border-[#1B3B2B]'
                : 'text-[#4A554E] hover:text-[#1B3B2B] bg-white/80 hover:bg-white border-[#1B3B2B]/10 hover:border-[#1B3B2B]/30'
            }`}
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#12281D] hover:bg-[#1B3B2B]/10 md:hidden transition-colors"
            aria-label="منوی سایت"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-b border-[#1B3B2B]/10 bg-[#FAF9F5]/98 backdrop-blur-xl px-4 pt-3 pb-6 shadow-md"
          >
            <div className="flex flex-col gap-1.5 py-2">
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? currentPath === '/'
                    : currentPath.startsWith(link.path);
                return (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-right text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1B3B2B]/10 text-[#1B3B2B] font-bold'
                        : 'text-[#363E39] hover:bg-[#1B3B2B]/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#1B3B2B]" />}
                  </button>
                );
              })}

              <button
                onClick={() => handleLinkClick('/admin')}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-right text-base font-medium transition-colors ${
                  currentPath === '/admin'
                    ? 'bg-[#1B3B2B] text-white font-bold'
                    : 'text-[#1B3B2B] bg-[#1B3B2B]/5 hover:bg-[#1B3B2B]/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>پنل مدیریت</span>
                </span>
                {currentPath === '/admin' && <span className="w-2 h-2 rounded-full bg-white" />}
              </button>

              <div className="pt-3 mt-2 border-t border-stone-200/80 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-[#4A554E] bg-white border border-stone-200"
                >
                  <Search className="w-4 h-4 text-[#1B3B2B]" />
                  <span>جستجو در برنامه و مهمان‌ها</span>
                </button>
                <a
                  href={settings.eitaaUrl || 'https://eitaa.com/chi_shod_hozeh'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#1B3B2B]"
                >
                  <span>کانال رسمی برنامه در ایتا</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
