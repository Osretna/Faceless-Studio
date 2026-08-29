import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Flame, 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Copy, 
  Check, 
  Sliders,
  TrendingUp,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, IdeaCard } from '../../types';
import { translations } from '../../translations';
import { INITIAL_IDEAS } from '../../mockData';

interface BrainstormViewProps {
  lang: Language;
  onUseScript: (idea: IdeaCard) => void;
}

export const BrainstormView: React.FC<BrainstormViewProps> = ({
  lang,
  onUseScript,
}) => {
  const t = translations[lang];

  const [niche, setNiche] = useState('الذكاء الاصطناعي وصناعة المحتوى');
  const [platform, setPlatform] = useState<'TikTok' | 'Instagram' | 'YouTube' | 'Facebook'>('TikTok');
  const [count, setCount] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<IdeaCard[]>(INITIAL_IDEAS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerateIdeas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche,
          platform,
          count,
          lang,
        }),
      });
      const data = await res.json();
      if (data.ideas && Array.isArray(data.ideas)) {
        setIdeas(data.ideas);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = (id: string) => {
    setIdeas(ideas.map(idea => idea.id === id ? { ...idea, saved: !idea.saved } : idea));
  };

  const handleDelete = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  const handleCopy = (idea: IdeaCard) => {
    navigator.clipboard.writeText(`${idea.title}\n\nHook: ${idea.hook}`);
    setCopiedId(idea.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header Card */}
      <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-md">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{t.brainstormTitle}</h2>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'حلل خوارزميات التيك توك والريلز لتوليد أفكار بمعدل احتفاظ عالي' : 'Analyze algorithmic trends to produce high-retention concepts'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Niche Input */}
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.nichePlaceholder}
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="مثال: ذكاء اصطناعي، استثمار، تاريخ، تطوير الذات"
              className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              id="brainstorm-niche-input"
            />
          </div>

          {/* Platform Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.platformSelect}
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              id="brainstorm-platform-select"
            >
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram Reels</option>
              <option value="YouTube">YouTube Shorts</option>
              <option value="Facebook">Facebook Reels</option>
            </select>
          </div>

          {/* Ideas Count Slider (1-20) */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>{t.ideasCount}</span>
              <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
                {count} {lang === 'ar' ? 'أفكار' : 'ideas'}
              </span>
            </div>
            <div className="h-11 flex items-center px-2">
              <input
                type="range"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
                id="brainstorm-slider-count"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-700/60 flex justify-end">
          <button
            onClick={handleGenerateIdeas}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            id="brainstorm-generate-btn"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.generating}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.generateIdeasBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ideas Interactive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/70 hover:border-slate-600 hover:bg-slate-800 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Platform & Trend Score */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  {idea.platform}
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full">
                  <Flame className="w-3.5 h-3.5 fill-pink-400" />
                  <span>{idea.trendScore}% {lang === 'ar' ? 'قوة الترند' : 'Trend'}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug">
                {idea.title}
              </h3>

              {/* Hook */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {lang === 'ar' ? 'الافتتاحية الخطافة (Hook):' : 'Opening Hook (0-3s):'}
                </span>
                <p className="text-xs text-slate-200 font-tajawal leading-relaxed">
                  "{idea.hook}"
                </p>
              </div>

              {/* Description preview */}
              <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                {idea.description}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleSave(idea.id)}
                  className={`p-2 rounded-lg border transition-colors ${
                    idea.saved
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title={t.save}
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleCopy(idea)}
                  className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Copy"
                >
                  {copiedId === idea.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => handleDelete(idea.id)}
                  className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title={t.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onUseScript(idea)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
                id={`use-script-${idea.id}`}
              >
                <span>{t.useScript}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
