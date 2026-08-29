import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Globe, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Menu, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Language, UserProfile, ViewMode, GeneratorTab } from '../types';
import { translations } from '../translations';

interface TopbarProps {
  lang: Language;
  onToggleLang: () => void;
  user: UserProfile;
  onNavigate: (view: ViewMode) => void;
  onStartNewVideo: () => void;
  onToggleMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  lang,
  onToggleLang,
  user,
  onNavigate,
  onStartNewVideo,
  onToggleMobileMenu,
}) => {
  const t = translations[lang];
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 'notif-1',
      title: lang === 'ar' ? 'تم نشر فيديو TikTok بنجاح!' : 'TikTok video published successfully!',
      time: lang === 'ar' ? 'منذ 15 دقيقة' : '15 mins ago',
      read: false,
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    {
      id: 'notif-2',
      title: lang === 'ar' ? 'محتوى ترند جديد في نيش الذكاء الاصطناعي' : 'New trending topic in AI niche',
      time: lang === 'ar' ? 'منذ ساعتين' : '2 hours ago',
      read: false,
      icon: Sparkles,
      color: 'text-pink-400',
    },
    {
      id: 'notif-3',
      title: lang === 'ar' ? 'تذكير: منشور Instagram مجدول لليوم 07:00 م' : 'Reminder: Instagram post scheduled today 07:00 PM',
      time: lang === 'ar' ? 'منذ 4 ساعات' : '4 hours ago',
      read: true,
      icon: Clock,
      color: 'text-indigo-400',
    }
  ];

  return (
    <header className="sticky top-0 z-20 h-20 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Global Search bar */}
        <div className="relative w-full">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${
            lang === 'ar' ? 'right-3.5' : 'left-3.5'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
              lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'
            }`}
            id="topbar-search-input"
          />
        </div>
      </div>

      {/* Action Buttons & Profile Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick New Video Button */}
        <button
          onClick={onStartNewVideo}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          id="topbar-new-video-btn"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newVideo}</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={onToggleLang}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-semibold transition-colors"
          title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          id="topbar-lang-toggle"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">{lang === 'ar' ? 'English' : 'عربي'}</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            title={t.notifications}
            id="notifications-bell-btn"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-slate-900" />
          </button>

          {showNotifications && (
            <div className={`absolute top-full mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in-50 zoom-in-95 ${
              lang === 'ar' ? 'left-0' : 'right-0'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  {t.notifications}
                </span>
                <span className="text-[11px] text-indigo-400 font-semibold cursor-pointer hover:underline">
                  {lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}
                </span>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        notif.read ? 'bg-slate-800/30 border-slate-800 text-slate-400' : 'bg-slate-800/80 border-slate-700/80 text-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${notif.color}`} />
                        <div className="flex-1">
                          <p className="text-xs font-medium leading-snug">{notif.title}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Profile */}
        <div 
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 cursor-pointer transition-colors"
          id="topbar-user-badge"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500/40"
          />
          <div className="hidden lg:block text-right">
            <span className="text-xs font-semibold text-white block leading-tight">{user.name}</span>
            <span className="text-[10px] text-emerald-400 font-medium">{user.plan} Member</span>
          </div>
        </div>
      </div>
    </header>
  );
};
