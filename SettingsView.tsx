import React, { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserProfile } from '../types';
import { translations } from '../translations';
import { MOCK_VOICES } from '../mockData';

interface SettingsViewProps {
  lang: Language;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onToggleLang: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  lang,
  user,
  onUpdateUser,
  onToggleLang,
}) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'profile' | 'accounts' | 'billing' | 'ai' | 'notifications' | 'appearance'>('profile');

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [primaryNiche, setPrimaryNiche] = useState(user.primaryNiche);
  const [preferredVoice, setPreferredVoice] = useState(user.preferredVoice);
  const [preferredDialect, setPreferredDialect] = useState(user.preferredDialect);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email,
      primaryNiche,
      preferredVoice,
      preferredDialect,
    });
    setSavedSuccess(true);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile' as const, labelAr: 'الملف الشخصي', labelEn: 'Profile', icon: User },
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
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-md">
        <h2 className="text-xl font-bold text-white tracking-tight">{t.settings}</h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ar' ? 'إدارة حسابك، اشتراكك، وتخصيص إعدادات التوليد الآلي' : 'Manage account security, subscription tiers, and automation presets'}
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
              <span>{lang === 'ar' ? 'تم حفظ التغييرات بنجاح!' : 'Settings saved successfully!'}</span>
            </div>
          )}

          {/* 1. PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-base font-bold text-white mb-4">
                {lang === 'ar' ? 'معلومات الملف الشخصي' : 'Personal Profile Information'}
              </h3>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500"
                />
                <div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold"
                  >
                    {lang === 'ar' ? 'تغيير الصورة' : 'Change Avatar'}
                  </button>
                  <p className="text-[11px] text-slate-400 mt-1">JPG, PNG or WebP, max 2MB</p>
                </div>
              </div>

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

              <div className="pt-4 border-t border-slate-700">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          )}

          {/* 2. CONNECTED ACCOUNTS */}
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

          {/* 3. BILLING & PLANS */}
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

          {/* 4. AI PREFERENCES */}
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

          {/* 5. NOTIFICATIONS */}
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

          {/* 6. APPEARANCE & LANGUAGE */}
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
