import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Share2, 
  CreditCard,
  Zap,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: { niche: string; plan: 'Free' | 'Pro' }) => void;
  lang: Language;
  user: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  lang,
  user,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedNiche, setSelectedNiche] = useState('الذكاء الاصطناعي والتقنية');
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(['TikTok', 'Instagram']);
  const [selectedPlan, setSelectedPlan] = useState<'Free' | 'Pro'>('Pro');

  if (!isOpen) return null;

  const niches = [
    { id: 'tech', nameAr: 'تكنولوجيا وذكاء اصطناعي', nameEn: 'AI & Future Tech', emoji: '🤖' },
    { id: 'finance', nameAr: 'أموال واستثمار وكريبتو', nameEn: 'Finance & Wealth', emoji: '💰' },
    { id: 'facts', nameAr: 'فضاء وغرائب وحقائق غامضة', nameEn: 'Space & Mysteries', emoji: '🌌' },
    { id: 'psychology', nameAr: 'علم نفس ولغة الجسد', nameEn: 'Psychology & Mind', emoji: '🧠' },
    { id: 'motivation', nameAr: 'تحفيز وإنتاجية وتطوير ذات', nameEn: 'Stoicism & Motivation', emoji: '🔥' },
    { id: 'history', nameAr: 'قصص تاريخية ووثائقيات', nameEn: 'History Documentaries', emoji: '📜' },
  ];

  const platforms = [
    { id: 'TikTok', name: 'TikTok', color: 'hover:border-pink-500', desc: 'أعلى نسبة انتشار فيروسي' },
    { id: 'Instagram', name: 'Instagram Reels', color: 'hover:border-purple-500', desc: 'بناء جمهور وعلامة تجارية' },
    { id: 'YouTube', name: 'YouTube Shorts', color: 'hover:border-red-500', desc: 'أعلى أرباح إعلانية مستمرة' },
    { id: 'Facebook', name: 'Facebook Reels', color: 'hover:border-blue-500', desc: 'تفاعل سريع وجماهيري' },
  ];

  const togglePlatform = (p: string) => {
    if (connectedPlatforms.includes(p)) {
      setConnectedPlatforms(connectedPlatforms.filter(item => item !== p));
    } else {
      setConnectedPlatforms([...connectedPlatforms, p]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as 2 | 3);
    } else {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      onComplete({
        niche: selectedNiche,
        plan: selectedPlan,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#1E293B] border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-10 animate-in fade-in zoom-in-95">
        {/* Stepper Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className={step >= 1 ? 'text-indigo-400 font-bold' : ''}>
              1. {lang === 'ar' ? 'اختيار النيش' : 'Choose Niche'}
            </span>
            <span className={step >= 2 ? 'text-indigo-400 font-bold' : ''}>
              2. {lang === 'ar' ? 'ربط الحسابات' : 'Connect Platforms'}
            </span>
            <span className={step >= 3 ? 'text-indigo-400 font-bold' : ''}>
              3. {lang === 'ar' ? 'اختيار الخطة' : 'Select Plan'}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Choose Niche */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <span className="inline-flex p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-2">
                <Layers className="w-6 h-6" />
              </span>
              <h2 className="text-2xl font-bold text-white">
                {lang === 'ar' ? 'ما هو نيش أو تخصص قناتك الرئيسي؟' : 'What is your primary channel niche?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {lang === 'ar' ? 'يقوم الذكاء الاصطناعي بتوليد أفكار وسكريبتات متطابقة مع جمهور هذا النيش' : 'AI will tailor viral hooks and scripts to match this audience'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {niches.map((n) => {
                const isSelected = selectedNiche === (lang === 'ar' ? n.nameAr : n.nameEn);
                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNiche(lang === 'ar' ? n.nameAr : n.nameEn)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                        : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl">{n.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{lang === 'ar' ? n.nameAr : n.nameEn}</div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Connect Social Accounts */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <span className="inline-flex p-2.5 rounded-2xl bg-pink-500/20 text-pink-400 mb-2">
                <Share2 className="w-6 h-6" />
              </span>
              <h2 className="text-2xl font-bold text-white">
                {lang === 'ar' ? 'حدد المنصات التي تريد النشر عليها' : 'Select platforms to publish on'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {lang === 'ar' ? 'يمكنك ربط الحسابات مباشرة أو تفعيل النشر التلقائي لاحقاً' : 'You can link accounts now or manage auto-publishing anytime'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {platforms.map((p) => {
                const isConnected = connectedPlatforms.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isConnected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{p.name}</div>
                      <div className="text-xs text-slate-400">{p.desc}</div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isConnected ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {isConnected ? (lang === 'ar' ? 'محدد ✓' : 'Selected ✓') : (lang === 'ar' ? 'اختيار' : 'Select')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Choose Plan */}
        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <span className="inline-flex p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-2">
                <CreditCard className="w-6 h-6" />
              </span>
              <h2 className="text-2xl font-bold text-white">
                {lang === 'ar' ? 'اختر خطتك للانطلاق' : 'Select your launch plan'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {lang === 'ar' ? 'يمكنك تجربة Pro مجاناً بدون إدخال بطاقة ائتمان أول 7 أيام' : 'Try Pro free with no credit card required for 7 days'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Free Plan */}
              <div
                onClick={() => setSelectedPlan('Free')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlan === 'Free'
                    ? 'bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/40'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white">Starter (Free)</span>
                  <span className="text-sm font-bold text-slate-400">$0</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 mb-3">
                  <li className="flex items-center gap-1.5">✓ 3 {lang === 'ar' ? 'فيديوهات شهرياً' : 'videos / month'}</li>
                  <li className="flex items-center gap-1.5">✓ 1 {lang === 'ar' ? 'صوت AI أساسي' : 'basic voice'}</li>
                  <li className="flex items-center gap-1.5">✓ {lang === 'ar' ? 'جدولة لمنصة واحدة' : '1 platform schedule'}</li>
                </ul>
              </div>

              {/* Pro Plan */}
              <div
                onClick={() => setSelectedPlan('Pro')}
                className={`relative p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlan === 'Pro'
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {lang === 'ar' ? 'موصى به' : 'Recommended'}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white flex items-center gap-1">
                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    Professional (Pro)
                  </span>
                  <span className="text-base font-bold text-indigo-400">$19<span className="text-xs text-slate-400">/mo</span></span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 mb-3">
                  <li className="flex items-center gap-1.5">✓ 30 {lang === 'ar' ? 'فيديو شهرياً بجودة 4K' : '4K videos / month'}</li>
                  <li className="flex items-center gap-1.5">✓ 10 {lang === 'ar' ? 'أصوات AI متميزة' : 'premium AI voices'}</li>
                  <li className="flex items-center gap-1.5">✓ {lang === 'ar' ? 'نشر تلقائي لـ 3 منصات' : 'Auto publish to 3 channels'}</li>
                  <li className="flex items-center gap-1.5">✓ {lang === 'ar' ? 'بدون علامة مائية نهائياً' : 'No watermarks'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Modal Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as 1 | 2)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              <span>{lang === 'ar' ? 'السابق' : 'Back'}</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:opacity-95 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all"
            id="onboarding-next-btn"
          >
            <span>{step === 3 ? (lang === 'ar' ? 'الدخول إلى لوحة التحكم 🚀' : 'Enter Dashboard 🚀') : (lang === 'ar' ? 'التالي' : 'Continue')}</span>
            <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
