import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Check, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { translations } from '../translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
  lang: Language;
  onSuccessAuth: (userData: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  lang,
  onSuccessAuth,
}) => {
  const t = translations[lang];
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  // Password strength calculation
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) score += 25;
    return score;
  };

  const strengthScore = calculateStrength(password);

  const getStrengthLabel = () => {
    if (strengthScore <= 25) return { label: lang === 'ar' ? 'ضعيفة' : 'Weak', color: 'bg-red-500 text-red-400' };
    if (strengthScore <= 50) return { label: lang === 'ar' ? 'مقبولة' : 'Fair', color: 'bg-amber-500 text-amber-400' };
    if (strengthScore <= 75) return { label: lang === 'ar' ? 'جيدة' : 'Good', color: 'bg-indigo-500 text-indigo-400' };
    return { label: lang === 'ar' ? 'قوية جداً 🔒' : 'Very Strong 🔒', color: 'bg-emerald-500 text-emerald-400' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'forgot') {
      if (!email.includes('@')) {
        setErrorMsg(lang === 'ar' ? 'الرجاء إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
        return;
      }
      setForgotSent(true);
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg(lang === 'ar' ? 'الرجاء إدخال بريد إلكتروني صالح' : 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setErrorMsg(lang === 'ar' ? 'كلمة المرور يجب ألا تقل عن 6 أحرف' : 'Password must be at least 6 characters');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMsg(lang === 'ar' ? 'الرجاء إدخال اسمك الكامل' : 'Please enter your name');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg(lang === 'ar' ? 'يجب الموافقة على شروط الاستخدام' : 'You must accept the terms of service');
        return;
      }
    }

    // Success animation
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onSuccessAuth({
      name: name.trim() || (email.split('@')[0]),
      email: email.trim(),
    });
  };

  const handleOAuthLogin = (provider: 'Google' | 'Apple') => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    onSuccessAuth({
      name: `${provider} Creator`,
      email: `creator.${provider.toLowerCase()}@faceless.io`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#1E293B] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          id="auth-modal-close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Form Column */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {mode === 'login' && (lang === 'ar' ? 'تسجيل الدخول إلى Faceless Studio' : 'Log in to Faceless Studio')}
              {mode === 'signup' && (lang === 'ar' ? 'إنشاء حساب جديد مجاناً' : 'Create Free Account')}
              {mode === 'forgot' && (lang === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {mode === 'login' && (lang === 'ar' ? 'أهلاً بعودتك! تابع إدارة ونشر فيديوهات قنواتك' : 'Welcome back! Manage and publish your channels')}
              {mode === 'signup' && (lang === 'ar' ? 'ابدأ الآن بإنتاج فيديوهات احترافية بدون تصوير' : 'Start generating faceless viral videos without shooting')}
              {mode === 'forgot' && (lang === 'ar' ? 'أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين' : 'Enter your email to receive recovery instructions')}
            </p>
          </div>

          {/* Social OAuth Buttons */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => handleOAuthLogin('Google')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-white transition-colors"
                id="btn-oauth-google"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('Apple')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-white transition-colors"
                id="btn-oauth-apple"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.88c.64-.78 1.08-1.86.96-2.95-.93.04-2.05.62-2.71 1.4-.58.67-1.09 1.77-.96 2.83 1.04.08 2.08-.52 2.71-1.28z"/>
                </svg>
                <span>Apple</span>
              </button>
            </div>
          )}

          {mode !== 'forgot' && (
            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-slate-700 w-full" />
              <span className="bg-[#1E293B] px-3 text-[11px] text-slate-400 absolute">
                {lang === 'ar' ? 'أو بالبريد الإلكتروني' : 'Or with email'}
              </span>
            </div>
          )}

          {/* Form */}
          {forgotSent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {lang === 'ar' ? 'تم إرسال الرابط بنجاح!' : 'Link Sent Successfully!'}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {lang === 'ar' ? `راجع صندوق بريدك ${email} للتعليمات.` : `Check your inbox at ${email} for instructions.`}
              </p>
              <button
                type="button"
                onClick={() => { setMode('login'); setForgotSent(false); }}
                className="text-xs font-semibold text-indigo-400 hover:underline"
              >
                {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${
                      lang === 'ar' ? 'right-3' : 'left-3'
                    }`} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'ar' ? 'محمد أحمد' : 'Alex Johnson'}
                      className={`w-full h-10 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 ${
                        lang === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                      }`}
                      id="auth-name-input"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${
                    lang === 'ar' ? 'right-3' : 'left-3'
                  }`} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full h-10 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 ${
                      lang === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                    }`}
                    id="auth-email-input"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-indigo-400 hover:underline"
                      >
                        {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${
                      lang === 'ar' ? 'right-3' : 'left-3'
                    }`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full h-10 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 ${
                        lang === 'ar' ? 'pr-9 pl-9' : 'pl-9 pr-9'
                      }`}
                      id="auth-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-white ${
                        lang === 'ar' ? 'left-3' : 'right-3'
                      }`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator for Signup */}
                  {mode === 'signup' && password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-400">{lang === 'ar' ? 'قوة كلمة المرور:' : 'Password strength:'}</span>
                        <span className={`font-semibold ${getStrengthLabel().color.split(' ')[1]}`}>
                          {getStrengthLabel().label}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getStrengthLabel().color.split(' ')[0]}`}
                          style={{ width: `${strengthScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${
                      lang === 'ar' ? 'right-3' : 'left-3'
                    }`} />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full h-10 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 ${
                        lang === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                      }`}
                      id="auth-confirm-password-input"
                    />
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400">
                    {lang === 'ar' ? 'أوافق على شروط الخدمة وسياسة الخصوصية' : 'I agree to the Terms of Service & Privacy Policy'}
                  </span>
                </label>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-600 hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mt-2"
                id="auth-submit-btn"
              >
                <span>
                  {mode === 'login' && t.login}
                  {mode === 'signup' && t.signup}
                  {mode === 'forgot' && (lang === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link')}
                </span>
                <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </form>
          )}

          {/* Mode Switcher */}
          <div className="mt-5 text-center text-xs text-slate-400">
            {mode === 'login' && (
              <p>
                {lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-indigo-400 font-semibold hover:underline"
                >
                  {t.signup}
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-indigo-400 font-semibold hover:underline"
                >
                  {t.login}
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-indigo-400 font-semibold hover:underline"
              >
                {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </button>
            )}
          </div>
        </div>

        {/* Visual Right Column (Split Screen Design) */}
        <div className="hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-l border-slate-700/50 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'آمن وموثوق 100%' : '100% Secure & AI-Powered'}</span>
            </div>
            <h3 className="text-xl font-bold text-white leading-relaxed mb-3">
              {lang === 'ar' ? 'أطلق قناتك الرابحة بدون الظهور أمام الكاميرا' : 'Launch your profitable channel without appearing on camera'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ar' 
                ? 'أكثر من 12,000 صانع محتوى يعتمدون على Faceless Studio لإنتاج ونشر الفيديوهات الفيروسية تلقائياً على مدار الساعة.'
                : 'Over 12,000 creators trust Faceless Studio to automate viral video production and cross-platform publishing.'}
            </p>
          </div>

          {/* Social Proof Mini Feature Cards */}
          <div className="relative z-10 space-y-2.5 my-6">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                +450%
              </div>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'ar' ? 'متوسط زيادة المشاهدات' : 'Average View Increase'}</div>
                <div className="text-[10px] text-slate-400">{lang === 'ar' ? 'خلال أول 30 يوم من الجدولة' : 'In the first 30 days'}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                3 Min
              </div>
              <div>
                <div className="text-xs font-bold text-white">{lang === 'ar' ? 'من الفكرة حتى النشر' : 'From Idea to Published Video'}</div>
                <div className="text-[10px] text-slate-400">{lang === 'ar' ? 'توفير 95% من وقت المونتاج' : '95% time saved on editing'}</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-slate-500">
            © 2026 Faceless Studio. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};
