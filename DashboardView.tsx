import React from 'react';
import { 
  Video, 
  CalendarDays, 
  Eye, 
  TrendingUp, 
  Plus, 
  Lightbulb, 
  Send, 
  Sparkles, 
  Play, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  MoreVertical,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { Language, UserProfile, VideoProject, ScheduledPost, ViewMode, GeneratorTab } from '../types';
import { translations } from '../translations';

interface DashboardViewProps {
  lang: Language;
  user: UserProfile;
  projects: VideoProject[];
  scheduledPosts: ScheduledPost[];
  onNavigate: (view: ViewMode) => void;
  onSelectGeneratorTab: (tab: GeneratorTab) => void;
  onOpenProject: (project: VideoProject) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lang,
  user,
  projects,
  scheduledPosts,
  onNavigate,
  onSelectGeneratorTab,
  onOpenProject,
}) => {
  const t = translations[lang];

  // Stats
  const totalViews = projects.reduce((acc, p) => acc + (p.views || 0), 128400);

  const stats = [
    {
      title: t.statsVideos,
      value: `${projects.length}`,
      change: '+12 هذا الشهر',
      changeEn: '+12 this month',
      icon: Video,
      color: 'from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-400',
    },
    {
      title: t.statsScheduled,
      value: `${scheduledPosts.filter(p => p.status === 'scheduled').length}`,
      change: 'جاهز للنشر التلقائي',
      changeEn: 'Queued for auto post',
      icon: CalendarDays,
      color: 'from-pink-500 to-pink-600',
      textColor: 'text-pink-400',
    },
    {
      title: t.statsViews,
      value: `${(totalViews / 1000).toFixed(1)}K`,
      change: '+34.2% مقارنة بالماضي',
      changeEn: '+34.2% vs last month',
      icon: Eye,
      color: 'from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-400',
    },
    {
      title: t.statsFollowers,
      value: '+18.4K',
      change: '+450 يومياً عبر TikTok',
      changeEn: '+450/day across TikTok',
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-600',
      textColor: 'text-amber-400',
    },
  ];

  const getStatusBadge = (status: VideoProject['status']) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            {t.statusPublished}
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <CheckCircle2 className="w-3 h-3" />
            {t.statusReady}
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
            <Clock className="w-3 h-3" />
            {t.statusProcessing}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-700 text-slate-300">
            {t.statusDraft}
          </span>
        );
    }
  };

  const weekDays = [
    { dayAr: 'السبت', dayEn: 'Sat', date: '30 Aug', posts: 2, platform: 'TikTok' },
    { dayAr: 'الأحد', dayEn: 'Sun', date: '31 Aug', posts: 1, platform: 'Instagram' },
    { dayAr: 'الإثنين', dayEn: 'Mon', date: '01 Sep', posts: 3, platform: 'YouTube' },
    { dayAr: 'الثلاثاء', dayEn: 'Tue', date: '02 Sep', posts: 1, platform: 'TikTok' },
    { dayAr: 'الأربعاء', dayEn: 'Wed', date: '03 Sep', posts: 2, platform: 'Facebook' },
    { dayAr: 'الخميس', dayEn: 'Thu', date: '04 Sep', posts: 1, platform: 'Instagram' },
    { dayAr: 'الجمعة', dayEn: 'Fri', date: '05 Sep', posts: 2, platform: 'TikTok' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'النيش النشط: ' + user.primaryNiche : 'Active Niche: ' + user.primaryNiche}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-cairo">
              {lang === 'ar' ? `أهلاً بك، ${user.name} 👋` : `Welcome back, ${user.name} 👋`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {lang === 'ar' 
                ? 'قنواتك متصلة وتعمل تلقائياً. لديك 3 فيديوهات جديدة جاهزة للجدولة بنقرة واحدة.'
                : 'Your channels are connected and auto-syncing. 3 new videos are ready for scheduling.'}
            </p>
          </div>

          {/* Quick Actions (Buttons) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                onNavigate('generator');
                onSelectGeneratorTab('video');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
              id="dash-quick-new-video"
            >
              <Plus className="w-4 h-4" />
              <span>{t.newVideo}</span>
            </button>

            <button
              onClick={() => {
                onNavigate('generator');
                onSelectGeneratorTab('brainstorm');
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs sm:text-sm font-semibold transition-colors"
              id="dash-quick-ideas"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>{t.generateIdeas}</span>
            </button>

            <button
              onClick={() => onNavigate('calendar')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs sm:text-sm font-semibold transition-colors"
              id="dash-quick-schedule"
            >
              <CalendarDays className="w-4 h-4 text-pink-400" />
              <span>{t.schedulePost}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{item.title}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {item.value}
              </div>
              <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 font-medium">{lang === 'ar' ? item.change : item.changeEn}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* TWO COLUMNS: Recent Projects & Content Calendar Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Projects */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-slate-800/40 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{t.recentProjects}</h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar' ? 'فيديوهاتك الأخيرة وحالتها على المنصات' : 'Your latest generated videos and statuses'}
              </p>
            </div>
            <button
              onClick={() => {
                onNavigate('generator');
                onSelectGeneratorTab('video');
              }}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj)}
                className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-indigo-500/50 hover:bg-slate-800 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                    <img
                      src={proj.thumbnailUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                  </div>
                  <div className="truncate">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {proj.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 font-semibold text-indigo-400">
                        {proj.platform}
                      </span>
                      <span>•</span>
                      <span>{proj.durationSeconds}s</span>
                      <span>•</span>
                      <span>{proj.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {getStatusBadge(proj.status)}
                  {proj.views ? (
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {(proj.views / 1000).toFixed(1)}K views
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: AI Suggestions & Mini Calendar */}
        <div className="space-y-6">
          {/* AI Suggestions Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-800/80 to-slate-900 border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-bold text-white">{t.aiSuggestionsTitle}</h3>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 mb-3">
              <span className="text-[10px] font-bold text-pink-400 block mb-1">
                🔥 {lang === 'ar' ? 'ترند متصاعد اليوم' : 'Trending Topic Today'}
              </span>
              <p className="text-xs text-white font-medium leading-relaxed">
                {lang === 'ar' 
                  ? 'لماذا تفشل 90% من الشركات في تبني الذكاء الاصطناعي وما هو البديل؟' 
                  : 'Why 90% of businesses fail at AI adoption and the solution'}
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>Trend Score: 98%</span>
                <span className="text-emerald-400 font-bold">TikTok / Shorts</span>
              </div>
            </div>
            <button
              onClick={() => {
                onNavigate('generator');
                onSelectGeneratorTab('script');
              }}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors text-center"
            >
              {lang === 'ar' ? 'كتابة سكريبت لهذا الترند ✍️' : 'Write Script for this Trend ✍️'}
            </button>
          </div>

          {/* Mini Content Calendar Preview */}
          <div className="p-5 rounded-3xl bg-slate-800/40 border border-slate-700/80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">{t.contentCalendarPreview}</h3>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-[11px] font-bold text-indigo-400 hover:underline"
              >
                {lang === 'ar' ? 'عرض التقويم' : 'Open'}
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {weekDays.map((w, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-slate-800 border border-slate-700/70 hover:border-indigo-500/50 transition-colors"
                >
                  <div className="text-[10px] text-slate-400">{lang === 'ar' ? w.dayAr : w.dayEn}</div>
                  <div className="text-xs font-bold text-white my-1">{w.date.split(' ')[0]}</div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mx-auto" />
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>{lang === 'ar' ? 'المنشورات المجدولة هذا الأسبوع:' : 'Posts scheduled this week:'}</span>
              <span className="font-bold text-emerald-400">8 {lang === 'ar' ? 'منشورات' : 'posts'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
