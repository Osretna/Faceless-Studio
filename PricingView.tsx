import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserProfile } from '../types';
import { translations } from '../translations';
import { PRICING_PLANS } from '../mockData';

interface PricingViewProps {
  lang: Language;
  user: UserProfile;
  onUpgradePlan: (planName: 'Free' | 'Pro' | 'Agency') => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  lang,
  user,
  onUpgradePlan,
}) => {
  const t = translations[lang];

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelect = (plan: typeof PRICING_PLANS[0]) => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    onUpgradePlan(plan.id as any);
  };

  const comparisonRows = [
    { nameAr: 'عدد الفيديوهات الشهرية', nameEn: 'Monthly Videos', free: '3', pro: '30', agency: 'غير محدود (Unlimited)' },
    { nameAr: 'دقة الفيديو وجودته', nameEn: 'Render Resolution', free: '720p', pro: '1080p FHD & 4K', agency: '4K Ultra HD 60fps' },
    { nameAr: 'أصوات الذكاء الاصطناعي', nameEn: 'AI Voices', free: '1 صوت أساسي', pro: '10 أصوات بريميوم', agency: 'جميع الأصوات + استنساخ' },
    { nameAr: 'علامة مائية', nameEn: 'Watermark', free: 'نعم', pro: 'بدون علامة مائية', agency: 'بدون علامة مائية' },
    { nameAr: 'عدد المنصات المجدولة', nameEn: 'Connected Platforms', free: '1 منصة', pro: '3 منصات', agency: 'جميع المنصات' },
    { nameAr: 'النشر التلقائي السحابي', nameEn: 'Cloud Auto-Publish', free: false, pro: true, agency: true },
    { nameAr: 'الترجمة الحركية الفيروسية', nameEn: 'Kinetic Subtitles', free: true, pro: true, agency: true },
    { nameAr: 'الوصول لواجهة البرمجة (API)', nameEn: 'API Access', free: false, pro: false, agency: true },
    { nameAr: 'أعضاء الفريق', nameEn: 'Team Seats', free: '1', pro: '1', agency: '5 أعضاء' },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{lang === 'ar' ? 'استثمر في قناتك القادمة بأعلى عائد' : 'High ROI Video Automation Plans'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-cairo">
          {lang === 'ar' ? 'خطط شفافة بدون أي تكاليف خفية' : 'Transparent Pricing. Cancel Anytime.'}
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          {lang === 'ar' ? 'اختر الخطة المناسبة لحجم قنواتك وابدأ في نشر فيديوهات عالية المشاهدة تلقائياً.' : 'Scale your channels effortlessly with our battle-tested pipeline.'}
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-800 border border-slate-700">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.monthly}
          </button>

          <button
            onClick={() => setBillingCycle('yearly')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.yearly}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
              {t.discountYearly}
            </span>
          </button>
        </div>
      </div>

      {/* 3 PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {PRICING_PLANS.map((plan) => {
          const isPro = plan.popular;
          const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
          const isCurrentPlan = user.plan.toLowerCase() === plan.id.toLowerCase();

          return (
            <div
              key={plan.id}
              className={`relative p-8 rounded-3xl border flex flex-col justify-between transition-all ${
                isPro
                  ? 'bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20'
                  : 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-[11px] font-black px-3.5 py-0.5 rounded-full uppercase shadow">
                  {t.popularBadge}
                </div>
              )}

              <div>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  {plan.name}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-6">
                  {lang === 'ar' ? plan.descriptionAr : plan.descriptionEn}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white font-mono">${price}</span>
                  <span className="text-xs text-slate-400">/{lang === 'ar' ? 'شهر' : 'month'}</span>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-700/60 text-xs">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-slate-200">
                      <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700/60">
                <button
                  onClick={() => handleSelect(plan)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all ${
                    isCurrentPlan
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : isPro
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:opacity-95 text-white shadow-indigo-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {isCurrentPlan ? (lang === 'ar' ? 'خطتك الحالية' : 'Current Plan') : (lang === 'ar' ? 'اختيار هذه الخطة' : 'Choose Plan')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MONEY BACK GUARANTEE BADGE */}
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-3 text-center">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
        <span className="text-xs text-emerald-300 font-semibold">
          {lang === 'ar' ? 'ضمان استرجاع الأموال بنسبة 100% خلال 14 يوماً إذا لم تعجبك نتائج الفيديوهات المولدة.' : '14-Day 100% Money-Back Guarantee if you are not satisfied with video results.'}
        </span>
      </div>

      {/* DETAILED COMPARISON TABLE */}
      <div className="max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-xl space-y-6">
        <h3 className="text-xl font-bold text-white tracking-tight text-center font-cairo">
          {lang === 'ar' ? 'مقارنة الميزات التفصيلية' : 'Detailed Feature Matrix'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="pb-3 pr-4">{lang === 'ar' ? 'الميزة' : 'Feature'}</th>
                <th className="pb-3 text-center">Starter (Free)</th>
                <th className="pb-3 text-center text-indigo-400 font-bold">Pro Creator ✨</th>
                <th className="pb-3 text-center">Agency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 pr-4 text-white font-medium">
                    {lang === 'ar' ? row.nameAr : row.nameEn}
                  </td>
                  <td className="py-3.5 text-center text-slate-300">
                    {typeof row.free === 'boolean' ? (
                      row.free ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />
                    ) : row.free}
                  </td>
                  <td className="py-3.5 text-center text-indigo-300 font-semibold bg-indigo-500/5">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />
                    ) : row.pro}
                  </td>
                  <td className="py-3.5 text-center text-slate-300 font-semibold">
                    {typeof row.agency === 'boolean' ? (
                      row.agency ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />
                    ) : row.agency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
