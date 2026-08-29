import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Send, 
  CheckCircle2, 
  Play, 
  MessageSquare, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { translations } from '../translations';

interface HelpCenterViewProps {
  lang: Language;
}

export const HelpCenterView: React.FC<HelpCenterViewProps> = ({ lang }) => {
  const t = translations[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const tutorials = [
    {
      titleAr: 'كيف تبدأ أول قناة Faceless رابحة من الصفر؟',
      titleEn: 'How to Launch Your First Profitable Faceless Channel',
      duration: '8 min read',
      tag: 'Beginner',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'أفضل استراتيجيات اختيار النيش عالي العائد الإعلاني (High CPM)',
      titleEn: 'Best High CPM Niches for Faceless Shorts in 2026',
      duration: '6 min read',
      tag: 'Strategy',
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'كيف تحقق 100K متابع في أول 30 يوماً باستخدام خوارزميات TikTok؟',
      titleEn: 'How to Reach 100K Followers in 30 Days on TikTok',
      duration: '12 min video',
      tag: 'Viral Growth',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'دليل استثمار فيديوهات الشورتس وأرباح برامج المبدعين',
      titleEn: 'Complete Guide to Shorts Monetization and Affiliate Links',
      duration: '10 min read',
      tag: 'Monetization',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80',
    }
  ];

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSent(true);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
    }, 1000);
  };

  const filteredTutorials = tutorials.filter(t => 
    t.titleAr.includes(searchQuery) || t.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-pink-950 border border-indigo-500/30 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-cairo">
            {lang === 'ar' ? 'كيف يمكننا مساعدتك اليوم؟' : 'How can we help you succeed?'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 mb-6">
            {lang === 'ar' ? 'ابحث في مقاطع الفيديو التعليمية، الأدلة الإرشادية، أو تواصل مع فريق الخبراء' : 'Browse step-by-step guides, masterclasses, or message our VIP support'}
          </p>

          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${
              lang === 'ar' ? 'right-4' : 'left-4'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن إجابة (مثال: ربط تيك توك، استخراج 4K، الترجمة)...' : 'Search guides (e.g. TikTok linking, 4K rendering, voices)...'}
              className={`w-full h-12 rounded-2xl bg-slate-900/90 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 shadow-xl ${
                lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'
              }`}
            />
          </div>
        </div>
      </div>

      {/* TUTORIAL CARDS */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span>{lang === 'ar' ? 'دروس وأدلة صناعة محتوى الفيسلس' : 'Masterclass Guides & Tutorials'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTutorials.map((tut, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-800/50 border border-slate-700/80 hover:border-indigo-500/50 overflow-hidden transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img src={tut.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-indigo-400">
                  {tut.tag}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                  {lang === 'ar' ? tut.titleAr : tut.titleEn}
                </h3>
                <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{tut.duration}</span>
                  <span className="text-indigo-400 font-semibold flex items-center gap-1">
                    {lang === 'ar' ? 'قراءة' : 'Open'}
                    <ArrowRight className={`w-3 h-3 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUPPORT TICKET & COMMUNITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Ticket Form (2 cols) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-700/80 shadow-xl">
          <h3 className="text-base font-bold text-white mb-1">
            {lang === 'ar' ? 'فتح تذكرة دعم فني مباشرة' : 'Open a Support Ticket'}
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            {lang === 'ar' ? 'فريق الدعم الفني جاهز للرد على استفساراتك ومساعدتك خلال أقل من ساعة.' : 'Our dedicated engineering support replies within 60 minutes.'}
          </p>

          {ticketSent ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-base font-bold text-white">{lang === 'ar' ? 'تم استلام تذكرتك بنجاح!' : 'Ticket Received!'}</h4>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'ar' ? 'رقم التذكرة #FS-9428 - سيتم التواصل معك عبر بريدك الإلكتروني.' : 'Ticket #FS-9428 has been logged and dispatched to an agent.'}
              </p>
              <button
                type="button"
                onClick={() => setTicketSent(false)}
                className="mt-4 px-4 py-1.5 rounded-lg bg-slate-800 text-xs text-indigo-400 font-bold hover:bg-slate-700"
              >
                {lang === 'ar' ? 'إرسال استفسار آخر' : 'Send another inquiry'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'موضوع المشكلة أو الاستفسار' : 'Subject'}
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="مثال: استفسار حول ربط حساب يوتيوب شورتس"
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'تفاصيل الرسالة' : 'Detailed Message'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="اشرح المشكلة أو الاستفسار بالتفصيل..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إرسال التذكرة' : 'Submit Ticket'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Community & Discord (1 col) */}
        <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {lang === 'ar' ? 'مجتمع صناع المحتوى' : 'Creator Community'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {lang === 'ar' ? 'انضم إلى أكثر من 8,000 صانع محتوى في سيرفر Discord وتيليجرام لتبادل الخبرات وأفكار الترند اليومية.' : 'Join 8,000+ creators on Discord sharing viral hooks and growth tactics.'}
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => confetti({ particleCount: 30, spread: 50 })}
              className="w-full py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>{lang === 'ar' ? 'انضم إلى مجتمع Discord 💬' : 'Join Discord Community 💬'}</span>
            </button>

            <button
              onClick={() => confetti({ particleCount: 30, spread: 50 })}
              className="w-full py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1E88E5] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>{lang === 'ar' ? 'قناة تيليجرام للترندات 📢' : 'Telegram Trend Channel 📢'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
