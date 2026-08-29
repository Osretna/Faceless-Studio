import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Mic, 
  Image as ImageIcon, 
  Music, 
  Type, 
  Download, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw,
  Sliders,
  Layers,
  Search,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, ScriptResult, VoiceOption, MusicOption, VideoProject } from '../../types';
import { translations } from '../../translations';
import { MOCK_VOICES, MOCK_MUSIC, STOCK_VIDEOS_PREVIEW } from '../../mockData';

interface VideoCreatorViewProps {
  lang: Language;
  initialScript?: ScriptResult | null;
  onVideoCreated: (newProject: VideoProject) => void;
}

export const VideoCreatorView: React.FC<VideoCreatorViewProps> = ({
  lang,
  initialScript,
  onVideoCreated,
}) => {
  const t = translations[lang];

  // 6-step wizard
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Step 1: Script
  const [scriptText, setScriptText] = useState(
    initialScript ? `${initialScript.hook}\n\n${initialScript.body}\n\n${initialScript.cta}` : 
    'توقف عن تضييع ساعات في المونتاج! هذا هو السر الخفي لأنجح قنوات الفيسلس اليوم. القنوات التي تحقق ملايين المشاهدات لا تصور وجوهها، بل تعتمد على مقاطع ستوك عالي التباين وسرد قصصي سريع وتوليد صوتي عصبي بنبرة حماسية. احفظ الفيديو لتطبقه الليلة!'
  );

  // Step 2: Voice
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(MOCK_VOICES[0]);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Step 3: Stock footage
  const [selectedStock, setSelectedStock] = useState(STOCK_VIDEOS_PREVIEW[0]);
  const [stockSearch, setStockSearch] = useState('');

  // Step 4: Music
  const [selectedMusic, setSelectedMusic] = useState<MusicOption>(MOCK_MUSIC[0]);
  const [musicVolume, setMusicVolume] = useState(25);
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);

  // Step 5: Subtitles
  const [subtitleStyle, setSubtitleStyle] = useState<'yellow' | 'gradient' | 'minimal' | 'bold'>('yellow');
  const [subtitlePosition, setSubtitlePosition] = useState<'middle' | 'bottom'>('middle');

  // Step 6: Review & Export
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [resolution, setResolution] = useState<'1080p' | '4K'>('1080p');
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const exportTimerRef = useRef<any>(null);

  // Synchronize scriptText if initialScript changes
  useEffect(() => {
    if (initialScript) {
      setScriptText(
        `${initialScript.hook}\n\n${initialScript.body}\n\n${initialScript.cta}`
      );
    }
  }, [initialScript]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (exportTimerRef.current) {
        clearInterval(exportTimerRef.current);
      }
    };
  }, []);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const totalDuration = 35; // simulated seconds

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlayerCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Handle Export Execution
  const handleStartExport = () => {
    if (exporting) return;
    setExporting(true);
    setExportProgress(10);

    let progress = 10;
    if (exportTimerRef.current) {
      clearInterval(exportTimerRef.current);
    }

    exportTimerRef.current = setInterval(() => {
      progress += 18;
      if (progress >= 100) {
        if (exportTimerRef.current) {
          clearInterval(exportTimerRef.current);
          exportTimerRef.current = null;
        }
        setExportProgress(100);
        setExporting(false);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

        // Create new project
        const newProj: VideoProject = {
          id: `proj-${Date.now()}`,
          title: scriptText.slice(0, 40) + '...',
          topic: 'فيديو ذكاء اصطناعي جديد',
          durationSeconds: totalDuration,
          thumbnailUrl: selectedStock.thumbnail,
          videoUrl: selectedStock.previewUrl,
          status: 'ready',
          platform: 'TikTok',
          voiceName: selectedVoice.name,
          aspectRatio,
          createdAt: lang === 'ar' ? 'الآن' : 'Just now',
        };

        // Notify parent outside render cycle to avoid updating App during render
        setTimeout(() => {
          onVideoCreated(newProj);
        }, 100);
      } else {
        setExportProgress(progress);
      }
    }, 400);
  };

  const stepsList = [
    { step: 1, labelAr: 'السكريبت', labelEn: 'Script', icon: Type },
    { step: 2, labelAr: 'الصوت AI', labelEn: 'AI Voice', icon: Mic },
    { step: 3, labelAr: 'الفيديو واللقطات', labelEn: 'Footage', icon: ImageIcon },
    { step: 4, labelAr: 'الموسيقى', labelEn: 'Music', icon: Music },
    { step: 5, labelAr: 'الترجمة الحركية', labelEn: 'Subtitles', icon: Type },
    { step: 6, labelAr: 'المعاينة والتصدير', labelEn: 'Export', icon: Download },
  ];

  // Subtitle phrases mapped to player progress
  const getCurrentSubtitleText = () => {
    if (playerCurrentTime < 4) return '🔥 توقف عن تضييع ساعات في المونتاج!';
    if (playerCurrentTime < 12) return 'هذا هو السر الخفي لأنجح قنوات الفيسلس اليوم.';
    if (playerCurrentTime < 24) return 'توليد صوتي عصبي + لقطات عالية التباين.';
    return 'احفظ الفيديو لتطبقه الليلة! 🚀';
  };

  return (
    <div className="space-y-6">
      {/* 6-STEP WIZARD HEADER BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-md">
        <div className="grid grid-cols-6 gap-2">
          {stepsList.map((st) => {
            const Icon = st.icon;
            const isPassed = currentStep > st.step;
            const isCurrent = currentStep === st.step;
            return (
              <button
                key={st.step}
                onClick={() => setCurrentStep(st.step as any)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-2 rounded-xl text-center transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
                    : isPassed
                    ? 'bg-slate-800 text-indigo-300 font-medium'
                    : 'bg-slate-900/50 text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[11px] sm:text-xs truncate hidden md:inline">
                  {lang === 'ar' ? st.labelAr : st.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN TWO COLUMNS: Active Step Controls (Left) + Interactive Video Player & Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step Configuration (Col 1-7) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-800/50 border border-slate-700/80 shadow-xl flex flex-col justify-between min-h-[480px]">
          <div>
            {/* STEP 1: SCRIPT INPUT */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Type className="w-4 h-4 text-indigo-400" />
                    {lang === 'ar' ? 'الخطوة 1: سكريبت الفيديو' : 'Step 1: Video Script'}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {scriptText.split(/\s+/).length} {lang === 'ar' ? 'كلمة' : 'words'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'ألصق سكريبتك أو عدل عليه. ستقوم المنصة بتقسيمه إلى مشاهد مرئية وتوليد الصوت تلقائياً.' : 'Paste or edit your script. It will be segmented into visual scenes and voiced by AI.'}
                </p>
                <textarea
                  rows={8}
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 font-tajawal leading-relaxed resize-none"
                  placeholder="اكتب السكريبت هنا..."
                />
              </div>
            )}

            {/* STEP 2: VOICE SELECTION */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-pink-400" />
                  {lang === 'ar' ? 'الخطوة 2: اختيار صوت الذكاء الاصطناعي (10 أصوات)' : 'Step 2: AI Voice Selection (10 Voices)'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'أصوات عصبية فائقة الواقعية مع تحكم كامل بنبرة الصوت وسرعة الإلقاء.' : 'Ultra-realistic neural voices trained for maximum engagement.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {MOCK_VOICES.map((v) => {
                    const isSelected = selectedVoice.id === v.id;
                    const isPlayingVoice = playingVoiceId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVoice(v)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-900/70 border-slate-700/70 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="truncate">
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            <span>{v.name}</span>
                            <span className="text-[10px] text-slate-400">({v.accent})</span>
                          </div>
                          <div className="text-[10px] text-slate-400">{v.tone}</div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingVoiceId(isPlayingVoice ? null : v.id);
                          }}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                            isPlayingVoice ? 'bg-pink-500 text-white animate-pulse' : 'bg-slate-800 text-indigo-300 hover:bg-slate-700'
                          }`}
                        >
                          {isPlayingVoice ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: STOCK FOOTAGE */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    {lang === 'ar' ? 'الخطوة 3: اللقطات ومكتبة الستوك 4K' : 'Step 3: Stock Visuals (4K)'}
                  </h3>
                  <span className="text-xs text-slate-400">مرخصة تجارياً 100%</span>
                </div>

                <div className="relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${
                    lang === 'ar' ? 'right-3' : 'left-3'
                  }`} />
                  <input
                    type="text"
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    placeholder="ابحث في 200,000+ فيديو ستوك (مثال: تكنولوجيا، فضاء، مدينة ليلية)..."
                    className={`w-full h-10 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white ${
                      lang === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {STOCK_VIDEOS_PREVIEW.map((stk) => {
                    const isSelected = selectedStock.id === stk.id;
                    return (
                      <div
                        key={stk.id}
                        onClick={() => setSelectedStock(stk)}
                        className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-[9/14] ${
                          isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/40' : 'border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <img src={stk.thumbnail} alt={stk.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                        <span className="absolute bottom-2 inset-x-1 text-center text-[10px] font-bold text-white truncate px-1">
                          {stk.title}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: MUSIC SELECTION */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-400" />
                  {lang === 'ar' ? 'الخطوة 4: الموسيقى التصويرية الخالية من حقوق الملكية' : 'Step 4: Royalty-Free Background Audio'}
                </h3>

                <div className="space-y-2.5">
                  {MOCK_MUSIC.map((m) => {
                    const isSelected = selectedMusic.id === m.id;
                    const isPlayingMusic = playingMusicId === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMusic(m)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-slate-900/70 border-slate-700/70 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlayingMusicId(isPlayingMusic ? null : m.id);
                            }}
                            className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                              isPlayingMusic ? 'bg-pink-500 text-white' : 'bg-slate-800 text-indigo-400 hover:bg-slate-700'
                            }`}
                          >
                            {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          </button>
                          <div>
                            <div className="text-xs font-bold text-white">{m.name}</div>
                            <div className="text-[10px] text-slate-400">{m.genre} • {m.duration}s</div>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-indigo-400 px-2 py-0.5 rounded bg-slate-800">
                          {m.mood}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Volume Slider */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center gap-3 mt-3">
                  <span className="text-xs font-semibold text-slate-300 shrink-0">
                    {lang === 'ar' ? 'مستوى صوت الموسيقى خلف التعليق:' : 'Music Ducking Volume:'}
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <span className="text-xs font-mono text-indigo-400 font-bold shrink-0">{musicVolume}%</span>
                </div>
              </div>
            )}

            {/* STEP 5: SUBTITLES STYLING */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Type className="w-4 h-4 text-amber-400" />
                  {lang === 'ar' ? 'الخطوة 5: الترجمة الحركية المتحركة (Animated Captions)' : 'Step 5: Subtitles & Text Styling'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'اختر ستايل التسميات التوضيحية الذي يعطي انطباعاً فيروسياً كفيديوهات Alex Hormozi وMrBeast.' : 'Choose Hormozi-style high contrast animated caption presets.'}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setSubtitleStyle('yellow')}
                    className={`p-3.5 rounded-xl border cursor-pointer text-center transition-all ${
                      subtitleStyle === 'yellow' ? 'border-amber-400 bg-amber-500/15 text-white' : 'border-slate-700 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <span className="px-2 py-1 rounded bg-amber-400 text-slate-950 font-black text-xs uppercase shadow block mb-2">
                      VIRAL YELLOW
                    </span>
                    <span className="text-xs font-semibold text-white">النمط الأصفر الفيروسي</span>
                  </div>

                  <div
                    onClick={() => setSubtitleStyle('gradient')}
                    className={`p-3.5 rounded-xl border cursor-pointer text-center transition-all ${
                      subtitleStyle === 'gradient' ? 'border-pink-500 bg-pink-500/15 text-white' : 'border-slate-700 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <span className="px-2 py-1 rounded bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-black text-xs uppercase shadow block mb-2">
                      NEON GRADIENT
                    </span>
                    <span className="text-xs font-semibold text-white">نيون متدرج</span>
                  </div>

                  <div
                    onClick={() => setSubtitleStyle('bold')}
                    className={`p-3.5 rounded-xl border cursor-pointer text-center transition-all ${
                      subtitleStyle === 'bold' ? 'border-emerald-500 bg-emerald-500/15 text-white' : 'border-slate-700 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <span className="px-2 py-1 rounded bg-emerald-400 text-slate-950 font-black text-xs uppercase shadow block mb-2">
                      GREEN TIKTOK
                    </span>
                    <span className="text-xs font-semibold text-white">تيك توك بولد الأخضر</span>
                  </div>

                  <div
                    onClick={() => setSubtitleStyle('minimal')}
                    className={`p-3.5 rounded-xl border cursor-pointer text-center transition-all ${
                      subtitleStyle === 'minimal' ? 'border-indigo-500 bg-indigo-500/15 text-white' : 'border-slate-700 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <span className="px-2 py-1 rounded bg-slate-900 text-white font-bold text-xs border border-white/40 block mb-2">
                      CLEAN MINIMAL
                    </span>
                    <span className="text-xs font-semibold text-white">وثائقي بسيط</span>
                  </div>
                </div>

                {/* Subtitle Position */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700 mt-2">
                  <span className="text-xs font-semibold text-slate-300">
                    {lang === 'ar' ? 'موضع الترجمة على الشاشة:' : 'Screen Placement:'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSubtitlePosition('middle')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        subtitlePosition === 'middle' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lang === 'ar' ? 'وسط الشاشة (مركز الانتباه)' : 'Center Focus'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubtitlePosition('bottom')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        subtitlePosition === 'bottom' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lang === 'ar' ? 'أسفل الشاشة' : 'Bottom'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: REVIEW & EXPORT */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  {lang === 'ar' ? 'الخطوة 6: التصدير والجودة الفائقة' : 'Step 6: Review & Final Render'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'تأكد من ضبط أبعاد المنصة المستهدفة والدقة المناسبة قبل التوليد النهائي.' : 'Confirm aspect ratio and resolution before final automated video assembly.'}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'ar' ? 'الأبعاد والنسبة:' : 'Aspect Ratio:'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAspectRatio('9:16')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center ${
                          aspectRatio === '9:16' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        9:16 (Shorts/Reels)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAspectRatio('16:9')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center ${
                          aspectRatio === '16:9' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        16:9 (YouTube)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'ar' ? 'دقة الإخراج:' : 'Resolution:'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setResolution('1080p')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center ${
                          resolution === '1080p' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        1080p (FHD)
                      </button>
                      <button
                        type="button"
                        onClick={() => setResolution('4K')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center ${
                          resolution === '4K' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        4K Ultra HD ✨
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{lang === 'ar' ? 'الصوت المختار:' : 'Voice:'}</span>
                    <span className="font-bold text-white">{selectedVoice.name} ({selectedVoice.accent})</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>{lang === 'ar' ? 'الموسيقى:' : 'Music:'}</span>
                    <span className="font-bold text-white">{selectedMusic.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>{lang === 'ar' ? 'المدة التقديرية:' : 'Duration:'}</span>
                    <span className="font-bold text-indigo-400">{totalDuration}s</span>
                  </div>
                </div>

                {/* Progress bar during export */}
                {exporting && (
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>{lang === 'ar' ? 'جاري تجميع الفيديو والرندرة...' : 'Rendering 4K Video Pipeline...'}</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-300"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="pt-5 border-t border-slate-700/80 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              >
                <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                <span>{lang === 'ar' ? 'الخطوة السابقة' : 'Previous'}</span>
              </button>
            ) : <div />}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep + 1) as any)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>{lang === 'ar' ? 'الخطوة التالية' : 'Next Step'}</span>
                <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartExport}
                disabled={exporting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-pink-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
                id="btn-start-render"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ar' ? 'بدء التصدير والرندرة 🚀' : 'Start Render & Export 🚀'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Video Player & Timeline (Col 8-12) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Video className="w-4 h-4 text-indigo-400" />
              {lang === 'ar' ? 'المعاينة الحية الفورية' : 'Live Interactive Player'}
            </span>
            <span className="text-[10px] font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10">
              {aspectRatio} • {resolution}
            </span>
          </div>

          {/* Player Container */}
          <div className="relative mx-auto w-full max-w-[280px] aspect-[9/15] rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl bg-black group">
            <img
              src={selectedStock.thumbnail}
              alt="Video Preview"
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

            {/* Dynamic Animated Subtitle on Video */}
            <div
              className={`absolute inset-x-3 text-center transition-all ${
                subtitlePosition === 'middle' ? 'top-1/2 -translate-y-1/2' : 'bottom-16'
              }`}
            >
              {subtitleStyle === 'yellow' && (
                <span className="inline-block px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wide shadow-xl transform -rotate-1">
                  {getCurrentSubtitleText()}
                </span>
              )}
              {subtitleStyle === 'gradient' && (
                <span className="inline-block px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-xl">
                  {getCurrentSubtitleText()}
                </span>
              )}
              {subtitleStyle === 'bold' && (
                <span className="inline-block px-3 py-1.5 rounded-lg bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wide shadow-xl">
                  {getCurrentSubtitleText()}
                </span>
              )}
              {subtitleStyle === 'minimal' && (
                <span className="inline-block px-3 py-1.5 rounded-lg bg-slate-950/80 text-white font-bold text-xs border border-white/30 backdrop-blur-sm">
                  {getCurrentSubtitleText()}
                </span>
              )}
            </div>

            {/* Big Play / Pause Overlay Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </div>
            </button>

            {/* Bottom In-Video Bar */}
            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-[10px] text-white">
              <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-indigo-400">
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              </button>
              <span className="font-mono">00:{playerCurrentTime.toString().padStart(2, '0')} / 00:{totalDuration}</span>
              <button onClick={() => setPlayerCurrentTime(0)} title="Reset">
                <RotateCcw className="w-3 h-3 text-slate-400 hover:text-white" />
              </button>
            </div>
          </div>

          {/* TIMELINE COMPONENT (Layers: Video, Voice, Music, Subtitles) */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                {lang === 'ar' ? 'التايم لاين التفاعلي' : 'Multi-Track Timeline'}
              </span>
              <span className="font-mono text-indigo-400">{playerCurrentTime}s / {totalDuration}s</span>
            </div>

            {/* Track 1: Video Footage */}
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-12 text-slate-400 shrink-0">Video</span>
              <div className="relative flex-1 h-5 rounded-md bg-slate-800 overflow-hidden border border-slate-700/60">
                <div className="w-full h-full bg-gradient-to-r from-blue-600/70 to-indigo-600/70 flex items-center px-2 text-white font-semibold truncate">
                  {selectedStock.title} (4K)
                </div>
                {/* Playhead */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-pink-500 z-10"
                  style={{ left: `${(playerCurrentTime / totalDuration) * 100}%` }}
                />
              </div>
            </div>

            {/* Track 2: AI Voice */}
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-12 text-slate-400 shrink-0">Voice</span>
              <div className="relative flex-1 h-5 rounded-md bg-slate-800 overflow-hidden border border-slate-700/60">
                <div className="w-full h-full bg-gradient-to-r from-pink-600/70 to-purple-600/70 flex items-center px-2 text-white font-semibold truncate">
                  AI: {selectedVoice.name}
                </div>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-pink-500 z-10"
                  style={{ left: `${(playerCurrentTime / totalDuration) * 100}%` }}
                />
              </div>
            </div>

            {/* Track 3: Background Music */}
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-12 text-slate-400 shrink-0">Music</span>
              <div className="relative flex-1 h-5 rounded-md bg-slate-800 overflow-hidden border border-slate-700/60">
                <div className="w-full h-full bg-gradient-to-r from-emerald-600/60 to-teal-600/60 flex items-center px-2 text-white font-semibold truncate">
                  {selectedMusic.name} ({musicVolume}%)
                </div>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-pink-500 z-10"
                  style={{ left: `${(playerCurrentTime / totalDuration) * 100}%` }}
                />
              </div>
            </div>

            {/* Track 4: Animated Subtitles */}
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-12 text-slate-400 shrink-0">Subs</span>
              <div className="relative flex-1 h-5 rounded-md bg-slate-800 overflow-hidden border border-slate-700/60">
                <div className="w-full h-full bg-amber-500/40 flex items-center px-2 text-amber-200 font-semibold truncate">
                  Hormozi Kinetic Captions
                </div>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-pink-500 z-10"
                  style={{ left: `${(playerCurrentTime / totalDuration) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
