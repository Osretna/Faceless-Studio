import React, { useState } from 'react';
import { 
  Send, 
  Share2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Play, 
  Eye, 
  Heart, 
  MessageCircle, 
  RefreshCw, 
  Power, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, ScheduledPost, SocialAccount } from '../types';
import { translations } from '../translations';
import { INITIAL_SCHEDULED_POSTS, INITIAL_USER } from '../mockData';

interface AutoPublisherViewProps {
  lang: Language;
}

export const AutoPublisherView: React.FC<AutoPublisherViewProps> = ({ lang }) => {
  const t = translations[lang];

  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_USER.connectedAccounts);
  const [queue, setQueue] = useState<ScheduledPost[]>(INITIAL_SCHEDULED_POSTS);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

  // History posts simulation
  const historyPosts = [
    {
      id: 'hist-1',
      title: 'أسرار النجاح المالي لأصحاب قنوات الفيسلس',
      platform: 'TikTok',
      publishedAt: lang === 'ar' ? 'أمس، 08:30 م' : 'Yesterday, 08:30 PM',
      views: 45200,
      likes: 3890,
      comments: 240,
      status: 'success',
    },
    {
      id: 'hist-2',
      title: '5 أخطاء تدمر ريلز إنستغرام في أول دقيقة',
      platform: 'Instagram',
      publishedAt: lang === 'ar' ? 'منذ يومين، 07:00 م' : '2 days ago, 07:00 PM',
      views: 28400,
      likes: 2150,
      comments: 112,
      status: 'success',
    },
    {
      id: 'hist-3',
      title: 'مقارنة أفضل 3 روبوتات ذكاء اصطناعي للمونتاج',
      platform: 'YouTube',
      publishedAt: lang === 'ar' ? 'منذ 4 أيام، 09:15 م' : '4 days ago, 09:15 PM',
      views: 78900,
      likes: 6400,
      comments: 512,
      status: 'success',
    },
  ];

  const handleToggleAccount = (platformId: string) => {
    setAccounts(accounts.map(acc => {
      if (acc.platform === platformId) {
        return { ...acc, isConnected: !acc.isConnected };
      }
      return acc;
    }));
  };

  const handleConnectOAuth = (platformId: string) => {
    setConnectingPlatform(platformId);
    setTimeout(() => {
      setAccounts(accounts.map(acc => {
        if (acc.platform === platformId) {
          return { ...acc, isConnected: true, username: `@faceless_${platformId.toLowerCase()}_pro` };
        }
        return acc;
      }));
      setConnectingPlatform(null);
      confetti({ particleCount: 50, spread: 60 });
    }, 1000);
  };

  const handlePublishQueueNow = (postId: string) => {
    setQueue(queue.filter(p => p.id !== postId));
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleDeleteFromQueue = (postId: string) => {
    setQueue(queue.filter(p => p.id !== postId));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{t.publisher}</h2>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'نظام النشر الآلي السحابي عبر واجهات برمجة التطبيقات الرسمية' : 'Autonomous multi-channel distribution pipeline via direct official APIs'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400">
            {lang === 'ar' ? 'خادم المزامنة التلقائية: نشط 24/7' : 'Auto-Sync Server: Active 24/7'}
          </span>
        </div>
      </div>

      {/* CONNECTED SOCIAL ACCOUNTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.platform}
            className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">{acc.platform}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${acc.isConnected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              </div>
              <div className="text-xs text-slate-400 mb-1">
                {acc.isConnected ? (lang === 'ar' ? 'الحساب المرتبط:' : 'Connected Account:') : (lang === 'ar' ? 'غير متصل' : 'Disconnected')}
              </div>
              <div className="text-xs font-semibold text-indigo-400 truncate">
                {acc.isConnected ? (acc.username || '@mychannel_viral') : (lang === 'ar' ? 'اضغط للربط السريع' : 'Click to connect')}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
              {acc.isConnected ? (
                <button
                  onClick={() => handleToggleAccount(acc.platform)}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 transition-colors"
                >
                  {lang === 'ar' ? 'فصل الحساب' : 'Disconnect'}
                </button>
              ) : (
                <button
                  onClick={() => handleConnectOAuth(acc.platform)}
                  disabled={connectingPlatform === acc.platform}
                  className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  {connectingPlatform === acc.platform ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Share2 className="w-3 h-3" />
                  )}
                  <span>{lang === 'ar' ? 'ربط الآن' : 'Connect'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PUBLISHING QUEUE */}
      <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">{t.publishingQueue}</h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'الفيديوهات المنتظرة في قائمة الإطلاق التلقائي' : 'Videos waiting in the autonomous dispatch queue'}
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            {queue.length} {lang === 'ar' ? 'منشورات في الانتظار' : 'in queue'}
          </span>
        </div>

        <div className="space-y-3">
          {queue.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img src={item.thumbnailUrl} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-700" />
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="px-2 py-0.5 rounded bg-slate-900 font-bold text-indigo-400">{item.platform}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Clock className="w-3 h-3" />
                      {item.scheduledDate} ({item.scheduledTime})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleDeleteFromQueue(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePublishQueueNow(item.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.publishNow}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PUBLISHING HISTORY & ANALYTICS */}
      <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">{t.publishingHistory}</h3>
          <p className="text-xs text-slate-400">
            {lang === 'ar' ? 'سجل الفيديوهات المنشورة مع تتبع الأداء والتفاعل' : 'Past published videos with performance telemetry'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-700/80 text-slate-400">
                <th className="pb-3 pr-2">{lang === 'ar' ? 'عنوان الفيديو' : 'Video Title'}</th>
                <th className="pb-3">{lang === 'ar' ? 'المنصة' : 'Platform'}</th>
                <th className="pb-3">{lang === 'ar' ? 'تاريخ النشر' : 'Published Date'}</th>
                <th className="pb-3">{lang === 'ar' ? 'المشاهدات' : 'Views'}</th>
                <th className="pb-3">{lang === 'ar' ? 'التفاعل' : 'Engagement'}</th>
                <th className="pb-3">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {historyPosts.map((h) => (
                <tr key={h.id} className="text-slate-300 hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 pr-2 font-semibold text-white max-w-xs truncate">{h.title}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900 font-bold text-indigo-400">{h.platform}</span>
                  </td>
                  <td className="py-3.5 text-slate-400">{h.publishedAt}</td>
                  <td className="py-3.5 font-mono font-bold text-white flex items-center gap-1 mt-1">
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    {(h.views / 1000).toFixed(1)}K
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-pink-400 font-medium">
                        <Heart className="w-3 h-3 fill-pink-400" />
                        {h.likes}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MessageCircle className="w-3 h-3" />
                        {h.comments}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {lang === 'ar' ? 'تم بنجاح ✓' : 'Success ✓'}
                    </span>
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
