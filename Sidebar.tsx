import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wand2, 
  CalendarDays, 
  Send, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Lightbulb, 
  FileText, 
  Video, 
  Hash, 
  LogOut,
  Zap,
  ChevronDown
} from 'lucide-react';
import { Language, ViewMode, GeneratorTab, UserProfile } from '../types';
import { translations } from '../translations';

interface SidebarProps {
  lang: Language;
  currentView: ViewMode;
  generatorTab: GeneratorTab;
  onNavigate: (view: ViewMode) => void;
  onSelectGeneratorTab: (tab: GeneratorTab) => void;
  user: UserProfile;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lang,
  currentView,
  generatorTab,
  onNavigate,
  onSelectGeneratorTab,
  user,
  onLogout,
}) => {
  const t = translations[lang];
  const [collapsed, setCollapsed] = useState(false);
  const [generatorMenuOpen, setGeneratorMenuOpen] = useState(true);

  const isRtl = lang === 'ar';

  const menuItems = [
    {
      id: 'dashboard' as ViewMode,
      label: t.dashboard,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'calendar' as ViewMode,
      label: t.calendar,
      icon: CalendarDays,
      badge: `${user.scheduledPostsCount}`,
    },
    {
      id: 'publisher' as ViewMode,
      label: t.publisher,
      icon: Send,
      badge: lang === 'ar' ? 'تلقائي' : 'Auto',
    },
    {
      id: 'pricing' as ViewMode,
      label: t.pricing,
      icon: CreditCard,
      badge: user.plan === 'Pro' ? 'Pro ✨' : null,
    },
    {
      id: 'settings' as ViewMode,
      label: t.settings,
      icon: Settings,
      badge: null,
    },
    {
      id: 'help' as ViewMode,
      label: t.helpCenter,
      icon: HelpCircle,
      badge: null,
    },
  ];

  const generatorSubItems = [
    { id: 'brainstorm' as GeneratorTab, label: t.brainstormTab, icon: Lightbulb },
    { id: 'script' as GeneratorTab, label: t.scriptTab, icon: FileText },
    { id: 'video' as GeneratorTab, label: t.videoTab, icon: Video },
    { id: 'captions' as GeneratorTab, label: t.captionsTab, icon: Hash },
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col border-slate-800 bg-[#111928] transition-all duration-300 ${
        isRtl ? 'border-l' : 'border-r'
      } ${collapsed ? 'w-20' : 'w-72'}`}
      id="app-sidebar"
    >
      {/* Sidebar Header / Brand */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800/80">
        {!collapsed && (
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group overflow-hidden"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <div className="text-base font-bold text-white tracking-tight flex items-center gap-1.5 font-cairo">
                <span>{t.appName}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {lang === 'ar' ? 'منصة الأتمتة الفائقة' : 'Faceless Automation Engine'}
              </p>
            </div>
          </div>
        )}

        {collapsed && (
          <div 
            onClick={() => setCollapsed(false)}
            className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          title={collapsed ? (isRtl ? 'توسيع القائمة' : 'Expand sidebar') : (isRtl ? 'طي القائمة' : 'Collapse sidebar')}
          id="collapse-sidebar-btn"
        >
          {isRtl ? (
            collapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
          ) : (
            collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {/* Main Dashboard item */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentView === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title={t.dashboard}
          id="sidebar-link-dashboard"
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{t.dashboard}</span>}
        </button>

        {/* Content Generator Category with Submenu */}
        <div className="pt-1">
          <button
            onClick={() => {
              if (collapsed) setCollapsed(false);
              onNavigate('generator');
              setGeneratorMenuOpen(!generatorMenuOpen);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentView === 'generator'
                ? 'bg-slate-800 text-indigo-400 font-semibold border border-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title={t.generator}
            id="sidebar-link-generator"
          >
            <div className="flex items-center gap-3">
              <Wand2 className="w-5 h-5 shrink-0 text-pink-400" />
              {!collapsed && <span>{t.generator}</span>}
            </div>
            {!collapsed && (
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  generatorMenuOpen ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>

          {/* Sub-items for Generator */}
          {!collapsed && generatorMenuOpen && (
            <div className={`mt-1 space-y-1 ${isRtl ? 'pr-4 pl-1 border-r-2 border-indigo-500/40' : 'pl-4 pr-1 border-l-2 border-indigo-500/40'}`}>
              {generatorSubItems.map((sub) => {
                const Icon = sub.icon;
                const active = currentView === 'generator' && generatorTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onNavigate('generator');
                      onSelectGeneratorTab(sub.id);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                    id={`sidebar-sub-${sub.id}`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Other navigation items */}
        {menuItems.slice(1).map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              title={item.label}
              id={`sidebar-link-${item.id}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
              {!collapsed && item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-800 text-indigo-400 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subscription Usage Widget */}
      {!collapsed && (
        <div className="p-3 mx-3 mb-2 rounded-xl bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-700/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-white flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {user.plan} {lang === 'ar' ? 'الخطة' : 'Plan'}
            </span>
            <span className="text-[11px] text-slate-400">
              {user.videosCreatedThisMonth}/{user.maxVideosPerMonth} {lang === 'ar' ? 'فيديو' : 'vids'}
            </span>
          </div>
          <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(user.videosCreatedThisMonth / user.maxVideosPerMonth) * 100}%` }}
            />
          </div>
          <button
            onClick={() => onNavigate('pricing')}
            className="mt-2.5 w-full py-1 text-center text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
          >
            {lang === 'ar' ? 'ترقية للإنتاج اللامحدود ⚡' : 'Upgrade to Unlimited ⚡'}
          </button>
        </div>
      )}

      {/* Sidebar Footer User Card */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 shrink-0 rounded-full object-cover ring-1 ring-indigo-500/40"
            />
            {!collapsed && (
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title={t.logout}
              id="sidebar-logout-btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
