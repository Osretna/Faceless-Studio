import React, { useState } from 'react';
import { 
  Hash, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  Share2, 
  Smile, 
  TrendingUp, 
  CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, CaptionResult } from '../../types';
import { translations } from '../../translations';
import { SAMPLE_CAPTIONS } from '../../mockData';

interface CaptionsViewProps {
  lang: Language;
}

export const CaptionsView: React.FC<CaptionsViewProps> = ({ lang }) => {
  const t = translations[lang];

  const [topic, setTopic] = useState('5 أدوات ذكاء اصطناعي سرية لإنشاء قنوات يوتيوب بدون ظهور في 2026');
  const [platform, setPlatform] = useState<'TikTok' | 'Instagram' | 'YouTube' | 'Facebook'>('TikTok');
  const [lengthPref, setLengthPref] = useState<'قصير' | 'متوسط' | 'طويل'>('متوسط');
  const [hashtagsCount, setHashtagsCount] = useState<number>(8);
  const [includeEmojis, setIncludeEmojis] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [currentResult, setCurrentResult] = useState<CaptionResult>(SAMPLE_CAPTIONS[0]);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerateCaptions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          platform,
          lengthPref,
          hashtagsCount,
          includeEmojis,
          lang,
        }),
      });
      const data = await res.json();
      const cap = data.result || data.caption;
      if (cap) {
        setCurrentResult({
          caption: cap.caption,
          hashtags: cap.hashtags || [],
          bestTimeToPost: cap.bestTime || cap.bestTimeToPost || '08:30 م (اليوم)',
          platform,
        });
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-md">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{t.captionsTitle}</h2>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'كابشن وهاشتاجات مُهندسة لتحسين محركات بحث تيك توك وسيو الفيديو (SEO)' : 'Algorithm-optimized captions and tags tailored for TikTok & Reels SEO'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.topicPlaceholder}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="اكتب موضوع الفيديو..."
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              id="captions-topic-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Platform Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.platformSelect}
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                id="captions-platform-select"
              >
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram Reels</option>
                <option value="YouTube">YouTube Shorts</option>
                <option value="Facebook">Facebook Reels</option>
              </select>
            </div>

            {/* Length Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.captionLength}
              </label>
              <div className="grid grid-cols-3 gap-1.5 h-11">
                {(['قصير', 'متوسط', 'طويل'] as const).map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setLengthPref(len)}
                    className={`rounded-xl text-xs font-bold transition-colors ${
                      lengthPref === len ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Hashtags count */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>{t.hashtagsCount}</span>
                <span className="font-mono text-indigo-400 font-bold">{hashtagsCount}</span>
              </div>
              <div className="h-11 flex items-center px-2">
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={hashtagsCount}
                  onChange={(e) => setHashtagsCount(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-700/60">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEmojis}
                onChange={(e) => setIncludeEmojis(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
              />
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-amber-400" />
                {t.includeEmojis}
              </span>
            </label>

            <button
              onClick={handleGenerateCaptions}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
              id="captions-generate-btn"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.generateCaptionsBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Result Output */}
      <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/80 shadow-xl space-y-5">
        {/* Header & Best Time to Post */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-pink-500/15 text-pink-300 text-xs font-bold border border-pink-500/20">
              {currentResult.platform}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.bestTime}: {currentResult.bestTimeToPost}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(currentResult.caption, 'caption')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              {copiedSection === 'caption' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{t.copyCaption}</span>
            </button>

            <button
              onClick={() => handleCopy(currentResult.hashtags.join(' '), 'hashtags')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              {copiedSection === 'hashtags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Hash className="w-3.5 h-3.5" />}
              <span>{t.copyHashtags}</span>
            </button>

            <button
              onClick={() => handleCopy(`${currentResult.caption}\n\n${currentResult.hashtags.join(' ')}`, 'all')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              {copiedSection === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{t.copyAll}</span>
            </button>
          </div>
        </div>

        {/* Caption Body */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80">
          <div className="text-xs font-bold text-slate-400 mb-2">{t.captionText}</div>
          <p className="text-sm text-slate-200 leading-relaxed font-tajawal whitespace-pre-line">
            {currentResult.caption}
          </p>
        </div>

        {/* Hashtags Chips */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">
              {lang === 'ar' ? 'الهاشتاجات الترند الموصى بها:' : 'Trending Viral Tags:'}
            </span>
            <span className="text-xs font-mono text-indigo-400 font-bold">
              {currentResult.hashtags.length} tags
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentResult.hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-slate-800/80 text-indigo-300 text-xs font-medium border border-slate-700 hover:border-indigo-500/50 cursor-pointer transition-colors"
                onClick={() => handleCopy(tag, `tag-${idx}`)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
