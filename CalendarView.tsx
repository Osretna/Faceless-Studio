import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Send, 
  Trash2, 
  Edit3 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, ScheduledPost } from '../types';
import { translations } from '../translations';
import { INITIAL_SCHEDULED_POSTS } from '../mockData';

interface CalendarViewProps {
  lang: Language;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ lang }) => {
  const t = translations[lang];

  const [posts, setPosts] = useState<ScheduledPost[]>(INITIAL_SCHEDULED_POSTS);
  const [viewFormat, setViewFormat] = useState<'month' | 'week' | 'day'>('month');
  const [activeModalPost, setActiveModalPost] = useState<ScheduledPost | null>(null);
  const [showAddPostModal, setShowAddPostModal] = useState(false);

  // New post modal fields
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState<'TikTok' | 'Instagram' | 'YouTube' | 'Facebook'>('TikTok');
  const [newDate, setNewDate] = useState('2026-09-02');
  const [newTime, setNewTime] = useState('19:00');

  // Days of month simulation (30 days)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const getPlatformColors = (platform: ScheduledPost['platform']) => {
    switch (platform) {
      case 'TikTok':
        return 'bg-pink-600/20 text-pink-300 border-pink-500/30 hover:bg-pink-600/30';
      case 'Instagram':
        return 'bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30';
      case 'YouTube':
        return 'bg-red-600/20 text-red-300 border-red-500/30 hover:bg-red-600/30';
      case 'Facebook':
        return 'bg-blue-600/20 text-blue-300 border-blue-500/30 hover:bg-blue-600/30';
    }
  };

  const handlePublishNow = (post: ScheduledPost) => {
    setPosts(posts.map(p => p.id === post.id ? { ...p, status: 'published' } : p));
    setActiveModalPost(null);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleCancelSchedule = (post: ScheduledPost) => {
    setPosts(posts.filter(p => p.id !== post.id));
    setActiveModalPost(null);
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newP: ScheduledPost = {
      id: `sched-${Date.now()}`,
      title: newTitle,
      platform: newPlatform,
      scheduledDate: newDate,
      scheduledTime: newTime,
      status: 'scheduled',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
      caption: newTitle,
    };

    setPosts([...posts, newP]);
    setShowAddPostModal(false);
    setNewTitle('');
    confetti({ particleCount: 40, spread: 50 });
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header Bar */}
      <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{t.calendar}</h2>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'سبتمبر 2026 - توزيع وجدولة المحتوى متعدد المنصات' : 'September 2026 - Multi-Platform Distribution Pipeline'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month / Week / Day toggles */}
          <div className="flex rounded-xl bg-slate-900 border border-slate-700 p-1">
            <button
              onClick={() => setViewFormat('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewFormat === 'month' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.monthView}
            </button>
            <button
              onClick={() => setViewFormat('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewFormat === 'week' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.weekView}
            </button>
            <button
              onClick={() => setViewFormat('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewFormat === 'day' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.dayView}
            </button>
          </div>

          <button
            onClick={() => setShowAddPostModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            id="btn-add-calendar-post"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addPostToCalendar}</span>
          </button>
        </div>
      </div>

      {/* MONTH GRID VIEW */}
      {viewFormat === 'month' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-800/40 border border-slate-700/80 shadow-xl">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold text-slate-400">
            <div>{lang === 'ar' ? 'السبت' : 'Sat'}</div>
            <div>{lang === 'ar' ? 'الأحد' : 'Sun'}</div>
            <div>{lang === 'ar' ? 'الإثنين' : 'Mon'}</div>
            <div>{lang === 'ar' ? 'الثلاثاء' : 'Tue'}</div>
            <div>{lang === 'ar' ? 'الأربعاء' : 'Wed'}</div>
            <div>{lang === 'ar' ? 'الخميس' : 'Thu'}</div>
            <div>{lang === 'ar' ? 'الجمعة' : 'Fri'}</div>
          </div>

          {/* Month day cells */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((dayNum) => {
              const dateStr = `2026-09-${dayNum.toString().padStart(2, '0')}`;
              const dayPosts = posts.filter(p => p.scheduledDate === dateStr);
              return (
                <div
                  key={dayNum}
                  className="min-h-[100px] p-2 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-colors flex flex-col justify-between"
                >
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400">{dayNum}</span>
                  </div>

                  <div className="space-y-1 my-1">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => setActiveModalPost(post)}
                        className={`p-1.5 rounded-lg border text-[10px] font-semibold cursor-pointer transition-all truncate flex items-center justify-between ${getPlatformColors(post.platform)}`}
                      >
                        <span className="truncate">{post.title}</span>
                        <span className="text-[9px] font-mono shrink-0 ml-1">{post.scheduledTime}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] text-slate-500">
                    {dayPosts.length > 0 && `${dayPosts.length} posts`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK / DAY VIEW FALLBACK */}
      {viewFormat !== 'month' && (
        <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/80 space-y-3">
          <h3 className="text-base font-bold text-white mb-2">
            {viewFormat === 'week' ? (lang === 'ar' ? 'عرض الأسبوع الحالي' : 'Current Week Schedule') : (lang === 'ar' ? 'عرض جدول اليوم' : 'Daily Schedule')}
          </h3>
          <div className="space-y-2.5">
            {posts.map((p) => (
              <div
                key={p.id}
                onClick={() => setActiveModalPost(p)}
                className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-indigo-500 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <img src={p.thumbnailUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{p.title}</h4>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 font-bold text-indigo-400">{p.platform}</span>
                      <span>{p.scheduledDate} @ {p.scheduledTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    p.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POST DETAILS MODAL */}
      {activeModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setActiveModalPost(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPlatformColors(activeModalPost.platform)}`}>
                {activeModalPost.platform}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeModalPost.scheduledDate} @ {activeModalPost.scheduledTime}
              </span>
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-700 mb-4 bg-black">
              <img src={activeModalPost.thumbnailUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>

            <h3 className="text-base font-bold text-white mb-2">{activeModalPost.title}</h3>
            <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-700 mb-4 leading-relaxed font-tajawal">
              {activeModalPost.caption}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-700">
              <button
                onClick={() => handleCancelSchedule(activeModalPost)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إلغاء الجدولة' : 'Cancel Post'}</span>
              </button>

              <button
                onClick={() => handlePublishNow(activeModalPost)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'ar' ? 'نشر فوري الآن 🚀' : 'Publish Now 🚀'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW POST MODAL */}
      {showAddPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#1E293B] border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setShowAddPostModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {lang === 'ar' ? 'إضافة منشور جديد للتقويم' : 'Add Post to Calendar'}
            </h3>

            <form onSubmit={handleAddPost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'عنوان الفيديو / المنشور' : 'Post Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: أفضل 3 تطبيقات لزيادة إنتاجيتك في 2026"
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'ar' ? 'المنصة' : 'Platform'}
                </label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram Reels</option>
                  <option value="YouTube">YouTube Shorts</option>
                  <option value="Facebook">Facebook Reels</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'ar' ? 'التاريخ' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'ar' ? 'الوقت' : 'Time'}
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold text-xs shadow-md mt-4"
              >
                {lang === 'ar' ? 'حفظ وجدولة المنشور' : 'Save & Schedule Post'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
