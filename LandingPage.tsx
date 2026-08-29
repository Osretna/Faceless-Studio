import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Lightbulb, 
  FileText, 
  Video, 
  Hash, 
  CalendarDays, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  Star, 
  Zap, 
  ShieldCheck, 
  Users, 
  Clock, 
  Layers,
  BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, ViewMode } from '../types';
import { translations } from '../translations';
import { FAQS } from '../mockData';

interface LandingPageProps {
  lang: Language;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigate: (view: ViewMode) => void;
  onStartDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onOpenAuth,
  onNavigate,
  onStartDemo,
}) => {
  const t = translations[lang];

  // Interactive Live Demo state on the landing page
  const [demoNiche, setDemoNiche] = useState('الذكاء الاصطناعي');
  const [demoPlatform, setDemoPlatform] = useState('TikTok');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<{
    hook: string;
    body: string;
    cta: string;
    trendScore: number;
  } | null>({
    hook: 'توقف عن تضييع ساعات في المونتاج! هذا هو السر الخفي لأنجح قنوات الفيسلس اليوم...',
    body: 'القنوات التي تحقق ملايين المشاهدات لا تصور وجوهها، بل تعتمد على ستوك عالي التباين وسرد قصصي سريع وتوليد صوتي عصبي بنبرة حماسية.',
    cta: 'احفظ الفيديو لتطبقه اليوم، واكتب في التعليقات: ما هو مجالك؟',
    trendScore: 98,
  });

  // Active FAQ
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Quick live demo generation
  const handleGenerateLiveDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: demoNiche,
          dialect: 'فصحى معاصرة',
          duration: 30,
          includeCTA: true,
          lang,
        }),
      });
      const data = await res.json();
      if (data.script) {
        setDemoResult({
          hook: data.script.hook,
          body: data.script.body,
          cta: data.script.cta,
          trendScore: 95 + Math.floor(Math.random() * 5),
        });
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      }
    } catch {
      // Fallback
      setDemoResult({
        hook: `هل كنت تعلم هذا السر الصادم عن ${demoNiche}؟`,
        body: `99% من المبتدئين يرتكبون هذا الخطأ القاتل في أول أسبوع، بينما المحترفون يستخدمون الأتمتة لمضاعفة المشاهدات بـ 5 أضعاف.`,
        cta: `تابع الحساب لتتعلم كيف تبني قناتك القادمة بدون ظهور!`,
        trendScore: 96,
      });
    } finally {
      setDemoLoading(false);
    }
  };

  const features = [
    {
      icon: Lightbulb,
      titleAr: 'توليد أفكار ترند فورية',
      titleEn: 'Viral Idea Brainstorming',
      descAr: 'تحليل مستمر لخوارزميات تيك توك ويوتيوب لاقتراح موضوعات عالية التفاعل مع درجات ترند دقيقة.',
      descEn: 'Real-time algorithm analysis pinpointing high-retention topics with quantified trend metrics.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: FileText,
      titleAr: 'كاتب سكريبتات متقدم',
      titleEn: 'AI Script Writing Engine',
      descAr: 'صياغة نصوص مدروسة تبدأ بـ Hook ساحر لخطف المشاهد في أول 3 ثوانٍ وتنتهي بـ CTA تفاعلي قوي.',
      descEn: 'Engineered scripts starting with powerful 3-second hooks, pacing body copy, and conversion-ready CTAs.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Video,
      titleAr: 'صانع فيديوهات بدون تصوير',
      titleEn: 'Automated Video Studio',
      descAr: 'دمج آلي لمقاطع ستوك 4K مرخصة مع موسيقى تصويرية وأصوات ذكاء اصطناعي وترجمة حركية ملونة.',
      descEn: 'Automatic assembly of 4K stock clips, royalty-free audio, realistic voices, and animated captions.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Hash,
      titleAr: 'كابشن وهاشتاجات مُحسنة',
      titleEn: 'SEO Captions & Hashtags',
      descAr: 'كتابة نصوص ترويجية مخصصة لكل منصة مع أفضل الهاشتاجات واقتراح التوقيت الذهبي للنشر.',
      descEn: 'Platform-tailored descriptive captions, viral tags, and personalized golden publishing windows.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: CalendarDays,
      titleAr: 'تقويم محتوى ذكي',
      titleEn: 'Interactive Content Calendar',
      descAr: 'تنظيم وجدولة حملاتك الشهرية والأسبوعية بالسحب والإفلات وتتبع حالة إنتاج كل فيديو بسهولة.',
      descEn: 'Drag-and-drop planning to visualize your monthly cadence and track production status effortlessly.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Send,
      titleAr: 'ناشر تلقائي عبر المنصات',
      titleEn: 'Autonomous Multi-Publisher',
      descAr: 'نشر فوري أو مجدول على TikTok, Instagram Reels, YouTube Shorts, Facebook بدون أي تدخل يدوي.',
      descEn: 'Direct or scheduled distribution to TikTok, Instagram, YouTube Shorts, and Facebook in one click.',
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  const steps = [
    {
      step: '01',
      titleAr: 'اختر النيش وحدد الفكرة',
      titleEn: 'Select Niche & Generate Idea',
      descAr: 'اختر تخصص قناتك وسيقوم الذكاء الاصطناعي باقتراح أقوى موضوعات الترند مع هوك خطاف.',
      descEn: 'Pick your niche and let Gemini propose viral angles, high-curiosity titles, and opening hooks.',
    },
    {
      step: '02',
      titleAr: 'الإنتاج الآلي والتجميع',
      titleEn: 'One-Click Audio & Video Assembly',
      descAr: 'تقوم المنصة بتوليد الصوت البشري الطبيعي، واختيار المقاطع المرئية والموسيقى، وتطبيق الترجمة المتحركة.',
      descEn: 'Neural voiceover synthesis matches with copyright-free b-roll, background music, and animated subtitles.',
    },
    {
      step: '03',
      titleAr: 'الجدولة والنشر الفيروسي',
      titleEn: 'Automated Multi-Channel Growth',
      descAr: 'بضغطة واحدة، يُجدول الفيديو عبر جميع قنواتك الاجتماعية لتحصد آلاف المشاهدات بينما تركز على نمو بيزنسك.',
      descEn: 'One tap schedules the finished video across your connected accounts to build passive reach 24/7.',
    },
  ];

  const testimonials = [
    {
      name: 'عبدالرحمن الشهري',
      role: 'مؤسس قناة ثواني وثائقية (450K متابع)',
      content: 'كنت أقضي 8 ساعات في مونتاج فيديو شورتس واحد.. مع Faceless Studio أنتجت 30 فيديو في يوم واحد وتجاوزت القناة 10 ملايين مشاهدة في شهرين!',
      stats: '+450K Subscribers',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'سارة المنصور',
      role: 'صانعة محتوى في نيش علم النفس والمال',
      content: 'جودة الصوت العربي الطبيعي واختيار اللقطات مذهل جداً. لم أكن أتخيل أنني أستطيع إدارة 3 قنوات تيك توك بدون أن أظهر بوجهي إطلاقاً وبأرباح حقيقية.',
      stats: '$3,400/mo Revenue',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'كريم عزالدين',
      role: 'مسوق رقمي ومدير وكالة نمو',
      content: 'نوفر على عملائنا آلاف الدولارات شهرياً في التصوير والمعدات. المنصة هي السلاح السري لكل مسوق يريد إنتاج محتوى ضخم وسريع.',
      stats: '15 Client Channels',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    }
  ];

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-pink-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>{lang === 'ar' ? 'الجيل الجديد من صناعة المحتوى بالذكاء الاصطناعي 2026' : 'The Next-Gen Faceless Content Engine 2026'}</span>
          </div>

          {/* Main Hero Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.2] max-w-4xl mx-auto font-cairo">
            {lang === 'ar' ? (
              <>
                أنشئ قناة <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-rose-400">Faceless كاملة</span> في دقائق
              </>
            ) : (
              <>
                Build a Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-rose-400">Faceless Channel</span> in Minutes
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.subTagline}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:opacity-95 text-white font-bold text-base shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2.5"
              id="hero-cta-start"
            >
              <span>{t.startFree}</span>
              <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={onStartDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white font-semibold text-base transition-all flex items-center justify-center gap-2.5"
              id="hero-cta-demo"
            >
              <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
              <span>{t.watchDemo}</span>
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {lang === 'ar' ? 'بدون بطاقة ائتمان' : 'No credit card required'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {lang === 'ar' ? '3 فيديوهات مجانية فوراً' : '3 free videos on signup'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {lang === 'ar' ? 'دعم كامل للعربية' : 'Full Arabic & English'}
            </span>
          </div>

          {/* Interactive UI Mockup Hero Showcase */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-slate-700/50 via-slate-800/30 to-slate-900 border border-slate-700/70 shadow-2xl">
            <div className="rounded-2xl bg-[#111928] border border-slate-800 overflow-hidden text-left">
              {/* Fake Window Header */}
              <div className="h-10 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] text-slate-400 ml-2 font-mono">faceless-studio.ai/editor</span>
                </div>
                <div className="text-[11px] text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10">
                  Live Preview Mode
                </div>
              </div>

              {/* Mock Studio Interface */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Left: Script generation card */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Script Engine
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                        98% Viral Score
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white mb-1.5">
                      {lang === 'ar' ? 'الافتتاحية الخطافة (Hook):' : 'Opening Hook (0-3s):'}
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/80 leading-relaxed font-tajawal">
                      "لو بتفكر تبدأ قناة بدون ما تظهر بوجهك، فهذه المعلومة هتغير كل حساباتك..."
                    </p>
                    <div className="mt-3 text-xs font-bold text-white mb-1">
                      {lang === 'ar' ? 'نبرة الصوت المحددة:' : 'Assigned Voice:'}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      آدم (صوت وثائقي عميق - فصحى)
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{lang === 'ar' ? 'المدة المقدرة: 45 ثانية' : 'Duration: 45s'}</span>
                    <span className="text-indigo-400 font-bold">1080p 60fps</span>
                  </div>
                </div>

                {/* Center: Video Player Simulation */}
                <div className="relative aspect-[9/14] sm:aspect-[9/16] md:h-80 mx-auto rounded-2xl overflow-hidden border-2 border-indigo-500/60 shadow-xl group">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80"
                    alt="Faceless Video Player"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Floating animated subtitles */}
                  <div className="absolute bottom-16 inset-x-3 text-center">
                    <span className="inline-block px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wide shadow-lg transform -rotate-1">
                      {lang === 'ar' ? '🔥 5 أدوات سرية ستغير كل شيء' : '🔥 5 SECRET AI TOOLS'}
                    </span>
                  </div>

                  {/* Player controls overlay */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-[11px] bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                      <span>00:14 / 00:45</span>
                    </div>
                    <span className="text-pink-400 font-bold">TikTok / Shorts</span>
                  </div>
                </div>

                {/* Right: Auto Publisher Queue */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5" />
                        Multi-Platform Queue
                      </span>
                      <span className="text-[10px] text-slate-400">Sync Active</span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">TikTok</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                          {lang === 'ar' ? 'مجدول 08:30 م' : 'Scheduled 8:30 PM'}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">Instagram Reels</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                          {lang === 'ar' ? 'مجدول 08:30 م' : 'Scheduled 8:30 PM'}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">YouTube Shorts</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                          {lang === 'ar' ? 'مجدول 08:30 م' : 'Scheduled 8:30 PM'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60">
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors text-center"
                    >
                      {lang === 'ar' ? 'استكشف لوحة التحكم الآن' : 'Explore Dashboard'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF / PLATFORMS BANNER */}
      <section className="py-12 border-y border-slate-800 bg-[#0c1322]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">12,500+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">{lang === 'ar' ? 'صانع محتوى نشط' : 'Active Creators'}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-mono">4.8M+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">{lang === 'ar' ? 'فيديو تم إنتاجه' : 'Videos Produced'}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-pink-400 font-mono">120M+</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">{lang === 'ar' ? 'إجمالي المشاهدات المحققة' : 'Combined Views Generated'}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">99.4%</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">{lang === 'ar' ? 'نسبة نجاح تحقيق الدخل' : 'Monetization Pass Rate'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES GRID (6 MAIN FEATURES) */}
      <section id="features" className="py-20 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              {lang === 'ar' ? 'الميزات الأساسية' : 'Key Capabilities'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 font-cairo">
              {lang === 'ar' ? 'كل ما تحتاجه لإدارة إمبراطورية قنوات بدون وجه' : 'Everything You Need to Run an Automated Video Empire'}
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              {lang === 'ar' 
                ? 'حلول متكاملة تغنيك عن 5 اشتراكات خارجية منفصلة في أدوات الذكاء الاصطناعي والمونتاج والجدولة.'
                : 'Replace 5 separate subscriptions with one seamless autonomous pipeline.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {lang === 'ar' ? feat.titleAr : feat.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {lang === 'ar' ? feat.descAr : feat.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (3 STEPS) */}
      <section id="how-it-works" className="py-20 bg-[#111928] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
              {lang === 'ar' ? 'بساطة فائقة' : 'Effortless Workflow'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 font-cairo">
              {lang === 'ar' ? '3 خطوات فقط تفصلك عن أول فيديو منشور' : 'Just 3 Steps to Your First Viral Upload'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-slate-800/40 border border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl font-extrabold text-slate-700 mb-4 font-mono">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {lang === 'ar' ? s.titleAr : s.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {lang === 'ar' ? s.descAr : s.descEn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center text-xs text-indigo-400 font-semibold">
                  <span>{lang === 'ar' ? 'تلقائي بالكامل' : '100% Automated'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'mr-1 rotate-180' : 'ml-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE DEMO SECTION (TRY IT RIGHT HERE) */}
      <section id="demo" className="py-20 bg-[#0F172A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {lang === 'ar' ? 'جرب بنفسك الآن' : 'Interactive Live Demo'}
            </span>
            <h2 className="text-3xl font-bold text-white mt-3 font-cairo">
              {lang === 'ar' ? 'شاهد الذكاء الاصطناعي يكتب سكريبتك خلال ثوانٍ' : 'Watch AI Craft Your Viral Script in Seconds'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              {lang === 'ar' ? 'اكتب تخصصك وجرب التوليد الفعلي المدعوم بنموذج Gemini' : 'Type any niche below and test live generation powered by Gemini'}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'النيش أو الفكرة:' : 'Niche or Topic:'}
                </label>
                <input
                  type="text"
                  value={demoNiche}
                  onChange={(e) => setDemoNiche(e.target.value)}
                  placeholder="مثال: ذكاء اصطناعي، أسرار التاريخ، علم النفس، نصائح مالية..."
                  className="w-full h-11 px-4 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'المنصة:' : 'Platform:'}
                </label>
                <select
                  value={demoPlatform}
                  onChange={(e) => setDemoPlatform(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram Reels</option>
                  <option value="YouTube">YouTube Shorts</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateLiveDemo}
              disabled={demoLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
              id="btn-live-demo-generate"
            >
              {demoLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.generating}</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'توليد سكريبت تجريبي حي' : 'Generate Live Demo Script'}</span>
                </>
              )}
            </button>

            {/* Generated Output Preview */}
            {demoResult && (
              <div className="mt-6 p-5 rounded-2xl bg-slate-800/80 border border-slate-700 animate-in fade-in">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {lang === 'ar' ? 'نتيجة مولدة بالذكاء الاصطناعي:' : 'Generated AI Script Output:'}
                  </span>
                  <span className="text-xs font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">
                    {demoResult.trendScore}% Trend Score
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60">
                    <span className="text-[11px] font-bold text-indigo-400 block mb-1">
                      {lang === 'ar' ? 'الافتتاحية الخطافة (Hook):' : 'Hook:'}
                    </span>
                    <p className="text-xs sm:text-sm text-white font-semibold leading-relaxed">
                      "{demoResult.hook}"
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60">
                    <span className="text-[11px] font-bold text-indigo-400 block mb-1">
                      {lang === 'ar' ? 'متن المحتوى (Body):' : 'Body:'}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {demoResult.body}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60">
                    <span className="text-[11px] font-bold text-indigo-400 block mb-1">
                      {lang === 'ar' ? 'الدعوة للتفاعل (CTA):' : 'CTA:'}
                    </span>
                    <p className="text-xs sm:text-sm text-pink-300 font-medium">
                      "{demoResult.cta}"
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {lang === 'ar' ? 'أعجبك السكريبت؟ حوله لفيديو كامل بنقرة واحدة:' : 'Ready to turn this into a 4K video?'}
                  </span>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    {lang === 'ar' ? 'إنشاء الفيديو الآن مجاناً 🎬' : 'Create Video Free 🎬'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-20 bg-[#111928] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              {lang === 'ar' ? 'قصص نجاح حقيقية' : 'Creator Results'}
            </span>
            <h2 className="text-3xl font-bold text-white mt-3 font-cairo">
              {lang === 'ar' ? 'ماذا يقول كبار صناع محتوى الفيسلس؟' : 'Trusted by Thousands of Autonomous Creators'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tItem, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    "{tItem.content}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <img
                      src={tItem.avatar}
                      alt={tItem.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{tItem.name}</div>
                      <div className="text-[11px] text-slate-400">{tItem.role}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 px-2 py-1 rounded bg-emerald-500/10">
                    {tItem.stats}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PRICING PREVIEW */}
      <section className="py-20 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              {lang === 'ar' ? 'خطط مرنة' : 'Simple Pricing'}
            </span>
            <h2 className="text-3xl font-bold text-white mt-3 font-cairo">
              {lang === 'ar' ? 'استثمر في قناتك القادمة بأقل من سعر وجبة واحدة' : 'Plans for Individual Creators & Power Agencies'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              {lang === 'ar' ? 'ابدأ مجاناً وقم بالترقية متى ما زاد حجم جمهورك' : 'Start completely free. Upgrade when your channels scale.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Starter</span>
                <h3 className="text-xl font-bold text-white mt-1">Free</h3>
                <div className="text-3xl font-extrabold text-white mt-3 mb-4 font-mono">$0</div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ 3 فيديوهات شهرياً</li>
                  <li className="flex items-center gap-2">✓ 1 منصة نشر مجدولة</li>
                  <li className="flex items-center gap-2">✓ 1 صوت ذكي أساسي</li>
                  <li className="flex items-center gap-2 text-slate-500">✕ علامة مائية صغيرة</li>
                </ul>
              </div>
              <button
                onClick={() => onOpenAuth('signup')}
                className="mt-6 w-full py-2.5 rounded-xl border border-slate-600 hover:border-slate-500 text-white text-xs font-bold transition-colors"
              >
                {t.startFree}
              </button>
            </div>

            {/* Pro Highlighted */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-b from-indigo-950/70 to-slate-900 border-2 border-indigo-500 shadow-2xl flex flex-col justify-between">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase shadow">
                {t.popularBadge}
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase">Professional</span>
                <h3 className="text-xl font-bold text-white mt-1">Pro Creator</h3>
                <div className="text-3xl font-extrabold text-indigo-300 mt-3 mb-4 font-mono">
                  $19<span className="text-xs text-slate-400">/mo</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2 text-white font-semibold">✓ 30 فيديو عالي الدقة شهرياً</li>
                  <li className="flex items-center gap-2">✓ 3 منصات نشر متزامنة</li>
                  <li className="flex items-center gap-2">✓ 10 أصوات ذكاء اصطناعي بريميوم</li>
                  <li className="flex items-center gap-2 text-emerald-400 font-bold">✓ بدون علامة مائية نهائياً</li>
                  <li className="flex items-center gap-2">✓ تحليل الأوقات الذهبية للنشر</li>
                </ul>
              </div>
              <button
                onClick={() => onOpenAuth('signup')}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
              >
                {lang === 'ar' ? 'ابدأ تجربة Pro مجاناً' : 'Start Pro Free Trial'}
              </button>
            </div>

            {/* Agency */}
            <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Enterprise</span>
                <h3 className="text-xl font-bold text-white mt-1">Agency</h3>
                <div className="text-3xl font-extrabold text-white mt-3 mb-4 font-mono">
                  $49<span className="text-xs text-slate-400">/mo</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ فيديوهات غير محدودة</li>
                  <li className="flex items-center gap-2">✓ جميع المنصات الاجتماعية</li>
                  <li className="flex items-center gap-2">✓ جميع أصوات الذكاء الاصطناعي</li>
                  <li className="flex items-center gap-2">✓ 5 أعضاء فريق + وصول API</li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('pricing')}
                className="mt-6 w-full py-2.5 rounded-xl border border-slate-600 hover:border-slate-500 text-white text-xs font-bold transition-colors"
              >
                {lang === 'ar' ? 'عرض تفاصيل الوكالات' : 'View Agency Details'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="py-20 bg-[#111928] border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-white mt-3 font-cairo">
              {lang === 'ar' ? 'الأسئلة الأكثر شيوعاً' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-700/80 bg-slate-800/50 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left sm:text-right gap-4 hover:bg-slate-800/80 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-white">
                      {lang === 'ar' ? faq.qAr : faq.qEn}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-indigo-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-700/40">
                      {lang === 'ar' ? faq.aAr : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA BANNER */}
      <section className="py-20 bg-gradient-to-b from-[#111928] to-[#0F172A] border-t border-slate-800 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-pink-950 border border-indigo-500/40 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-cairo">
              {lang === 'ar' ? 'جاهز لإطلاق أول فيديو لك خلال الـ 5 دقائق القادمة؟' : 'Ready to Launch Your First Video in Under 5 Minutes?'}
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              {lang === 'ar' ? 'انضم إلى 12,000+ صانع محتوى يبنون علامات تجارية بدون ظهور شخصي وبأعلى عوائد.' : 'Join thousands of creators turning automated videos into steady digital income.'}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-500/30 transition-all"
                id="final-cta-btn"
              >
                {lang === 'ar' ? 'ابدأ الآن مجاناً 🚀' : 'Start Free Now 🚀'}
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
              >
                {t.pricing}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="py-12 border-t border-slate-800 bg-[#0A0F1D] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-3 font-cairo">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Faceless Studio
            </div>
            <p className="text-slate-400 leading-relaxed">
              {lang === 'ar' 
                ? 'المنصة الرائدة في أتمتة وتوليد محتوى قنوات الفيسلس بالذكاء الاصطناعي للمسوقين وصناع المحتوى.'
                : 'Autonomous AI video creation and auto-publishing platform for creators and marketers.'}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">{lang === 'ar' ? 'المنتج' : 'Product'}</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white">{t.dashboard}</button></li>
              <li><button onClick={() => onNavigate('generator')} className="hover:text-white">{t.generator}</button></li>
              <li><button onClick={() => onNavigate('calendar')} className="hover:text-white">{t.calendar}</button></li>
              <li><button onClick={() => onNavigate('publisher')} className="hover:text-white">{t.publisher}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">{lang === 'ar' ? 'المصادر والمساعدة' : 'Resources'}</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-white">{t.pricing}</button></li>
              <li><button onClick={() => onNavigate('help')} className="hover:text-white">{t.helpCenter}</button></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              <li><span className="hover:text-white cursor-pointer">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">{lang === 'ar' ? 'النشرة البريدية للأفكار الترند' : 'Trending Viral Newsletter'}</h4>
            <p className="text-slate-400 mb-3">{lang === 'ar' ? 'احصل على 5 أفكار ترند أسبوعياً مجاناً' : 'Get 5 viral hook ideas in your inbox weekly'}</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <button className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shrink-0">
                {lang === 'ar' ? 'اشتراك' : 'Join'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>© 2026 Faceless Studio. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
