import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { BrainstormView } from './components/generator/BrainstormView';
import { ScriptWriterView } from './components/generator/ScriptWriterView';
import { VideoCreatorView } from './components/generator/VideoCreatorView';
import { CaptionsView } from './components/generator/CaptionsView';
import { CalendarView } from './components/CalendarView';
import { AutoPublisherView } from './components/AutoPublisherView';
import { PricingView } from './components/PricingView';
import { SettingsView } from './components/SettingsView';
import { HelpCenterView } from './components/HelpCenterView';

import { 
  Language, 
  ViewMode, 
  GeneratorTab, 
  UserProfile, 
  VideoProject, 
  ScheduledPost, 
  IdeaCard, 
  ScriptResult 
} from './types';
import { INITIAL_USER, INITIAL_PROJECTS, INITIAL_SCHEDULED_POSTS } from './mockData';
import { translations } from './translations';
import { Lightbulb, FileText, Video, Hash } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [generatorTab, setGeneratorTab] = useState<GeneratorTab>('brainstorm');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('signup');
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // App Data State with Local Storage Persistence
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('faceless_user');
      if (saved) {
        return { ...INITIAL_USER, ...JSON.parse(saved) };
      }
    } catch {}
    return INITIAL_USER;
  });

  const [projects, setProjects] = useState<VideoProject[]>(() => {
    try {
      const saved = localStorage.getItem('faceless_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PROJECTS;
  });

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    try {
      const saved = localStorage.getItem('faceless_scheduled_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_SCHEDULED_POSTS;
  });

  // Automatically persist user, projects, and scheduled posts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('faceless_user', JSON.stringify(user));
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('faceless_projects', JSON.stringify(projects));
    } catch {}
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('faceless_scheduled_posts', JSON.stringify(scheduledPosts));
    } catch {}
  }, [scheduledPosts]);

  // Cross-tab data sharing
  const [selectedIdeaForScript, setSelectedIdeaForScript] = useState<IdeaCard | null>(null);
  const [selectedScriptForVideo, setSelectedScriptForVideo] = useState<ScriptResult | null>(null);
  const [selectedProjectForVideo, setSelectedProjectForVideo] = useState<VideoProject | null>(null);

  // Keep document RTL/LTR updated
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleOpenAuth = (mode: 'login' | 'signup' | 'forgot') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSuccessAuth = (userData: { name: string; email: string }) => {
    setUser((prev) => ({
      ...prev,
      name: userData.name,
      email: userData.email,
    }));
    setIsLoggedIn(true);
    setAuthModalOpen(false);

    if (authMode === 'signup') {
      setOnboardingOpen(true);
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleCompleteOnboarding = (data: { niche: string; plan: 'Free' | 'Pro' }) => {
    setUser((prev) => ({
      ...prev,
      primaryNiche: data.niche,
      plan: data.plan,
      maxVideosPerMonth: data.plan === 'Pro' ? 30 : 3,
    }));
    setOnboardingOpen(false);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('landing');
  };

  const handleStartNewVideo = () => {
    setCurrentView('generator');
    setGeneratorTab('video');
  };

  const handleUseScriptFromBrainstorm = (idea: IdeaCard) => {
    setSelectedIdeaForScript(idea);
    setCurrentView('generator');
    setGeneratorTab('script');
  };

  const handleSendToVideoStudio = (script: ScriptResult) => {
    setSelectedScriptForVideo(script);
    setCurrentView('generator');
    setGeneratorTab('video');
  };

  const handleVideoCreated = (newProject: VideoProject) => {
    setProjects([newProject, ...projects]);
    setUser((prev) => ({
      ...prev,
      videosCreatedThisMonth: prev.videosCreatedThisMonth + 1,
    }));
    // Redirect to dashboard to view new project
    setCurrentView('dashboard');
  };

  const handleUpgradePlan = (planName: 'Free' | 'Pro' | 'Agency') => {
    setUser((prev) => ({
      ...prev,
      plan: planName,
      maxVideosPerMonth: planName === 'Agency' ? 999 : planName === 'Pro' ? 30 : 3,
    }));
    setCurrentView('dashboard');
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-cairo flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* 1. LANDING PAGE VIEW (FULL WIDTH LAYOUT) */}
      {currentView === 'landing' ? (
        <div className="flex-1 flex flex-col">
          <Navbar
            lang={lang}
            onToggleLang={toggleLanguage}
            onOpenAuth={handleOpenAuth}
            currentView={currentView}
            onNavigate={setCurrentView}
            isLoggedIn={isLoggedIn}
          />
          <main className="flex-1">
            <LandingPage
              lang={lang}
              onOpenAuth={handleOpenAuth}
              onNavigate={setCurrentView}
              onStartDemo={() => {
                const demoEl = document.getElementById('demo');
                demoEl?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </main>
        </div>
      ) : (
        /* 2. AUTHENTICATED APP VIEWS (WITH SIDEBAR & TOPBAR) */
        <div className="flex-1 flex h-screen overflow-hidden">
          {/* Collapsible Sidebar */}
          <div className="hidden md:flex h-full">
            <Sidebar
              lang={lang}
              currentView={currentView}
              generatorTab={generatorTab}
              onNavigate={setCurrentView}
              onSelectGeneratorTab={(tab) => {
                setCurrentView('generator');
                setGeneratorTab(tab);
              }}
              user={user}
              onLogout={handleLogout}
            />
          </div>

          {/* Mobile Menu Backdrop */}
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div 
                className="w-72 h-full bg-[#111928]"
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar
                  lang={lang}
                  currentView={currentView}
                  generatorTab={generatorTab}
                  onNavigate={(v) => {
                    setCurrentView(v);
                    setMobileMenuOpen(false);
                  }}
                  onSelectGeneratorTab={(tab) => {
                    setCurrentView('generator');
                    setGeneratorTab(tab);
                    setMobileMenuOpen(false);
                  }}
                  user={user}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          )}

          {/* Main Area: Topbar + View Content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Topbar
              lang={lang}
              onToggleLang={toggleLanguage}
              user={user}
              onNavigate={setCurrentView}
              onStartNewVideo={handleStartNewVideo}
              onToggleMobileMenu={() => setMobileMenuOpen(true)}
            />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0F172A]">
              <div className="max-w-7xl mx-auto">
                {/* DASHBOARD VIEW */}
                {currentView === 'dashboard' && (
                  <DashboardView
                    lang={lang}
                    user={user}
                    projects={projects}
                    scheduledPosts={scheduledPosts}
                    onNavigate={setCurrentView}
                    onSelectGeneratorTab={(tab) => {
                      setCurrentView('generator');
                      setGeneratorTab(tab);
                    }}
                    onOpenProject={(proj) => {
                      setSelectedProjectForVideo(proj);
                      if (proj.script) {
                        setSelectedScriptForVideo(proj.script);
                      }
                      setCurrentView('generator');
                      setGeneratorTab('video');
                    }}
                  />
                )}

                {/* CONTENT GENERATOR VIEW (WITH 4 SUB-TABS) */}
                {currentView === 'generator' && (
                  <div className="space-y-6">
                    {/* Sub-tabs header bar */}
                    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 max-w-2xl overflow-x-auto">
                      <button
                        onClick={() => setGeneratorTab('brainstorm')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          generatorTab === 'brainstorm'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span>{t.brainstormTab}</span>
                      </button>

                      <button
                        onClick={() => setGeneratorTab('script')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          generatorTab === 'script'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>{t.scriptTab}</span>
                      </button>

                      <button
                        onClick={() => setGeneratorTab('video')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          generatorTab === 'video'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        <span>{t.videoTab}</span>
                      </button>

                      <button
                        onClick={() => setGeneratorTab('captions')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          generatorTab === 'captions'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Hash className="w-4 h-4" />
                        <span>{t.captionsTab}</span>
                      </button>
                    </div>

                    {/* Sub-tab view components */}
                    {generatorTab === 'brainstorm' && (
                      <BrainstormView
                        lang={lang}
                        onUseScript={handleUseScriptFromBrainstorm}
                      />
                    )}

                    {generatorTab === 'script' && (
                      <ScriptWriterView
                        lang={lang}
                        selectedIdea={selectedIdeaForScript}
                        onSendToVideo={handleSendToVideoStudio}
                      />
                    )}

                    {generatorTab === 'video' && (
                      <VideoCreatorView
                        lang={lang}
                        initialScript={selectedScriptForVideo}
                        initialProject={selectedProjectForVideo}
                        onVideoCreated={handleVideoCreated}
                      />
                    )}

                    {generatorTab === 'captions' && (
                      <CaptionsView lang={lang} />
                    )}
                  </div>
                )}

                {/* CALENDAR VIEW */}
                {currentView === 'calendar' && (
                  <CalendarView lang={lang} />
                )}

                {/* AUTO PUBLISHER VIEW */}
                {currentView === 'publisher' && (
                  <AutoPublisherView lang={lang} />
                )}

                {/* PRICING VIEW */}
                {currentView === 'pricing' && (
                  <PricingView
                    lang={lang}
                    user={user}
                    onUpgradePlan={handleUpgradePlan}
                  />
                )}

                {/* SETTINGS VIEW */}
                {currentView === 'settings' && (
                  <SettingsView
                    lang={lang}
                    user={user}
                    onUpdateUser={handleUpdateUser}
                    onToggleLang={toggleLanguage}
                  />
                )}

                {/* HELP CENTER VIEW */}
                {currentView === 'help' && (
                  <HelpCenterView lang={lang} />
                )}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        lang={lang}
        onSuccessAuth={handleSuccessAuth}
      />

      {/* Onboarding Flow Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onComplete={handleCompleteOnboarding}
        lang={lang}
        user={user}
      />
    </div>
  );
}
