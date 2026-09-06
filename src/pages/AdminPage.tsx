import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Video,
  Users,
  Film,
  Link as LinkIcon,
  Shield,
  LogOut,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  Download,
  Upload,
  Globe,
  Star,
  Clock,
  HelpCircle,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useAppData } from '../context/DataContext';
import { Episode, Guest, Clip, CategoryKey } from '../types';
import { QuickAutoRegisterCard } from '../components/admin/QuickAutoRegisterCard';
import { fetchVideoAutoInfo } from '../services/videoService';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

type AdminTab = 'episodes' | 'guests' | 'clips' | 'links' | 'security';

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const {
    episodes,
    guests,
    clips,
    settings,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    addGuest,
    updateGuest,
    deleteGuest,
    addClip,
    updateClip,
    deleteClip,
    updateSettings,
    resetToDefaults,
    exportDataJson,
    importDataJson,
  } = useAppData();

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin view state
  const [activeTab, setActiveTab] = useState<AdminTab>('episodes');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const [isClipModalOpen, setIsClipModalOpen] = useState(false);
  const [editingClip, setEditingClip] = useState<Clip | null>(null);

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'episode' | 'guest' | 'clip';
    id: string;
    title: string;
  } | null>(null);

  // Links & Settings state
  const [settingsForm, setSettingsForm] = useState({
    eitaaUrl: settings.eitaaUrl,
    aparatUrl: settings.aparatUrl,
    youtubeUrl: settings.youtubeUrl,
    telegramUrl: settings.telegramUrl,
    contactEmail: settings.contactEmail,
  });

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ success?: boolean; msg?: string } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginAdmin(passwordInput);
    if (success) {
      setPasswordInput('');
      showToast('با موفقیت وارد پنل مدیریت شدید');
    } else {
      setLoginError('رمز عبور نادرست است. رمز پیش‌فرض: 123456');
    }
  };

  // --- Episode Form State ---
  const [episodeForm, setEpisodeForm] = useState<Partial<Episode>>({
    number: '',
    title: '',
    guest: '',
    guestRole: '',
    guestAvatar: '',
    thumbnail: '',
    videoUrl: '',
    duration: '۴۵ دقیقه',
    description: '',
    topics: [],
    quote: '',
    publishedAt: 'امروز',
    category: 'scholars',
    viewsCount: 1000,
    featured: false,
    takeaways: [],
  });
  const [topicsInput, setTopicsInput] = useState('');
  const [takeawaysInput, setTakeawaysInput] = useState('');
  const [isAutoFillingEpisode, setIsAutoFillingEpisode] = useState(false);

  const handleAutoFillEpisode = async () => {
    if (!episodeForm.videoUrl?.trim()) {
      showToast('لطفاً ابتدا لینک ویدیو را در کادر پایین وارد کنید');
      return;
    }
    setIsAutoFillingEpisode(true);
    try {
      const data = await fetchVideoAutoInfo(episodeForm.videoUrl, episodeForm.title, 'episode');
      setEpisodeForm((prev) => ({
        ...prev,
        title: data.title || prev.title,
        guest: data.guest || prev.guest,
        guestRole: data.guestRole || prev.guestRole,
        duration: data.duration || prev.duration,
        description: data.description || prev.description,
        quote: data.quote || prev.quote,
        thumbnail: data.thumbnail || prev.thumbnail,
        guestAvatar: data.guestAvatar || prev.guestAvatar,
        category: data.category || prev.category,
      }));
      if (data.topics && data.topics.length > 0) {
        setTopicsInput(data.topics.join('، '));
      }
      if (data.takeaways && data.takeaways.length > 0) {
        setTakeawaysInput(data.takeaways.join('\n'));
      }
      showToast('اطلاعات با موفقیت از لینک استخراج شد و فرم تکمیل گردید!');
    } catch {
      showToast('خطا در استخراج اطلاعات از لینک ویدیو');
    } finally {
      setIsAutoFillingEpisode(false);
    }
  };

  const openAddEpisodeModal = () => {
    setEditingEpisode(null);
    const nextEpNum = String(episodes.length + 1).padStart(2, '0');
    setEpisodeForm({
      number: nextEpNum,
      title: '',
      guest: guests[0]?.name || '',
      guestRole: guests[0]?.role || '',
      guestAvatar: guests[0]?.image || '',
      thumbnail: '',
      videoUrl: '',
      duration: '۴۵ دقیقه',
      description: '',
      topics: [],
      quote: '',
      publishedAt: 'امروز',
      category: 'scholars',
      viewsCount: 1200,
      featured: false,
      takeaways: [],
    });
    setTopicsInput('');
    setTakeawaysInput('');
    setIsEpisodeModalOpen(true);
  };

  const openEditEpisodeModal = (ep: Episode) => {
    setEditingEpisode(ep);
    setEpisodeForm(ep);
    setTopicsInput(ep.topics ? ep.topics.join('، ') : '');
    setTakeawaysInput(ep.takeaways ? ep.takeaways.join('\n') : '');
    setIsEpisodeModalOpen(true);
  };

  const handleSaveEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!episodeForm.title || !episodeForm.guest) {
      alert('لطفاً عنوان و نام مهمان را وارد کنید');
      return;
    }

    const topicsArray = topicsInput
      .split(/،|,/)
      .map((t) => t.trim())
      .filter(Boolean);

    const takeawaysArray = takeawaysInput
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    const dataToSave = {
      ...episodeForm,
      topics: topicsArray.length ? topicsArray : ['گفتگوی صریح', 'روایت مسیر طلبگی'],
      takeaways: takeawaysArray.length ? takeawaysArray : ['درس‌آموخته‌های زیست حوزوی'],
    } as Omit<Episode, 'id'>;

    if (editingEpisode) {
      updateEpisode(editingEpisode.id, dataToSave);
      showToast(`قسمت «${dataToSave.title}» به‌روزرسانی شد`);
    } else {
      addEpisode(dataToSave);
      showToast(`قسمت جدید «${dataToSave.title}» اضافه شد`);
    }

    setIsEpisodeModalOpen(false);
  };

  // --- Guest Form State ---
  const [guestForm, setGuestForm] = useState<Partial<Guest>>({
    name: '',
    role: '',
    image: '',
    bio: '',
    fieldOfExpertise: '',
    quote: '',
    episodesCount: 1,
    episodeIds: [],
    keyMoment: '',
  });

  const openAddGuestModal = () => {
    setEditingGuest(null);
    setGuestForm({
      name: '',
      role: '',
      image: '',
      bio: '',
      fieldOfExpertise: '',
      quote: '',
      episodesCount: 1,
      episodeIds: [],
      keyMoment: '',
    });
    setIsGuestModalOpen(true);
  };

  const openEditGuestModal = (guest: Guest) => {
    setEditingGuest(guest);
    setGuestForm(guest);
    setIsGuestModalOpen(true);
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.name || !guestForm.role) {
      alert('لطفاً نام و سمت مهمان را مشخص کنید');
      return;
    }

    const dataToSave = {
      ...guestForm,
      name: guestForm.name.trim(),
      role: guestForm.role.trim(),
      image: guestForm.image?.trim() || '',
      bio: guestForm.bio?.trim() || '',
      fieldOfExpertise: guestForm.fieldOfExpertise?.trim() || 'فقه و اصول',
      quote: guestForm.quote?.trim() || '',
      keyMoment: guestForm.keyMoment?.trim() || '',
      episodesCount: guestForm.episodesCount || 1,
      episodeIds: guestForm.episodeIds || [],
    } as Omit<Guest, 'id'>;

    if (editingGuest) {
      updateGuest(editingGuest.id, dataToSave);
      showToast(`اطلاعات «${dataToSave.name}» به‌روزرسانی شد`);
    } else {
      addGuest(dataToSave);
      showToast(`مهمان «${dataToSave.name}» اضافه شد`);
    }

    setIsGuestModalOpen(false);
  };

  // --- Clip Form State ---
  const [clipForm, setClipForm] = useState<Partial<Clip>>({
    title: '',
    thumbnail: '',
    videoUrl: '',
    guest: '',
    guestRole: '',
    duration: '۰۲:۳۰',
    episodeId: '',
    views: '۱.۲ هزار',
    highlightCategory: 'تصورات اولیه',
  });
  const [isAutoFillingClip, setIsAutoFillingClip] = useState(false);

  const handleAutoFillClip = async () => {
    if (!clipForm.videoUrl?.trim()) {
      showToast('لطفاً ابتدا لینک ویدیو را وارد کنید');
      return;
    }
    setIsAutoFillingClip(true);
    try {
      const data = await fetchVideoAutoInfo(clipForm.videoUrl, clipForm.title, 'clip');
      setClipForm((prev) => ({
        ...prev,
        title: data.title || prev.title,
        guest: data.guest || prev.guest,
        guestRole: data.guestRole || prev.guestRole,
        duration: data.duration || prev.duration,
        thumbnail: data.thumbnail || prev.thumbnail,
        highlightCategory: data.highlightCategory || prev.highlightCategory,
      }));
      showToast('اطلاعات کلیپ با موفقیت استخراج و تکمیل شد!');
    } catch {
      showToast('خطا در استخراج اطلاعات کلیپ');
    } finally {
      setIsAutoFillingClip(false);
    }
  };

  const openAddClipModal = () => {
    setEditingClip(null);
    setClipForm({
      title: '',
      thumbnail: '',
      videoUrl: '',
      guest: guests[0]?.name || '',
      guestRole: guests[0]?.role || '',
      duration: '۰۲:۳۰',
      episodeId: episodes[0]?.id || '',
      views: '۱.۲ هزار',
      highlightCategory: 'تصورات اولیه',
    });
    setIsClipModalOpen(true);
  };

  const openEditClipModal = (clip: Clip) => {
    setEditingClip(clip);
    setClipForm(clip);
    setIsClipModalOpen(true);
  };

  const handleSaveClip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clipForm.title || !clipForm.guest) {
      alert('لطفاً عنوان و نام مهمان کلیپ را مشخص کنید');
      return;
    }

    const dataToSave = {
      ...clipForm,
      title: clipForm.title.trim(),
      videoUrl: clipForm.videoUrl?.trim() || '',
      thumbnail: clipForm.thumbnail?.trim() || '',
      guest: clipForm.guest.trim(),
      guestRole: clipForm.guestRole?.trim() || '',
      duration: clipForm.duration?.trim() || '۰۱:۴۵',
      episodeId: clipForm.episodeId || episodes[0]?.id || '',
      views: clipForm.views || '۹۰۰',
      highlightCategory: clipForm.highlightCategory || 'گزیده',
    } as Omit<Clip, 'id'>;

    if (editingClip) {
      updateClip(editingClip.id, dataToSave);
      showToast(`کلیپ «${dataToSave.title}» به‌روزرسانی شد`);
    } else {
      addClip(dataToSave);
      showToast(`کلیپ «${dataToSave.title}» اضافه شد`);
    }

    setIsClipModalOpen(false);
  };

  // Delete confirmation
  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return;
    const { type, id, title } = deleteConfirmTarget;

    if (type === 'episode') {
      deleteEpisode(id);
      showToast(`قسمت «${title}» با موفقیت حذف شد`);
    } else if (type === 'guest') {
      deleteGuest(id);
      showToast(`مهمان «${title}» با موفقیت حذف شد`);
    } else if (type === 'clip') {
      deleteClip(id);
      showToast(`کلیپ «${title}» با موفقیت حذف شد`);
    }

    setDeleteConfirmTarget(null);
  };

  // Save general settings (Eitaa, social, contacts)
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    showToast('لینک‌ها و تنظیمات با موفقیت ذخیره شدند');
  };

  // Change password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus(null);
    if (newPass !== confirmPass) {
      setPasswordChangeStatus({ success: false, msg: 'رمز جدید و تکرار آن یکسان نیستند.' });
      return;
    }
    const res = changeAdminPassword(oldPass, newPass);
    if (res.success) {
      setPasswordChangeStatus({ success: true, msg: 'رمز عبور مدیر با موفقیت تغییر یافت.' });
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      showToast('رمز عبور مدیر به‌روزرسانی شد');
    } else {
      setPasswordChangeStatus({ success: false, msg: res.error || 'خطا در تغییر رمز' });
    }
  };

  // Backup download & upload
  const handleDownloadBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chi_shod_hozeh_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('فایل پشتیبان با موفقیت دانلود شد');
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDataJson(content);
        if (ok) {
          showToast('اطلاعات پشتیبان با موفقیت بازنشانی شد');
        } else {
          alert('فرمت فایل نامعتبر است.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered items based on search query
  const filteredEpisodes = episodes.filter(
    (ep) =>
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.number.includes(searchQuery)
  );

  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.fieldOfExpertise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClips = clips.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.highlightCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If not logged in, show elegant Login screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center items-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200/80 p-8 text-right"
        >
          {/* Brand header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#1B3B2B] text-white flex items-center justify-center shadow-sm">
              <Lock className="w-6 h-6 text-[#E2D8BE]" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-center text-[#12281D] mb-1">
            ورود به پنل مدیریت
          </h1>
          <p className="text-xs text-center text-[#5C6760] mb-8">
            برنامه گفت‌وگومحور و مستند «چی شد حوزه؟»
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#12281D] mb-2">
                رمز عبور مدیر
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="رمز عبور را وارد کنید..."
                  autoFocus
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-[#FAF9F5] border border-stone-200 text-sm text-[#12281D] focus:outline-hidden focus:border-[#1B3B2B] focus:bg-white transition-all text-left dir-ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Hint for initial access */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold ml-1">💡 رمز پیش‌فرض مدیر:</span>
              <code className="bg-amber-100 px-2 py-0.5 rounded font-mono font-bold text-amber-950">
                123456
              </code>
              <span className="block mt-1 text-[11px] text-amber-800">
                پس از ورود، از تب «امنیت» می‌توانید رمز را تغییر دهید.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#1B3B2B] hover:bg-[#234F3A] text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>ورود به پنل</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-center">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#5C6760] hover:text-[#1B3B2B] transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>بازگشت به صفحه اصلی سایت</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin is Logged In - Dashboard UI
  return (
    <div className="min-h-screen bg-[#F7F6F0] pb-24 text-right">
      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-[#1B3B2B] text-white shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-white/20"
          >
            <CheckCircle2 className="w-4 h-4 text-[#C5A869]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Admin Navigation Bar */}
      <header className="bg-[#12281D] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#E2D8BE] font-black">
              ؟
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white">
                  پنل مدیریت «چی شد حوزه؟»
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#C5A869] text-[#12281D] font-bold text-[10px]">
                  مدیر کل
                </span>
              </div>
              <span className="text-[11px] text-stone-300 block">
                مدیریت قسمت‌ها، مهمان‌ها، کلیپ‌ها و لینک‌های سایت
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <span>مشاهده سایت</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold text-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#5C6760] font-medium">کل قسمت‌ها</span>
              <Video className="w-4 h-4 text-[#1B3B2B]" />
            </div>
            <div className="text-2xl font-black text-[#12281D]">
              {episodes.length}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#5C6760] font-medium">مهمان‌های برنامه</span>
              <Users className="w-4 h-4 text-[#C5A869]" />
            </div>
            <div className="text-2xl font-black text-[#12281D]">
              {guests.length}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#5C6760] font-medium">کلیپ‌های کوتاه</span>
              <Film className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-[#12281D]">
              {clips.length}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#5C6760] font-medium">کانال اصلی ایتا</span>
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xs font-bold text-[#1B3B2B] truncate dir-ltr text-right">
              {settings.eitaaUrl.replace('https://', '')}
            </div>
          </div>
        </div>

        {/* Quick Auto-Register Video Hub (No manual typing required) */}
        <QuickAutoRegisterCard
          guests={guests}
          episodesCount={episodes.length}
          addGuest={addGuest}
          addEpisode={addEpisode}
          addClip={addClip}
          showToast={showToast}
        />

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-stone-200/80 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('episodes')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'episodes'
                  ? 'bg-[#1B3B2B] text-white shadow-xs'
                  : 'text-[#4A554E] hover:bg-stone-100'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>قسمت‌ها ({episodes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('guests')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'guests'
                  ? 'bg-[#1B3B2B] text-white shadow-xs'
                  : 'text-[#4A554E] hover:bg-stone-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>مهمان‌ها ({guests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('clips')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'clips'
                  ? 'bg-[#1B3B2B] text-white shadow-xs'
                  : 'text-[#4A554E] hover:bg-stone-100'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>کلیپ‌های کوتاه ({clips.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('links')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'links'
                  ? 'bg-[#1B3B2B] text-white shadow-xs'
                  : 'text-[#4A554E] hover:bg-stone-100'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>لینک‌ها و شبکه‌ها</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-[#1B3B2B] text-white shadow-xs'
                  : 'text-[#4A554E] hover:bg-stone-100'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>امنیت و پشتیبان</span>
            </button>
          </div>

          {/* Action button corresponding to active tab */}
          <div className="w-full sm:w-auto flex items-center justify-end gap-2">
            {activeTab === 'episodes' && (
              <button
                onClick={openAddEpisodeModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#234F3A] text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن قسمت جدید</span>
              </button>
            )}

            {activeTab === 'guests' && (
              <button
                onClick={openAddGuestModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#234F3A] text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن مهمان جدید</span>
              </button>
            )}

            {activeTab === 'clips' && (
              <button
                onClick={openAddClipModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#234F3A] text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن کلیپ جدید</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content 1: EPISODES */}
        {activeTab === 'episodes' && (
          <div className="space-y-4">
            {/* Search filter */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs flex items-center gap-3">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در عنوان قسمت، نام مهمان یا شماره..."
                className="w-full text-sm bg-transparent border-none focus:outline-hidden text-[#12281D]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-stone-400 hover:text-stone-600"
                >
                  پاک کردن
                </button>
              )}
            </div>

            {/* Episodes List Table / Cards */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-[#FAF9F5] border-b border-stone-200 text-xs text-[#5C6760] font-bold">
                    <tr>
                      <th className="py-3.5 px-4">شماره</th>
                      <th className="py-3.5 px-4">تصویر</th>
                      <th className="py-3.5 px-4">عنوان و مهمان</th>
                      <th className="py-3.5 px-4">مدت</th>
                      <th className="py-3.5 px-4">دسته‌بندی</th>
                      <th className="py-3.5 px-4">لینک ویدیو</th>
                      <th className="py-3.5 px-4 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredEpisodes.map((ep) => (
                      <tr key={ep.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#1B3B2B]">
                          {ep.number}
                        </td>
                        <td className="py-3.5 px-4">
                          <img
                            src={ep.thumbnail}
                            alt={ep.title}
                            className="w-16 h-10 object-cover rounded-lg border border-stone-200"
                          />
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-[#12281D] truncate" title={ep.title}>
                            {ep.title}
                          </div>
                          <div className="text-xs text-[#5C6760] truncate">{ep.guest}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-stone-600">{ep.duration}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#1B3B2B]/5 text-[#1B3B2B]">
                            {ep.category === 'scholars'
                              ? 'اساتید حوزه'
                              : ep.category === 'managers'
                              ? 'مدیران'
                              : ep.category === 'figures'
                              ? 'چهره‌ها'
                              : 'ویژه'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <span
                            className="text-[11px] font-mono text-stone-500 truncate block dir-ltr text-right hover:text-[#1B3B2B]"
                            title={ep.videoUrl}
                          >
                            {ep.videoUrl}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onNavigate(`/episodes/${ep.id}`)}
                              title="مشاهده قسمت در سایت"
                              className="p-1.5 rounded-lg text-stone-500 hover:text-[#1B3B2B] hover:bg-stone-100 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => openEditEpisodeModal(ep)}
                              title="ویرایش قسمت و لینک‌ها"
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() =>
                                setDeleteConfirmTarget({
                                  type: 'episode',
                                  id: ep.id,
                                  title: ep.title,
                                })
                              }
                              title="حذف قسمت"
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredEpisodes.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-500 text-sm">
                          هیچ قسمتی یافت نشد.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: GUESTS */}
        {activeTab === 'guests' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs flex items-center gap-3">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در نام، سمت یا تخصص مهمان..."
                className="w-full text-sm bg-transparent border-none focus:outline-hidden text-[#12281D]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={guest.image}
                      alt={guest.name}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-[#12281D] truncate">
                        {guest.name}
                      </h4>
                      <p className="text-xs text-[#5C6760] line-clamp-1">{guest.role}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold text-[#1B3B2B] bg-[#1B3B2B]/10 px-2 py-0.5 rounded-md">
                        {guest.fieldOfExpertise}
                      </span>
                    </div>
                  </div>

                  {guest.quote && (
                    <p className="text-xs text-stone-600 bg-[#FAF9F5] p-2.5 rounded-xl mb-3 line-clamp-2 italic">
                      {guest.quote}
                    </p>
                  )}

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate(`/guests/${guest.id}`)}
                      className="text-xs text-[#1B3B2B] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>صفحه مهمان</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditGuestModal(guest)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="ویرایش اطلاعات مهمان"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteConfirmTarget({
                            type: 'guest',
                            id: guest.id,
                            title: guest.name,
                          })
                        }
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="حذف مهمان"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: CLIPS */}
        {activeTab === 'clips' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs flex items-center gap-3">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در کلیپ‌ها یا نام مهمان..."
                className="w-full text-sm bg-transparent border-none focus:outline-hidden text-[#12281D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredClips.map((clip) => (
                <div
                  key={clip.id}
                  className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-4/3 bg-stone-100">
                    <img
                      src={clip.thumbnail}
                      alt={clip.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                      {clip.duration}
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#1B3B2B]/90 text-white text-[10px] font-bold">
                      {clip.highlightCategory}
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-[#12281D] line-clamp-2 mb-1">
                        {clip.title}
                      </h4>
                      <p className="text-[11px] text-[#5C6760]">{clip.guest}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400 font-mono truncate max-w-[120px] dir-ltr text-right">
                        {clip.videoUrl.slice(-25)}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditClipModal(clip)}
                          className="p-1 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="ویرایش کلیپ و لینک"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirmTarget({
                              type: 'clip',
                              id: clip.id,
                              title: clip.title,
                            })
                          }
                          className="p-1 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="حذف کلیپ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 4: LINKS & CHANNELS */}
        {activeTab === 'links' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-[#1B3B2B]/10 flex items-center justify-center text-[#1B3B2B]">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#12281D]">
                    تنظیمات لینک‌ها و کانال‌های رسمی
                  </h3>
                  <p className="text-xs text-[#5C6760]">
                    هر لینکی را که اینجا تغییر دهید، فوراً در تمام بخش‌ها (هدر، دکمه‌های دنبال کردن، فوتر و...) به‌روز می‌شود.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#12281D] mb-1.5">
                    لینک کانال رسمی در پیام‌رسان ایتا (مهم‌ترین کانال برنامه)
                  </label>
                  <input
                    type="url"
                    value={settingsForm.eitaaUrl}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, eitaaUrl: e.target.value })
                    }
                    placeholder="https://eitaa.com/chi_shod_hozeh"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-[#12281D] focus:outline-hidden focus:border-[#1B3B2B] text-left dir-ltr"
                    required
                  />
                  <span className="text-[11px] text-stone-500 block mt-1">
                    دکمه «دنبال کردن در ایتا» در هدر و کارت‌ها به این آدرس متصل است.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#12281D] mb-1.5">
                      لینک کانال آپارات (Aparat)
                    </label>
                    <input
                      type="url"
                      value={settingsForm.aparatUrl}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, aparatUrl: e.target.value })
                      }
                      placeholder="https://www.aparat.com/..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-[#12281D] focus:outline-hidden focus:border-[#1B3B2B] text-left dir-ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#12281D] mb-1.5">
                      لینک کانال یوتیوب (YouTube)
                    </label>
                    <input
                      type="url"
                      value={settingsForm.youtubeUrl}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })
                      }
                      placeholder="https://youtube.com/..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-[#12281D] focus:outline-hidden focus:border-[#1B3B2B] text-left dir-ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#12281D] mb-1.5">
                      لینک کانال تلگرام / سایر
                    </label>
                    <input
                      type="url"
                      value={settingsForm.telegramUrl}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, telegramUrl: e.target.value })
                      }
                      placeholder="https://t.me/..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-[#12281D] focus:outline-hidden focus:border-[#1B3B2B] text-left dir-ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#12281D] mb-1.5">
                      ایمیل ارتباط و دریافت نظرات
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                      }
                      placeholder="contact@chishod-hozeh.ir"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-[#12281D] focus:outline-hidden focus:border-[#1B3B2B] text-left dir-ltr"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#234F3A] text-white font-bold text-sm shadow-sm transition-all"
                  >
                    ذخیره تغییرات لینک‌ها
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab Content 5: SECURITY & BACKUP */}
        {activeTab === 'security' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Password Change Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#12281D]">
                    تغییر رمز عبور مدیر
                  </h3>
                  <p className="text-xs text-[#5C6760]">
                    رمز جدید را با دقت انتخاب کنید تا دسترسی شما محفوظ بماند.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#12281D] mb-1.5">
                    رمز عبور فعلی
                  </label>
                  <input
                    type="password"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    required
                    placeholder="رمز عبور فعلی خود را وارد کنید"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-[#12281D] focus:outline-hidden focus:border-[#1B3B2B] text-left dir-ltr"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#12281D] mb-1.5">
                      رمز عبور جدید
                    </label>
                    <input
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      required
                      placeholder="حداقل ۴ کاراکتر"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-[#12281D] focus:outline-hidden focus:border-[#1B3B2B] text-left dir-ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#12281D] mb-1.5">
                      تکرار رمز عبور جدید
                    </label>
                    <input
                      type="password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      required
                      placeholder="تکرار رمز جدید"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-[#12281D] focus:outline-hidden focus:border-[#1B3B2B] text-left dir-ltr"
                    />
                  </div>
                </div>

                {passwordChangeStatus && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      passwordChangeStatus.success
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}
                  >
                    {passwordChangeStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{passwordChangeStatus.msg}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#234F3A] text-white font-bold text-sm shadow-sm transition-all"
                  >
                    ثبت رمز جدید
                  </button>
                </div>
              </form>
            </div>

            {/* Backup & Restore Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#12281D]">
                    پشتیبان‌گیری و بازیابی اطلاعات
                  </h3>
                  <p className="text-xs text-[#5C6760]">
                    می‌توانید کل محتوا (قسمت‌ها، مهمان‌ها، کلیپ‌ها و لینک‌ها) را به صورت فایل JSON دانلود یا بارگذاری کنید.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={handleDownloadBackup}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF9F5] border border-stone-300 hover:border-[#1B3B2B] text-[#12281D] text-xs font-bold transition-all"
                >
                  <Download className="w-4 h-4 text-[#1B3B2B]" />
                  <span>دانلود فایل پشتیبان (JSON)</span>
                </button>

                <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF9F5] border border-stone-300 hover:border-[#1B3B2B] text-[#12281D] text-xs font-bold transition-all cursor-pointer">
                  <Upload className="w-4 h-4 text-[#1B3B2B]" />
                  <span>بارگذاری و بازیابی از فایل</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleUploadBackup}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Reset to initial mock data */}
              <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-xs text-red-600 block">
                    بازنشانی به داده‌های پیش‌فرض
                  </span>
                  <span className="text-[11px] text-stone-500">
                    در صورتی که می‌خواهید تمام تغییرات پاک شده و داده‌های اولیه بازگردند.
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (confirm('آیا مطمئن هستید؟ تمام تغییرات داده‌های محلی پاک شده و به حالت اولیه بازمی‌گردد.')) {
                      resetToDefaults();
                      showToast('داده‌های سایت به حالت اولیه بازنشانی شدند');
                    }
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>بازنشانی به حالت پیش‌فرض</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL: EPISODE ADD / EDIT --- */}
      <AnimatePresence>
        {isEpisodeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col my-8"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#12281D]">
                  {editingEpisode ? `ویرایش قسمت ${editingEpisode.number}` : 'افزودن قسمت جدید به برنامه'}
                </h3>
                <button
                  onClick={() => setIsEpisodeModalOpen(false)}
                  className="text-stone-400 hover:text-stone-600 font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveEpisode} className="p-6 overflow-y-auto space-y-4 text-xs text-right">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">
                      شماره قسمت (مانند ۰۷)
                    </label>
                    <input
                      type="text"
                      value={episodeForm.number}
                      onChange={(e) => setEpisodeForm({ ...episodeForm, number: e.target.value })}
                      required
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#12281D] mb-1">
                      عنوان قسمت
                    </label>
                    <input
                      type="text"
                      value={episodeForm.title}
                      onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })}
                      required
                      placeholder="مثال: تصمیمی بر خلاف جریان؛ وقتی مهندسی را رها کردم"
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">
                      نام مهمان
                    </label>
                    <input
                      type="text"
                      value={episodeForm.guest}
                      onChange={(e) => setEpisodeForm({ ...episodeForm, guest: e.target.value })}
                      required
                      placeholder="مثال: حجت‌الاسلام دکتر سید رضا حسینی"
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">
                      نقش / سمت مهمان
                    </label>
                    <input
                      type="text"
                      value={episodeForm.guestRole}
                      onChange={(e) => setEpisodeForm({ ...episodeForm, guestRole: e.target.value })}
                      placeholder="مثال: استاد سطوح عالی و پژوهشگر فلسفه"
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Video URL & Thumbnail */}
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#12281D]">
                      لینک ویدیو و تنظیمات پخش
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillEpisode}
                      disabled={isAutoFillingEpisode || !episodeForm.videoUrl?.trim()}
                      className="px-3 py-1.5 rounded-lg bg-[#1B3B2B] hover:bg-[#234F3A] disabled:bg-stone-200 disabled:text-stone-400 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isAutoFillingEpisode ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>در حال استخراج خودکار...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#E2D8BE]" />
                          <span>⚡ استخراج و پر کردن خودکار فرم از لینک</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <label className="block font-bold text-[#12281D] mb-1 flex items-center justify-between">
                      <span>لینک فایل یا پخش ویدیو (Video URL)</span>
                      <span className="text-[10px] text-stone-500 font-normal">
                        فرمت‌های مستقیم MP4 یا لینک آپارات/یوتیوب
                      </span>
                    </label>
                    <input
                      type="url"
                      value={episodeForm.videoUrl}
                      onChange={(e) => setEpisodeForm({ ...episodeForm, videoUrl: e.target.value })}
                      required
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:border-[#1B3B2B] focus:outline-hidden dir-ltr text-left font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#12281D] mb-1">
                        لینک تصویر شاخص / پوستر (Thumbnail URL)
                      </label>
                      <input
                        type="url"
                        value={episodeForm.thumbnail}
                        onChange={(e) => setEpisodeForm({ ...episodeForm, thumbnail: e.target.value })}
                        required
                        placeholder="https://..."
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:border-[#1B3B2B] focus:outline-hidden dir-ltr text-left font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#12281D] mb-1">
                        لینک عکس پرتره مهمان (Guest Avatar URL)
                      </label>
                      <input
                        type="url"
                        value={episodeForm.guestAvatar}
                        onChange={(e) => setEpisodeForm({ ...episodeForm, guestAvatar: e.target.value })}
                        placeholder="https://..."
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:border-[#1B3B2B] focus:outline-hidden dir-ltr text-left font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">
                      مدت زمان
                    </label>
                    <input
                      type="text"
                      value={episodeForm.duration}
                      onChange={(e) => setEpisodeForm({ ...episodeForm, duration: e.target.value })}
                      placeholder="مثال: ۴۸ دقیقه"
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">
                      دسته‌بندی
                    </label>
                    <select
                      value={episodeForm.category}
                      onChange={(e) =>
                        setEpisodeForm({ ...episodeForm, category: e.target.value as CategoryKey })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    >
                      <option value="scholars">اساتید حوزه</option>
                      <option value="managers">مدیران و مسئولان</option>
                      <option value="figures">شخصیت‌ها و چهره‌ها</option>
                      <option value="special">ویژه‌برنامه‌ها</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">
                      تاریخ انتشار
                    </label>
                    <input
                      type="text"
                      value={episodeForm.publishedAt}
                      onChange={(e) => setEpisodeForm({ ...episodeForm, publishedAt: e.target.value })}
                      placeholder="مثال: ۱۴ دی ۱۴۰۴"
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#12281D] mb-1">
                    جمله و نقل‌قول شاخص این قسمت
                  </label>
                  <textarea
                    rows={2}
                    value={episodeForm.quote}
                    onChange={(e) => setEpisodeForm({ ...episodeForm, quote: e.target.value })}
                    placeholder="«روزی که پرونده‌ام را گرفتم...»"
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#12281D] mb-1">
                    خلاصه و توضیحات این قسمت
                  </label>
                  <textarea
                    rows={3}
                    value={episodeForm.description}
                    onChange={(e) => setEpisodeForm({ ...episodeForm, description: e.target.value })}
                    placeholder="در این قسمت پای صحبت‌های..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#12281D] mb-1">
                    موضوعات و برچسب‌ها (با کاما یا ویرگول جدا کنید)
                  </label>
                  <input
                    type="text"
                    value={topicsInput}
                    onChange={(e) => setTopicsInput(e.target.value)}
                    placeholder="تغییر رشته، سختی‌های معیشت، زندگی در حجره"
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#12281D] mb-1">
                    نکات کلیدی و درس‌آموخته‌ها (هر نکته در یک سطر جدید)
                  </label>
                  <textarea
                    rows={2}
                    value={takeawaysInput}
                    onChange={(e) => setTakeawaysInput(e.target.value)}
                    placeholder="چگونه بحران هویت به نقطه عطف تبدیل شد&#10;تفاوت نظام سنتی با دانشگاه"
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="ep-featured-checkbox"
                    checked={episodeForm.featured || false}
                    onChange={(e) => setEpisodeForm({ ...episodeForm, featured: e.target.checked })}
                    className="rounded text-[#1B3B2B]"
                  />
                  <label htmlFor="ep-featured-checkbox" className="font-bold text-[#12281D] cursor-pointer">
                    نمایش به عنوان قسمت ویژه در بالای صفحه اصلی (Featured)
                  </label>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEpisodeModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#1B3B2B] hover:bg-[#234F3A] text-white font-bold shadow-xs"
                  >
                    ذخیره قسمت
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: GUEST ADD / EDIT --- */}
      <AnimatePresence>
        {isGuestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col my-8"
            >
              <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#12281D]">
                  {editingGuest ? `ویرایش اطلاعات «${editingGuest.name}»` : 'افزودن مهمان جدید'}
                </h3>
                <button
                  onClick={() => setIsGuestModalOpen(false)}
                  className="text-stone-400 hover:text-stone-600 font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveGuest} className="p-6 overflow-y-auto space-y-4 text-xs text-right">
                <div>
                  <label className="block font-bold text-[#12281D] mb-1">نام و نام خانوادگی</label>
                  <input
                    type="text"
                    value={guestForm.name}
                    onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                    required
                    placeholder="مثال: حجت‌الاسلام دکتر سید رضا حسینی"
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">سمت / نقش</label>
                    <input
                      type="text"
                      value={guestForm.role}
                      onChange={(e) => setGuestForm({ ...guestForm, role: e.target.value })}
                      required
                      placeholder="مثال: پژوهشگر فلسفه و کلام"
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">حوزه تخصصی</label>
                    <input
                      type="text"
                      value={guestForm.fieldOfExpertise}
                      onChange={(e) => setGuestForm({ ...guestForm, fieldOfExpertise: e.target.value })}
                      placeholder="مثال: فلسفه اسلامی و منطق"
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#12281D] mb-1">لینک تصویر پرتره (عکس مهمان)</label>
                  <input
                    type="url"
                    value={guestForm.image}
                    onChange={(e) => setGuestForm({ ...guestForm, image: e.target.value })}
                    required
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden dir-ltr text-left font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#12281D] mb-1">بیوگرافی و پیشینه مهمان</label>
                  <textarea
                    rows={3}
                    value={guestForm.bio}
                    onChange={(e) => setGuestForm({ ...guestForm, bio: e.target.value })}
                    placeholder="شرح مختصری از سوابق علمی و اجرایی..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#12281D] mb-1">نقل‌قول کلیدی</label>
                  <textarea
                    rows={2}
                    value={guestForm.quote}
                    onChange={(e) => setGuestForm({ ...guestForm, quote: e.target.value })}
                    placeholder="جمله برجسته مهمان..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#12281D] mb-1">نقطه عطف مسیر</label>
                  <input
                    type="text"
                    value={guestForm.keyMoment}
                    onChange={(e) => setGuestForm({ ...guestForm, keyMoment: e.target.value })}
                    placeholder="مثال: انصراف از دانشگاه در ۲۱ سالگی"
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                  />
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGuestModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#1B3B2B] hover:bg-[#234F3A] text-white font-bold shadow-xs"
                  >
                    ذخیره مهمان
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: CLIP ADD / EDIT --- */}
      <AnimatePresence>
        {isClipModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col my-8"
            >
              <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#12281D]">
                  {editingClip ? `ویرایش کلیپ کوتاه` : 'افزودن کلیپ کوتاه جدید'}
                </h3>
                <button
                  onClick={() => setIsClipModalOpen(false)}
                  className="text-stone-400 hover:text-stone-600 font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveClip} className="p-6 overflow-y-auto space-y-4 text-xs text-right">
                <div>
                  <label className="block font-bold text-[#12281D] mb-1">عنوان کلیپ کوتاه</label>
                  <input
                    type="text"
                    value={clipForm.title}
                    onChange={(e) => setClipForm({ ...clipForm, title: e.target.value })}
                    required
                    placeholder="مثال: بزرگترین شوک در ماه اول طلبگی"
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                  />
                </div>

                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#12281D]">
                      لینک ویدیو و تنظیمات کلیپ
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillClip}
                      disabled={isAutoFillingClip || !clipForm.videoUrl?.trim()}
                      className="px-3 py-1.5 rounded-lg bg-[#1B3B2B] hover:bg-[#234F3A] disabled:bg-stone-200 disabled:text-stone-400 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isAutoFillingClip ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>در حال استخراج...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#E2D8BE]" />
                          <span>⚡ تکمیل خودکار از لینک</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">
                      لینک ویدیوی کلیپ (آپارات، یوتیوب، یا فایل ویدیویی)
                    </label>
                    <input
                      type="url"
                      value={clipForm.videoUrl}
                      onChange={(e) => setClipForm({ ...clipForm, videoUrl: e.target.value })}
                      required
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:border-[#1B3B2B] focus:outline-hidden dir-ltr text-left font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">
                      لینک کاور / تصویر بندانگشتی کلیپ
                    </label>
                    <input
                      type="url"
                      value={clipForm.thumbnail}
                      onChange={(e) => setClipForm({ ...clipForm, thumbnail: e.target.value })}
                      required
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs focus:border-[#1B3B2B] focus:outline-hidden dir-ltr text-left font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">نام مهمان</label>
                    <input
                      type="text"
                      value={clipForm.guest}
                      onChange={(e) => setClipForm({ ...clipForm, guest: e.target.value })}
                      required
                      placeholder="نام مهمان"
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">سمت مهمان</label>
                    <input
                      type="text"
                      value={clipForm.guestRole}
                      onChange={(e) => setClipForm({ ...clipForm, guestRole: e.target.value })}
                      placeholder="سمت مهمان"
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">مدت زمان</label>
                    <input
                      type="text"
                      value={clipForm.duration}
                      onChange={(e) => setClipForm({ ...clipForm, duration: e.target.value })}
                      placeholder="۰۲:۱۵"
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden dir-ltr"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">دسته‌بندی موضوعی</label>
                    <input
                      type="text"
                      value={clipForm.highlightCategory}
                      onChange={(e) => setClipForm({ ...clipForm, highlightCategory: e.target.value })}
                      placeholder="تصورات اولیه، چالش‌ها..."
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#12281D] mb-1">متعلق به قسمت</label>
                    <select
                      value={clipForm.episodeId}
                      onChange={(e) => setClipForm({ ...clipForm, episodeId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:border-[#1B3B2B] focus:outline-hidden"
                    >
                      {episodes.map((ep) => (
                        <option key={ep.id} value={ep.id}>
                          قسمت {ep.number}: {ep.title.slice(0, 24)}...
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsClipModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#1B3B2B] hover:bg-[#234F3A] text-white font-bold shadow-xs"
                  >
                    ذخیره کلیپ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: DELETE CONFIRMATION --- */}
      <AnimatePresence>
        {deleteConfirmTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 text-right"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <h4 className="text-base font-extrabold text-[#12281D] text-center mb-2">
                تأیید حذف
              </h4>
              <p className="text-xs text-stone-600 text-center mb-6 leading-relaxed">
                آیا از حذف {deleteConfirmTarget.type === 'episode' ? 'قسمت' : deleteConfirmTarget.type === 'guest' ? 'مهمان' : 'کلیپ'} «{deleteConfirmTarget.title}» اطمینان دارید؟ این عملیات قابل بازگشت نیست.
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeleteConfirmTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50"
                >
                  انصراف
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs"
                >
                  بله، حذف کن
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
