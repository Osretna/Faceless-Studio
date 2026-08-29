import React from 'react';
import { Sparkles, Globe, ArrowRight, Play, LayoutDashboard, User } from 'lucide-react';
import { Language, ViewMode } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  onOpenAuth,
  currentView,
  onNavigate,
  isLoggedIn,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0F172A]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
          id="navbar-brand"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-cairo">
              {t.appName}
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                AI
              </span>
            </span>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {lang === 'ar' ? 'أتمتة قنوات الفيسلس' : 'Autonomous Faceless Channels'}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'landing' ? 'text-indigo-400 bg-slate-800/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
            id="nav-home"
          >
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </button>
          <a
            href="#features"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 transition-colors"
          >
            {lang === 'ar' ? 'الميزات' : 'Features'}
          </a>
          <a
            href="#how-it-works"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 transition-colors"
          >
            {lang === 'ar' ? 'كيف يعمل؟' : 'How It Works'}
          </a>
          <a
            href="#demo"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 transition-colors"
          >
            {lang === 'ar' ? 'العرض التفاعلي' : 'Live Demo'}
          </a>
          <button
            onClick={() => onNavigate('pricing')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'pricing' ? 'text-indigo-400 bg-slate-800/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
            id="nav-pricing"
          >
            {t.pricing}
          </button>
          <button
            onClick={() => onNavigate('help')}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 transition-colors"
            id="nav-help"
          >
            {t.helpCenter}
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-semibold transition-colors"
            title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            id="lang-toggle-btn"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              id="btn-goto-dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.dashboard}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white text-sm font-medium hover:bg-slate-800/60 transition-colors"
                id="btn-nav-login"
              >
                {t.login}
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:opacity-95 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                id="btn-nav-signup"
              >
                <span>{t.startFree}</span>
                <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
