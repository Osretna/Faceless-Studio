import React, { useState, useRef } from 'react';
import { 
  User, 
  Share2, 
  CreditCard, 
  Sliders, 
  Bell, 
  Globe, 
  Save, 
  Download, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Camera,
  Upload,
  Link as LinkIcon,
  Trash2,
  Check,
  Image as ImageIcon,
  RefreshCw,
  Database,
  Cloud,
  HardDrive,
  FileJson,
  AlertTriangle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserProfile, VideoProject, ScheduledPost } from '../types';
import { translations } from '../translations';
import { MOCK_VOICES, INITIAL_USER } from '../mockData';

interface SettingsViewProps {
  lang: Language;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onToggleLang: () => void;
  projects?: VideoProject[];
  scheduledPosts?: ScheduledPost[];
  onResetData?: () => void;
  onImportData?: (data: { user?: UserProfile; projects?: VideoProject[]; scheduledPosts?: ScheduledPost[] }) => void;
}

const PRESET_AVATARS = [
  { id: 'av-1', labelAr: 'مبدع تقني', labelEn: 'Tech Creator', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { id: 'av-2', labelAr: 'صانع محتوى فيسلس', labelEn: 'Faceless Pro', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { id: 'av-3', labelAr: 'مبتكرة ريلز ذكاء اصطناعي', labelEn: 'AI Reels Star', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' },
  { id: 'av-4', labelAr: 'خبير نمو قنوات', labelEn: 'Growth Strategist', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { id: 'av-5', labelAr: 'روائية ومخرجة قصص', labelEn: 'Cinematic Storyteller', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' },
  { id: 'av-6', labelAr: 'وثائقي وبودكاست', labelEn: 'Documentary Voice', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80' },
  { id: 'av-7', labelAr: 'سايبر بانك 3D', labelEn: 'Cyberpunk 3D', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80' },
  { id: 'av-8', labelAr: 'فضاء كوني ومستقبل', labelEn: 'Cosmic Visionary', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&auto=format&fit=crop&q=80' },
  { id: 'av-9', labelAr: 'محلل مالي وتداول', labelEn: 'Finance Pro', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80' },
  { id: 'av-10', labelAr: 'أفاتار الذكاء الاصطناعي', labelEn: 'AI Abstract Core', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&auto=format&fit=crop&q=80' },
  { id: 'av-11', labelAr: 'مخرج سنمائي', labelEn: 'Film Director', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80' },
  { id: 'av-12', labelAr: 'مغامرة واستكشاف', labelEn: 'Explorer', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  lang,
  user,
  onUpdateUser,
  onToggleLang,
  projects = [],
  scheduledPosts = [],
  onResetData,
  onImportData,
}) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'profile' | 'accounts' | 'billing' | 'ai' | 'notifications' | 'appearance' | 'data'>('profile');

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [primaryNiche, setPrimaryNiche] = useState(user.primaryNiche);
  const [preferredVoice, setPreferredVoice] = useState(user.preferredVoice);
  const [preferredDialect, setPreferredDialect] = useState(user.preferredDialect);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [avatarToast, setAvatarToast] = useState<string | null>(null);

  // Avatar picker dialog / options
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customAvatarUrlInput, setCustomAvatarUrlInput] = useState('');
  const [activeAvatarSourceTab, setActiveAvatarSourceTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupImportInputRef = useRef<HTMLInputElement>(null);

  // Sync avatarUrl state if user changes externally
  React.useEffect(() => {
    setAvatarUrl(user.avatarUrl);
  }, [user.avatarUrl]);

  // Handle direct file upload from device
  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(lang === 'ar' ? 'يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)' : 'Please choose a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(lang === 'ar' ? 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت' : 'Image is too large (max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
        onUpdateUser({ avatarUrl: dataUrl });
        triggerAvatarSuccess(lang === 'ar' ? 'تم رفع وحفظ صورتك الشخصية بنجاح! 📸✨' : 'Avatar uploaded & saved successfully! 📸✨');
      }
    };
    reader.readAsDataURL(file);

    // Reset input so re-selecting same file works
    if (e.target) e.target.value = '';
  };

  const handleSelectPresetAvatar = (url: string) => {
    setAvatarUrl(url);
    onUpdateUser({ avatarUrl: url });
    triggerAvatarSuccess(lang === 'ar' ? 'تم اختيار وتطبيق الأفاتار الجديد بنجاح! 👤✨' : 'Avatar applied successfully! 👤✨');
  };

  const handleApplyCustomUrl = () => {
    if (!customAvatarUrlInput.trim()) return;
    setAvatarUrl(customAvatarUrlInput.trim());
    onUpdateUser({ avatarUrl: customAvatarUrlInput.trim() });
    triggerAvatarSuccess(lang === 'ar' ? 'تم تحديث الصورة من الرابط بنجاح! 🔗✨' : 'Avatar updated from URL! 🔗✨');
    setCustomAvatarUrlInput('');
  };

  const handleResetToDefaultAvatar = () => {
    const defaultUrl = INITIAL_USER.avatarUrl;
    setAvatarUrl(defaultUrl);
    onUpdateUser({ avatarUrl: defaultUrl });
    triggerAvatarSuccess(lang === 'ar' ? 'تم استعادة الصورة الافتراضية بنجاح 🔄' : 'Reset to default avatar 🔄');
  };

  const triggerAvatarSuccess = (msg: string) => {
    setAvatarToast(msg);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setAvatarToast(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email,
      avatarUrl,
      primaryNiche,
      preferredVoice,
      preferredDialect,
    });
    setSavedSuccess(true);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Export Data JSON
  const handleExportData = () => {
    const backupData = {
      app: 'Faceless Studio',
      exportedAt: new Date().toISOString(),
      user,
      projects,
      scheduledPosts,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faceless-studio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerAvatarSuccess(lang === 'ar' ? 'تم تنزيل النسخة الاحتياطية بنجاح! 💾' : 'Backup downloaded successfully! 💾');
  };

  // Import Data JSON
  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (onImportData) {
          onImportData(parsed);
          triggerAvatarSuccess(lang === 'ar' ? 'تم استرجاع بياناتك ومشاريعك بنجاح! ✅' : 'Data restored successfully! ✅');
        } else {
          if (parsed.user) {
            onUpdateUser(parsed.user);
            setName(parsed.user.name || name);
            setEmail(parsed.user.email || email);
            setAvatarUrl(parsed.user.avatarUrl || avatarUrl);
          }
          triggerAvatarSuccess(lang === 'ar' ? 'تم استرجاع الإعدادات بنجاح! ✅' : 'Settings restored! ✅');
        }
      } catch (err) {
        alert(lang === 'ar' ? 'الملف غير صالح أو تالف' : 'Invalid backup JSON file');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const tabs = [
    { id: 'profile' as const, labelAr: 'الملف الشخصي والصورة', labelEn: 'Profile & Avatar', icon: User },
    { id: 'data' as const, labelAr: 'حفظ البيانات وفيربيس', labelEn: 'Data & Firebase', icon: Database },
    { id: 'accounts' as const, labelAr: 'الحسابات المتصلة', labelEn: 'Connected Accounts', icon: Share2 },
    { id: 'billing' as const, labelAr: 'الاشتراك والفواتير', labelEn: 'Billing & Plans', icon: CreditCard },
    { id: 'ai' as const, labelAr: 'تفضيلات الذكاء الاصطناعي', labelEn: 'AI Preferences', icon: Sliders },
    { id: 'notifications' as const, labelAr: 'الإشعارات', labelEn: 'Notifications', icon: Bell },
    { id: 'appearance' as const, labelAr: 'اللغة والمظهر', labelEn: 'Language & Theme', icon: Globe },
  ];

  const invoices = [
    { id: 'INV-2026-08', date: '01 Aug 2026', amount: '$19.00', status: 'Paid', plan: 'Pro Monthly' },
    { id: 'INV-2026-07', date: '01 Jul 2026', amount: '$19.00', status: 'Paid', plan: 'Pro Monthly' },
    { id: 'INV-2026-06', date: '01 Jun 2026', amount: '$19.00', status: 'Paid', plan: 'Pro Monthly' },
  ];

  return (
    <div className="space-y-6">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={handleAvatarFileSelect}
      />
      <input
        type="file"
        ref={backupImportInputRef}
        accept=".json"
        className="hidden"
        onChange={handleImportBackupFile}
      />

      {/* Floating Toast Notification */}
      {avatarToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{avatarToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-md">
        <h2 className="text-xl font-bold text-white tracking-tight">{t.settings}</h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ar' ? 'إدارة حسابك، وتغيير صورتك، والتحكم في حفظ البيانات السحابي والمحلي' : 'Manage your account, profile photo, and cloud/local persistence'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation Tabs */}
        <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Panel (3 Cols) */}
        <div className="lg:col-span-3 p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-700/80 shadow-xl">
          {savedSuccess && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تم حفظ التعديلات والبيانات بنجاح!' : 'Settings saved successfully!'}</span>
            </div>
          )}

          {/* 1. PROFILE & AVATAR TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {lang === 'ar' ? 'معلومات وصورة الحساب الشخصي' : 'Profile Picture & Details'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'يمكنك رفع صورتك الخاصة من هاتفك أو جهازك، أو اختيار أفاتار مميز من المعرض.' : 'Upload your custom photo from your device or pick a curated creator avatar.'}
                </p>
              </div>

              {/* Enhanced Avatar Management Section */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    {/* Clickable Avatar with Camera Overlay */}
                    <div 
                      className="relative group cursor-pointer"
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      title={lang === 'ar' ? 'انقر لتغيير الصورة' : 'Click to change photo'}
                    >
                      <img
                        src={avatarUrl}
                        alt={name}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500/50 group-hover:ring-indigo-400 transition-all shadow-xl"
                      />
                      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                        ✓
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white">{name}</div>
                      <div className="text-xs text-slate-400">{email}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                          {user.plan} Member
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {lang === 'ar' ? 'محفوظة تلقائياً' : 'Auto-Saved'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Avatar Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      id="upload-avatar-device-btn"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'رفع صورة من جهازك 📁' : 'Upload from Device'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        showAvatarPicker 
                          ? 'bg-slate-700 text-white border-slate-600' 
                          : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-750'
                      }`}
                      id="toggle-avatar-picker-btn"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      <span>{lang === 'ar' ? 'معرض الأفاتارات ✨' : 'Preset Avatars'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetToDefaultAvatar}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700"
                      title={lang === 'ar' ? 'استعادة الصورة الافتراضية' : 'Reset to default'}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expandable Avatar Picker Drawer */}
                {showAvatarPicker && (
                  <div className="mt-5 pt-5 border-t border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    {/* Tabs inside picker */}
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      <button
                        type="button"
                        onClick={() => setActiveAvatarSourceTab('upload')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          activeAvatarSourceTab === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'رفع ملف' : 'Upload File'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveAvatarSourceTab('preset')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          activeAvatarSourceTab === 'preset' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{lang === 'ar' ? 'شخصيات وأفاتار جاهز (12)' : 'Preset Avatars (12)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveAvatarSourceTab('url')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          activeAvatarSourceTab === 'url' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'رابط صورة خارجي' : 'Image Link'}</span>
                      </button>
                    </div>

                    {/* Source Tab 1: Upload */}
                    {activeAvatarSourceTab === 'upload' && (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-6 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/60 hover:bg-slate-900/60 cursor-pointer text-center transition-all group"
                      >
                        <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-white">
                          {lang === 'ar' ? 'انقر هنا لاختيار صورة من جهازك (كمبيوتر أو هاتف)' : 'Click to select photo from device'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          JPG, PNG, WebP, GIF (Max 5MB) - {lang === 'ar' ? 'يتم الحفظ فورياً' : 'Saves instantly'}
                        </p>
                      </div>
                    )}

                    {/* Source Tab 2: Presets */}
                    {activeAvatarSourceTab === 'preset' && (
                      <div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {PRESET_AVATARS.map((av) => {
                            const isSelected = avatarUrl === av.url;
                            return (
                              <div
                                key={av.id}
                                onClick={() => handleSelectPresetAvatar(av.url)}
                                className={`group relative cursor-pointer rounded-2xl p-1.5 border transition-all text-center ${
                                  isSelected 
                                    ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500' 
                                    : 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900'
                                }`}
                              >
                                <img
                                  src={av.url}
                                  alt={av.labelEn}
                                  className="w-14 h-14 rounded-full mx-auto object-cover ring-2 ring-slate-700 group-hover:ring-indigo-400 transition-all"
                                />
                                <span className="text-[10px] font-semibold text-slate-300 block mt-1.5 truncate">
                                  {lang === 'ar' ? av.labelAr : av.labelEn}
                                </span>
                                {isSelected && (
                                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">
                                    ✓
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Source Tab 3: URL */}
                    {activeAvatarSourceTab === 'url' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={customAvatarUrlInput}
                          onChange={(e) => setCustomAvatarUrlInput(e.target.value)}
                          placeholder="https://example.com/my-photo.jpg"
                          className="flex-1 h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCustomUrl}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
                        >
                          {lang === 'ar' ? 'تطبيق الرابط' : 'Apply URL'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Name & Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'حفظ كافة التعديلات' : 'Save Changes'}</span>
                </button>

                <span className="text-[11px] text-slate-400">
                  {lang === 'ar' ? 'يتم الحفظ التلقائي في ذاكرة المتصفح الدائمة 💾' : 'Auto-saved to persistent browser storage 💾'}
                </span>
              </div>
            </form>
          )}

          {/* 2. DATA STORAGE & FIREBASE GUIDANCE TAB */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {lang === 'ar' ? 'حفظ البيانات ومزامنة فيرباس (Firebase)' : 'Data Persistence & Firebase Sync'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'تعرف على كيفية تخزين بياناتك محلياً وسحابياً وكيفية الحفاظ على جميع فيديوهاتك وإعداداتك.' : 'Understand how your data is saved locally and in the cloud.'}
                </p>
              </div>

              {/* Status Card: Local Persistence is ACTIVE */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {lang === 'ar' ? 'التخزين التلقائي المحلي (Local Storage): مفعّل ونشط 🟢' : 'Local Storage Auto-Save: Active 🟢'}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        100% محفوظ
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {lang === 'ar'
                        ? 'تطبيقك يحفظ الآن كل ما تدخله بشكل فوري وتلقائي (صورتك الشخصية، اسمك، مشاريع الفيديوهات، السكريبتات، وجدول النشر) داخل متصفحك. لن تفقد أي شيء عند تحديث الصفحة أو إغلاق المتصفح!'
                        : 'Your app currently saves everything immediately and automatically (avatar, name, video projects, scripts, schedules) inside your browser storage. You will never lose data upon page reload!'}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'المشاريع المحفوظة' : 'Projects Saved'}</span>
                        <span className="text-base font-bold text-white">{projects.length}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'المنشورات المجدولة' : 'Scheduled Posts'}</span>
                        <span className="text-base font-bold text-white">{scheduledPosts.length}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'حالة الصورة' : 'Avatar Status'}</span>
                        <span className="text-xs font-bold text-emerald-400">{lang === 'ar' ? 'مخصصة ومحفوظة' : 'Saved'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'خطة الحساب' : 'Plan'}</span>
                        <span className="text-xs font-bold text-indigo-400">{user.plan}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Answer to User's Question: Do I need Firebase? */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-900 border border-indigo-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{lang === 'ar' ? 'سؤال: هل يجب أن أضيف فيرباس (Firebase) لكي يحفظ التطبيق كل شيء؟' : 'FAQ: Do I have to add Firebase to save everything?'}</span>
                    </h4>
                    
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <p className="text-xs text-slate-200 font-semibold">
                        {lang === 'ar' 
                          ? 'الإجابة المباشرة: لا، لست مجبراً على إضافة Firebase لحفظ بياناتك!' 
                          : 'Direct Answer: No, you do NOT have to add Firebase to save your data!'}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lang === 'ar'
                          ? 'التطبيق الحالي مزود بنظام التخزين الدائم التلقائي (Local Storage). هذا يعني أن صورتك الشخصية، ومشاريعك، وفيديوهاتك تظل محفوظة دائماً على جهازك الحالي مجاناً وبدون أي تعقيد أو اشتراكات خارجية.'
                          : 'The app is equipped with persistent browser storage. Your avatar, projects, and videos are saved permanently on this device for free without any setup.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                          <Check className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'متى يكفيك الوضع الحالي؟' : 'When is Local Storage enough?'}</span>
                        </div>
                        <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                          <li>{lang === 'ar' ? 'تعمل من جهازك أو لابتوبك الخاص.' : 'Working from your personal computer.'}</li>
                          <li>{lang === 'ar' ? 'تريد حفظ أعمالك وفيديوهاتك فورياً وبدون إنترنت.' : 'Instant saving without external latency.'}</li>
                          <li>{lang === 'ar' ? 'لا تحتاج لمشاركة الحساب مع فريق عمل آخر.' : 'No need for multi-user collaboration.'}</li>
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'متى ستحتاج إضافة Firebase؟' : 'When would you need Firebase?'}</span>
                        </div>
                        <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                          <li>{lang === 'ar' ? 'تريد تسجيل الدخول من جهاز آخر (مثل هاتفك) وإيجاد نفس الفيديوهات.' : 'Syncing projects across phone and PC.'}</li>
                          <li>{lang === 'ar' ? 'توفير تسجيل دخول حقيقي بكلمات مرور أو حساب Google.' : 'Real multi-user accounts & Google Sign-In.'}</li>
                          <li>{lang === 'ar' ? 'رفع ومشاركة روابط سحابية مباشرة مع العملاء.' : 'Cloud storage links for team sharing.'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Backup & Restore Tools */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {lang === 'ar' ? 'أدوات النسخ الاحتياطي ونقل البيانات' : 'Backup & Data Management Tools'}
                </h4>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تنزيل نسخة احتياطية (JSON Backup) 💾' : 'Export Backup (JSON)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => backupImportInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
                  >
                    <FileJson className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ar' ? 'استيراد نسخة سابقة 📂' : 'Import Backup'}</span>
                  </button>

                  {onResetData && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(lang === 'ar' ? 'هل أنت متأكد من رغبتك في إعادة ضبط البيانات إلى الحالة الأصلية؟' : 'Are you sure you want to reset all data to default?')) {
                          onResetData();
                          triggerAvatarSuccess(lang === 'ar' ? 'تمت إعادة ضبط البيانات بنجاح 🔄' : 'Data reset to defaults 🔄');
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 flex items-center gap-1.5 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'إعادة ضبط البيانات للافتراضي' : 'Reset to Defaults'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. CONNECTED ACCOUNTS */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">
                {lang === 'ar' ? 'إدارة حسابات التواصل الاجتماعي' : 'Manage Connected Channels'}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {lang === 'ar' ? 'قم بربط حساباتك لنشر الفيديوهات بضغطة زر واحدة دون الحاجة لتنزيلها ورفعها يدوياً.' : 'Link accounts to enable autonomous single-click multi-platform publishing.'}
              </p>

              <div className="space-y-3">
                {user.connectedAccounts.map((acc) => (
                  <div
                    key={acc.platform}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{acc.platform}</div>
                      <div className="text-[11px] text-slate-400">{acc.username || (lang === 'ar' ? 'غير متصل' : 'Not Connected')}</div>
                    </div>

                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        acc.isConnected
                          ? 'bg-slate-800 text-red-400 hover:bg-red-500/10'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500'
                      }`}
                    >
                      {acc.isConnected ? (lang === 'ar' ? 'إلغاء الربط' : 'Disconnect') : (lang === 'ar' ? 'ربط الحساب' : 'Connect')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. BILLING & PLANS */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">Active Subscription</span>
                  <h4 className="text-lg font-bold text-white mt-0.5">{user.plan} Creator Plan</h4>
                  <p className="text-xs text-slate-400 mt-1">تجدد في 01 أكتوبر 2026 بمبلغ $19/شهرياً</p>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
                >
                  {lang === 'ar' ? 'تعديل الخطة' : 'Change Plan'}
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  {lang === 'ar' ? 'سجل الفواتير السابقة' : 'Billing History'}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="pb-2">رقم الفاتورة</th>
                        <th className="pb-2">التاريخ</th>
                        <th className="pb-2">المبلغ</th>
                        <th className="pb-2">الحالة</th>
                        <th className="pb-2 text-center">تحميل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="text-slate-300">
                          <td className="py-2.5 font-mono">{inv.id}</td>
                          <td className="py-2.5">{inv.date}</td>
                          <td className="py-2.5 font-bold text-white">{inv.amount}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-center">
                            <button className="p-1 rounded text-indigo-400 hover:text-white">
                              <Download className="w-4 h-4 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. AI PREFERENCES */}
          {activeTab === 'ai' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">
                {lang === 'ar' ? 'إعدادات وتفضيلات الذكاء الاصطناعي' : 'AI Automation Settings'}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {lang === 'ar' ? 'حدد الإعدادات الافتراضية لتوليد الفيديوهات بنقرة واحدة سريعة.' : 'Configure default preferences to streamline one-click video creation.'}
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'النيش الافتراضي للقنوات:' : 'Default Channel Niche:'}
                </label>
                <input
                  type="text"
                  value={primaryNiche}
                  onChange={(e) => setPrimaryNiche(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'الصوت الافتراضي المفضل:' : 'Preferred AI Voice:'}
                </label>
                <select
                  value={preferredVoice}
                  onChange={(e) => setPreferredVoice(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {MOCK_VOICES.map((v) => (
                    <option key={v.id} value={v.name}>{v.name} ({v.accent})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'اللهجة الافتراضية للسكريبت:' : 'Default Script Dialect:'}
                </label>
                <select
                  value={preferredDialect}
                  onChange={(e) => setPreferredDialect(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="فصحى معاصرة">العربية الفصحى (Modern Standard Arabic)</option>
                  <option value="لهجة مصرية">اللهجة المصرية (Egyptian)</option>
                  <option value="لهجة خليجية">اللهجة الخليجية (Gulf / Saudi)</option>
                  <option value="English (US)">English (US Accent)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'حفظ التفضيلات' : 'Save AI Defaults'}</span>
                </button>
              </div>
            </form>
          )}

          {/* 6. NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">
                {lang === 'ar' ? 'إعدادات الإشعارات والتنبيهات' : 'Notifications & Alerts'}
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">{lang === 'ar' ? 'تنبيه بنجاح النشر التلقائي' : 'Auto-Publish Success Alerts'}</div>
                    <div className="text-[11px] text-slate-400">{lang === 'ar' ? 'إرسال إشعار فوري عند نشر الفيديو بنجاح على أي منصة' : 'Immediate notification on channel upload success'}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 bg-slate-800" />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">{lang === 'ar' ? 'تنبيهات الترند الأسبوعية' : 'Weekly Viral Trend Digest'}</div>
                    <div className="text-[11px] text-slate-400">{lang === 'ar' ? 'إرسال أحدث موضوعات الترند المناسبة لنيشك' : 'Receive weekly trending hooks matching your niche'}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 bg-slate-800" />
                </label>
              </div>
            </div>
          )}

          {/* 7. APPEARANCE & LANGUAGE */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">
                {lang === 'ar' ? 'اللغة والمظهر' : 'Language & Interface'}
              </h3>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{lang === 'ar' ? 'لغة واجهة المنصة' : 'App Interface Language'}</div>
                  <div className="text-[11px] text-slate-400">{lang === 'ar' ? 'العربية (RTL) أو English (LTR)' : 'Arabic (RTL) or English (LTR)'}</div>
                </div>

                <button
                  type="button"
                  onClick={onToggleLang}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  {lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

