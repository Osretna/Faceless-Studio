import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Video, 
  Save, 
  Download, 
  Edit3, 
  Clock, 
  ArrowRight,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, ScriptResult, IdeaCard } from '../../types';
import { translations } from '../../translations';
import { SAMPLE_SCRIPTS } from '../../mockData';

interface ScriptWriterViewProps {
  lang: Language;
  selectedIdea?: IdeaCard | null;
  onSendToVideo: (script: ScriptResult) => void;
}

export const ScriptWriterView: React.FC<ScriptWriterViewProps> = ({
  lang,
  selectedIdea,
  onSendToVideo,
}) => {
  const t = translations[lang];

  const [topic, setTopic] = useState(
    selectedIdea ? selectedIdea.title : '5 أدوات ذكاء اصطناعي سرية ستجعلك تتفوق على الجميع في 2026'
  );
  const [scriptType, setScriptType] = useState('تعليمي');
  const [dialect, setDialect] = useState('فصحى معاصرة');
  const [duration, setDuration] = useState<number>(45);
  const [includeCTA, setIncludeCTA] = useState(true);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Active script state
  const [currentScript, setCurrentScript] = useState<ScriptResult>(SAMPLE_SCRIPTS[0]);

  useEffect(() => {
    if (selectedIdea) {
      setTopic(selectedIdea.title);
      setCurrentScript({
        hook: selectedIdea.hook,
        body: selectedIdea.description + '\n\nأولاً: السرعة في التنفيذ.\nثانياً: التكيف مع التحديثات الجديدة دون تردد.',
        cta: 'احفظ الفيديو لتطبقه الليلة، وشاركنا في التعليقات: ما هو مجالك؟',
        estimatedDurationSeconds: 45,
        wordCount: 110,
        dialect: 'فصحى معاصرة',
      });
    }
  }, [selectedIdea]);

  const handleGenerateScript = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          scriptType,
          dialect,
          duration,
          includeCTA,
          lang,
        }),
      });
      const data = await res.json();
      if (data.script) {
        setCurrentScript(data.script);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFull = () => {
    const fullText = `[HOOK]\n${currentScript.hook}\n\n[BODY]\n${currentScript.body}\n\n[CTA]\n${currentScript.cta}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const fullText = `عنوان الموضوع: ${topic}\nالمدة: ${currentScript.estimatedDurationSeconds} ثانية\nاللهجة: ${currentScript.dialect}\n\n=== HOOK (0-3s) ===\n${currentScript.hook}\n\n=== BODY ===\n${currentScript.body}\n\n=== CTA ===\n${currentScript.cta}`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scriptTypes = [
    { id: 'تعليمي', labelAr: 'تعليمي / شروحات', labelEn: 'Educational / How-To' },
    { id: 'قصصي', labelAr: 'قصصي / وثائقي', labelEn: 'Storytelling / Doc' },
    { id: 'تحفيزي', labelAr: 'تحفيزي / تطوير ذات', labelEn: 'Motivational' },
    { id: 'فكاهي', labelAr: 'تفاعلي / مرح', labelEn: 'Entertaining / Fun' },
    { id: 'حقائق غريبة', labelAr: 'غرائب وحقائق صادمة', labelEn: 'Shocking Facts' },
  ];

  const dialects = [
    { id: 'فصحى معاصرة', label: 'العربية الفصحى (Modern Standard)' },
    { id: 'لهجة مصرية', label: 'اللهجة المصرية (Egyptian)' },
    { id: 'لهجة خليجية', label: 'اللهجة الخليجية (Gulf / Saudi)' },
    { id: 'English (US)', label: 'English (US Native)' },
    { id: 'English (UK)', label: 'English (UK Accent)' },
  ];

  return (
    <div className="space-y-6">
      {/* Parameters Controls */}
      <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-md">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{t.scriptTitle}</h2>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'سكريبتات مصممة هندسياً لحبس أنفاس المشاهد من الثانية الأولى' : 'Retention-optimized scripts designed to maximize watch time'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Topic Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.topicPlaceholder}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثال: كيف تبدأ قناة يوتيوب بدون تصوير وتربح أول 1000 دولار"
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              id="script-topic-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Script Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.scriptType}
              </label>
              <select
                value={scriptType}
                onChange={(e) => setScriptType(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                id="script-type-select"
              >
                {scriptTypes.map((st) => (
                  <option key={st.id} value={st.id}>
                    {lang === 'ar' ? st.labelAr : st.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Dialect */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.dialectSelect}
              </label>
              <select
                value={dialect}
                onChange={(e) => setDialect(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                id="script-dialect-select"
              >
                {dialects.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.targetDuration}
              </label>
              <div className="grid grid-cols-4 gap-1.5 h-11">
                {[15, 30, 45, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setDuration(sec)}
                    className={`rounded-xl text-xs font-bold transition-colors ${
                      duration === sec
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Checkbox & Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-700/60">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCTA}
                onChange={(e) => setIncludeCTA(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
              />
              <span className="text-xs text-slate-300 font-medium">
                {t.includeCTA}
              </span>
            </label>

            <button
              onClick={handleGenerateScript}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
              id="script-generate-btn"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.generateScriptBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Script Editor / Output */}
      <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/80 shadow-xl space-y-5">
        {/* Editor Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              {dialect}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~{currentScript.estimatedDurationSeconds}s ({currentScript.wordCount} words)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                isEditing
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? (lang === 'ar' ? 'معاينة العرض' : 'Preview') : (lang === 'ar' ? 'تعديل النص' : 'Edit')}</span>
            </button>

            <button
              onClick={handleCopyFull}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الكل' : 'Copy All')}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>TXT</span>
            </button>
          </div>
        </div>

        {/* 1. HOOK SECTION */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-pink-400" />
              {t.hookSection}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">0:00 - 0:03</span>
          </div>

          {isEditing ? (
            <textarea
              value={currentScript.hook}
              onChange={(e) => setCurrentScript({ ...currentScript, hook: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 font-tajawal resize-none h-20"
            />
          ) : (
            <p className="text-sm sm:text-base font-bold text-white leading-relaxed font-tajawal">
              "{currentScript.hook}"
            </p>
          )}
        </div>

        {/* 2. BODY SECTION */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-400">
              {t.bodySection}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">0:03 - 0:38</span>
          </div>

          {isEditing ? (
            <textarea
              value={currentScript.body}
              onChange={(e) => setCurrentScript({ ...currentScript, body: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 font-tajawal resize-y min-h-[140px]"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-tajawal whitespace-pre-line">
              {currentScript.body}
            </p>
          )}
        </div>

        {/* 3. CTA SECTION */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-400">
              {t.ctaSection}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">0:38 - 0:45</span>
          </div>

          {isEditing ? (
            <textarea
              value={currentScript.cta}
              onChange={(e) => setCurrentScript({ ...currentScript, cta: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 font-tajawal resize-none h-16"
            />
          ) : (
            <p className="text-xs sm:text-sm font-semibold text-emerald-300 leading-relaxed font-tajawal">
              "{currentScript.cta}"
            </p>
          )}
        </div>

        {/* Send to Video Generator CTA */}
        <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {lang === 'ar' ? 'السكريبت جاهز للتسجيل الصوتي والمونتاج التلقائي 🚀' : 'Ready to assemble voiceover and 4K visuals?'}
          </div>

          <button
            onClick={() => onSendToVideo(currentScript)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            id="btn-send-to-video"
          >
            <Video className="w-4 h-4" />
            <span>{t.sendToVideo}</span>
            <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
