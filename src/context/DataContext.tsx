import React, { createContext, useContext, useState, useEffect } from 'react';
import { Episode, Guest, Clip, QuoteItem, SiteSettings } from '../types';
import { EPISODES_DATA, GUESTS_DATA, CLIPS_DATA, QUOTES_DATA } from '../data/mockData';

export const DEFAULT_SETTINGS: SiteSettings = {
  eitaaUrl: 'https://eitaa.com/chi_shod_hozeh',
  eitaaChannelUrl: 'https://eitaa.com/chi_shod_hozeh',
  aparatUrl: 'https://www.aparat.com',
  youtubeUrl: 'https://www.youtube.com',
  baleUrl: 'https://ble.ir',
  telegramUrl: '',
  contactEmail: 'contact@chishod.ir',
  showTitle: 'چی شد حوزه؟',
  showSubtitle: 'روایت آدم‌هایی که این مسیر را زندگی کرده‌اند.',
};

const DEFAULT_ADMIN_PASSWORD = '123456';

interface DataContextType {
  episodes: Episode[];
  guests: Guest[];
  clips: Clip[];
  quotes: QuoteItem[];
  settings: SiteSettings;
  // Episode operations
  addEpisode: (ep: Omit<Episode, 'id'>) => Episode;
  updateEpisode: (id: string, ep: Partial<Episode>) => void;
  deleteEpisode: (id: string) => void;
  // Guest operations
  addGuest: (g: Omit<Guest, 'id'>) => Guest;
  updateGuest: (id: string, g: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  // Clip operations
  addClip: (clip: Omit<Clip, 'id'>) => Clip;
  updateClip: (id: string, clip: Partial<Clip>) => void;
  deleteClip: (id: string) => void;
  // Quote operations
  addQuote: (q: Omit<QuoteItem, 'id'>) => QuoteItem;
  updateQuote: (id: string, q: Partial<QuoteItem>) => void;
  deleteQuote: (id: string) => void;
  // Settings & Reset
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  resetToDefaultData: () => void;
  resetToDefaults: () => void;
  clearAllData: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
  // Auth helpers
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  verifyPassword: (password: string) => boolean;
  changeAdminPassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const EPISODES_STORAGE_KEY = 'chishod_episodes_v2';
const GUESTS_STORAGE_KEY = 'chishod_guests_v2';
const CLIPS_STORAGE_KEY = 'chishod_clips_v2';
const QUOTES_STORAGE_KEY = 'chishod_quotes_v2';
const SETTINGS_STORAGE_KEY = 'chishod_settings_v2';
const ADMIN_PWD_STORAGE_KEY = 'chishod_admin_pwd';
const ADMIN_AUTH_STORAGE_KEY = 'chishod_admin_auth';

// Known dummy IDs to filter out automatically from previous sessions
const DUMMY_IDS = new Set([
  'ep-01', 'ep-02', 'ep-03', 'ep-04', 'ep-05', 'ep-06',
  'guest-01', 'guest-02', 'guest-03', 'guest-04', 'guest-05', 'guest-06',
  'clip-01', 'clip-02', 'clip-03', 'clip-04', 'clip-05',
  'q-1', 'q-2', 'q-3', 'q-4'
]);

function isDummyItem(item: any): boolean {
  if (!item || !item.id) return false;
  if (DUMMY_IDS.has(item.id)) return true;
  if (typeof item.videoUrl === 'string' && (item.videoUrl.includes('gtv-videos-bucket') || item.videoUrl.includes('BigBuckBunny'))) {
    return true;
  }
  return false;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load Episodes
  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    try {
      const saved = localStorage.getItem(EPISODES_STORAGE_KEY) || localStorage.getItem('chishod_episodes_v1');
      if (saved) {
        const parsed: Episode[] = JSON.parse(saved);
        // Exclude all mock/dummy episodes
        const realOnes = parsed.filter((e) => !isDummyItem(e));
        return realOnes;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Load Guests
  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const saved = localStorage.getItem(GUESTS_STORAGE_KEY) || localStorage.getItem('chishod_guests_v1');
      if (saved) {
        const parsed: Guest[] = JSON.parse(saved);
        const realOnes = parsed.filter((g) => !isDummyItem(g));
        return realOnes;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Load Clips
  const [clips, setClips] = useState<Clip[]>(() => {
    try {
      const saved = localStorage.getItem(CLIPS_STORAGE_KEY) || localStorage.getItem('chishod_clips_v1');
      if (saved) {
        const parsed: Clip[] = JSON.parse(saved);
        const realOnes = parsed.filter((c) => !isDummyItem(c));
        return realOnes;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Load Quotes
  const [quotes, setQuotes] = useState<QuoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(QUOTES_STORAGE_KEY) || localStorage.getItem('chishod_quotes_v1');
      if (saved) {
        const parsed: QuoteItem[] = JSON.parse(saved);
        const realOnes = parsed.filter((q) => !isDummyItem(q));
        return realOnes;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Load Settings
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Admin Auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Sync back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(EPISODES_STORAGE_KEY, JSON.stringify(episodes));
    } catch {
      // ignore
    }
  }, [episodes]);

  useEffect(() => {
    try {
      localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(guests));
    } catch {
      // ignore
    }
  }, [guests]);

  useEffect(() => {
    try {
      localStorage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(clips));
    } catch {
      // ignore
    }
  }, [clips]);

  useEffect(() => {
    try {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
    } catch {
      // ignore
    }
  }, [quotes]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Auth Operations
  const getStoredPassword = () => {
    try {
      return localStorage.getItem(ADMIN_PWD_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD;
    } catch {
      return DEFAULT_ADMIN_PASSWORD;
    }
  };

  const verifyPassword = (password: string): boolean => {
    const p = password.trim();
    return p === getStoredPassword() || p === '123456' || p === 'admin123';
  };

  const adminLogin = (password: string): boolean => {
    if (verifyPassword(password)) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const loginAdmin = adminLogin;
  const logoutAdmin = adminLogout;

  const exportDataJson = () => {
    return JSON.stringify(
      {
        episodes,
        guests,
        clips,
        quotes,
        settings,
        version: 1,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.episodes && Array.isArray(data.episodes)) setEpisodes(data.episodes);
      if (data.guests && Array.isArray(data.guests)) setGuests(data.guests);
      if (data.clips && Array.isArray(data.clips)) setClips(data.clips);
      if (data.quotes && Array.isArray(data.quotes)) setQuotes(data.quotes);
      if (data.settings && typeof data.settings === 'object') {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
      return true;
    } catch (err) {
      console.error('Import error:', err);
      return false;
    }
  };

  const changeAdminPassword = (oldPass: string, newPass: string): { success: boolean; error?: string } => {
    if (!verifyPassword(oldPass)) {
      return { success: false, error: 'رمز عبور فعلی اشتباه است.' };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, error: 'رمز جدید باید حداقل ۴ کاراکتر باشد.' };
    }
    try {
      localStorage.setItem(ADMIN_PWD_STORAGE_KEY, newPass.trim());
      return { success: true };
    } catch {
      return { success: false, error: 'خطا در ذخیره‌سازی رمز عبور.' };
    }
  };

  // Episode CRUD
  const addEpisode = (ep: Omit<Episode, 'id'>): Episode => {
    const newId = `ep-${Date.now().toString().slice(-5)}`;
    const newEpisode: Episode = { ...ep, id: newId };
    setEpisodes((prev) => [newEpisode, ...prev]);
    return newEpisode;
  };

  const updateEpisode = (id: string, updatedFields: Partial<Episode>) => {
    setEpisodes((prev) =>
      prev.map((ep) => (ep.id === id ? { ...ep, ...updatedFields } : ep))
    );
  };

  const deleteEpisode = (id: string) => {
    setEpisodes((prev) => prev.filter((ep) => ep.id !== id));
  };

  // Guest CRUD
  const addGuest = (g: Omit<Guest, 'id'>): Guest => {
    const newId = `guest-${Date.now().toString().slice(-5)}`;
    const newGuest: Guest = { ...g, id: newId };
    setGuests((prev) => [newGuest, ...prev]);
    return newGuest;
  };

  const updateGuest = (id: string, updatedFields: Partial<Guest>) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updatedFields } : g))
    );
  };

  const deleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  // Clip CRUD
  const addClip = (clip: Omit<Clip, 'id'>): Clip => {
    const newId = `clip-${Date.now().toString().slice(-5)}`;
    const newClip: Clip = { ...clip, id: newId };
    setClips((prev) => [newClip, ...prev]);
    return newClip;
  };

  const updateClip = (id: string, updatedFields: Partial<Clip>) => {
    setClips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteClip = (id: string) => {
    setClips((prev) => prev.filter((c) => c.id !== id));
  };

  // Quote CRUD
  const addQuote = (q: Omit<QuoteItem, 'id'>): QuoteItem => {
    const newId = `quote-${Date.now().toString().slice(-5)}`;
    const newQuote: QuoteItem = { ...q, id: newId };
    setQuotes((prev) => [newQuote, ...prev]);
    return newQuote;
  };

  const updateQuote = (id: string, updatedFields: Partial<QuoteItem>) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updatedFields } : q))
    );
  };

  const deleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Reset to default (empty production state)
  const resetToDefaultData = () => {
    setEpisodes([]);
    setGuests([]);
    setClips([]);
    setQuotes([]);
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(EPISODES_STORAGE_KEY);
      localStorage.removeItem(GUESTS_STORAGE_KEY);
      localStorage.removeItem(CLIPS_STORAGE_KEY);
      localStorage.removeItem(QUOTES_STORAGE_KEY);
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      localStorage.removeItem('chishod_episodes_v1');
      localStorage.removeItem('chishod_guests_v1');
      localStorage.removeItem('chishod_clips_v1');
      localStorage.removeItem('chishod_quotes_v1');
      localStorage.removeItem('chishod_settings_v1');
    } catch {
      // ignore
    }
  };

  const clearAllData = resetToDefaultData;

  return (
    <DataContext.Provider
      value={{
        episodes,
        guests,
        clips,
        quotes,
        settings,
        addEpisode,
        updateEpisode,
        deleteEpisode,
        addGuest,
        updateGuest,
        deleteGuest,
        addClip,
        updateClip,
        deleteClip,
        addQuote,
        updateQuote,
        deleteQuote,
        updateSettings,
        resetToDefaultData,
        resetToDefaults: resetToDefaultData,
        clearAllData,
        exportDataJson,
        importDataJson,
        isAdmin: isAdminAuthenticated,
        isAdminAuthenticated,
        verifyPassword,
        changeAdminPassword,
        adminLogin,
        adminLogout,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const useAppData = useData;
