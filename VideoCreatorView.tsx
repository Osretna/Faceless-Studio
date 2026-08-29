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
  Upload,
  Link as LinkIcon,
  RefreshCw,
  AlertCircle,
  Check,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, ScriptResult, VoiceOption, MusicOption, VideoProject } from '../../types';
import { translations } from '../../translations';
import { MOCK_VOICES, MOCK_MUSIC, STOCK_VIDEOS_PREVIEW } from '../../mockData';
import { audioEngine } from '../../utils/audioEngine';

interface VideoCreatorViewProps {
  lang: Language;
  initialScript?: ScriptResult | null;
  initialProject?: VideoProject | null;
  onVideoCreated: (newProject: VideoProject) => void;
}

export const VideoCreatorView: React.FC<VideoCreatorViewProps> = ({
  lang,
  initialScript,
  initialProject,
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

  // Step 3: Stock footage & Image Management
  const [selectedStock, setSelectedStock] = useState(STOCK_VIDEOS_PREVIEW[0]);
  const [imageSourceTab, setImageSourceTab] = useState<'stock' | 'upload' | 'url' | 'ai'>('stock');
  const [stockCategory, setStockCategory] = useState<'all' | 'tech' | 'city' | 'luxury' | 'space' | 'nature' | 'mystery'>('all');
  const [stockSearch, setStockSearch] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [aiImagePrompt, setAiImagePrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [imageToast, setImageToast] = useState<string | null>(null);
  const [uploadedCustomImages, setUploadedCustomImages] = useState<Array<{ id: string; title: string; thumbnail: string; previewUrl: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Audio Engine & Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [visualizerLevel, setVisualizerLevel] = useState(0);
  const totalDuration = 35; // seconds

  // Initialize from initialScript
  useEffect(() => {
    if (initialScript) {
      setScriptText(
        `${initialScript.hook}\n\n${initialScript.body}\n\n${initialScript.cta}`
      );
    }
  }, [initialScript]);

  // Initialize from initialProject if passed from Dashboard
  useEffect(() => {
    if (initialProject) {
      if (initialProject.script) {
        setScriptText(
          `${initialProject.script.hook}\n\n${initialProject.script.body}\n\n${initialProject.script.cta}`
        );
      }
      setSelectedStock({
        id: initialProject.id,
        title: initialProject.title,
        thumbnail: initialProject.thumbnailUrl,
        previewUrl: initialProject.videoUrl || initialProject.thumbnailUrl,
      });
      if (initialProject.aspectRatio) {
        setAspectRatio(initialProject.aspectRatio as any);
      }
      if (initialProject.selectedVoice) {
        const foundVoice = MOCK_VOICES.find(v => v.id === initialProject.selectedVoice);
        if (foundVoice) setSelectedVoice(foundVoice);
      }
    }
  }, [initialProject]);

  // Visualizer listener from audioEngine
  useEffect(() => {
    return audioEngine.onVisualizerData((lvl) => {
      setVisualizerLevel(lvl);
    });
  }, []);

  // Clean up timers & stop all audio on unmount
  useEffect(() => {
    return () => {
      if (exportTimerRef.current) {
        clearInterval(exportTimerRef.current);
      }
      audioEngine.stopAll();
    };
  }, []);

  // Subtitle phrases mapped to player progress
  const getCurrentSubtitleText = (time: number = playerCurrentTime) => {
    if (time < 4) return '🔥 توقف عن تضييع ساعات في المونتاج!';
    if (time < 12) return 'هذا هو السر الخفي لأنجح قنوات الفيسلس اليوم.';
    if (time < 24) return 'توليد صوتي عصبي + لقطات عالية التباين.';
    return 'احفظ الفيديو لتطبقه الليلة! 🚀';
  };

  // Synchronize audio speech when playerCurrentTime hits scene boundaries
  useEffect(() => {
    if (!isPlaying) return;

    if (playerCurrentTime === 0 || playerCurrentTime === 4 || playerCurrentTime === 12 || playerCurrentTime === 24) {
      const phrase = getCurrentSubtitleText(playerCurrentTime);
      audioEngine.speakText(phrase, selectedVoice.id);
    }
  }, [playerCurrentTime, isPlaying, selectedVoice.id]);

  // Timeline timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlayerCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            audioEngine.stopAll();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Toggle Video Play / Pause with Audio
  const togglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioEngine.stopAll();
    } else {
      await audioEngine.resumeAudioContext();
      if (isMuted) {
        setIsMuted(false);
        audioEngine.setMuted(false);
      }
      setIsPlaying(true);
      // Start background music
      audioEngine.startMusic(selectedMusic.id, musicVolume);
      // Start voiceover narration for current scene
      const phrase = getCurrentSubtitleText(playerCurrentTime);
      audioEngine.speakText(phrase, selectedVoice.id);
    }
  };

  // Quick Sound Test
  const handleQuickSoundCheck = async () => {
    await audioEngine.resumeAudioContext();
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setMuted(false);
    }
    audioEngine.playTestSound(lang);
    showFeedback(lang === 'ar' ? '🔊 جاري فحص وتشغيل الصوت ومكبرات الصوت الآن...' : '🔊 Testing audio and speech system...');
  };

  // Reset timeline
  const handleResetTimeline = async () => {
    setPlayerCurrentTime(0);
    audioEngine.stopSpeaking();
    if (isPlaying) {
      await audioEngine.resumeAudioContext();
      const phrase = getCurrentSubtitleText(0);
      audioEngine.speakText(phrase, selectedVoice.id);
    }
  };

  // Toggle Master Mute
  const handleToggleMute = async () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    await audioEngine.resumeAudioContext();
    audioEngine.setMuted(nextMuted);
  };

  // Toast feedback helper
  const showFeedback = (msg: string) => {
    setImageToast(msg);
    setTimeout(() => {
      setImageToast(null);
    }, 4000);
  };

  // Image Selection Handler
  const handleSelectImage = (img: { id: string; title: string; thumbnail: string; previewUrl: string }) => {
    setSelectedStock(img);
    showFeedback(lang === 'ar' ? 'تم اختيار الصورة وتحديث معاينة الفيديو بنجاح! 🖼️' : 'Image selected and video updated!');
  };

  // Device File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const customItem = {
          id: `upload-${Date.now()}`,
          title: file.name.slice(0, 20),
          thumbnail: dataUrl,
          previewUrl: dataUrl,
        };
        setUploadedCustomImages((prev) => [customItem, ...prev]);
        setSelectedStock(customItem);
        showFeedback(lang === 'ar' ? 'تم رفع صورتك من جهازك وتطبيقها فوراً كخلفية للفيديو! 🚀' : 'Uploaded from device & set as video background!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // External URL Image Handler
  const handleApplyUrl = () => {
    if (!customImageUrl.trim()) return;
    const url = customImageUrl.trim();
    const customItem = {
      id: `url-${Date.now()}`,
      title: 'صورة من رابط خارجي',
      thumbnail: url,
      previewUrl: url,
    };
    setUploadedCustomImages((prev) => [customItem, ...prev]);
    setSelectedStock(customItem);
    setCustomImageUrl('');
    showFeedback(lang === 'ar' ? 'تم تطبيق رابط الصورة بنجاح! 🌐' : 'Image link applied successfully!');
  };

  // AI Image Generation Handler
  const handleGenerateAiImage = () => {
    setIsGeneratingAi(true);
    const prompt = aiImagePrompt.trim() || scriptText.slice(0, 60);

    setTimeout(() => {
      let generatedUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
      const p = prompt.toLowerCase();
      if (p.includes('فضاء') || p.includes('space') || p.includes('galaxy') || p.includes('نجوم')) {
        generatedUrl = 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80';
      } else if (p.includes('مال') || p.includes('ثروة') || p.includes('wealth') || p.includes('تداول') || p.includes('gold')) {
        generatedUrl = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80';
      } else if (p.includes('مدينة') || p.includes('نيون') || p.includes('city') || p.includes('cyber') || p.includes('ليل')) {
        generatedUrl = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80';
      } else if (p.includes('طبيعة') || p.includes('nature') || p.includes('جبل') || p.includes('بحر')) {
        generatedUrl = 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&auto=format&fit=crop&q=80';
      } else if (p.includes('غموض') || p.includes('dark') || p.includes('رعب')) {
        generatedUrl = 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80';
      } else {
        generatedUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80';
      }

      const aiItem = {
        id: `ai-${Date.now()}`,
        title: `AI: ${prompt.slice(0, 18)}...`,
        thumbnail: generatedUrl,
        previewUrl: generatedUrl,
      };
      setUploadedCustomImages((prev) => [aiItem, ...prev]);
      setSelectedStock(aiItem);
      setIsGeneratingAi(false);
      showFeedback(lang === 'ar' ? 'تم توليد الصورة بالذكاء الاصطناعي ووضعها كخلفية للفيديو! ✨' : 'AI image generated and set!');
    }, 1000);
  };

  // Filtered stock footage list
  const filteredStockVideos = STOCK_VIDEOS_PREVIEW.filter((stk) => {
    if (stockCategory !== 'all' && stk.category !== stockCategory) {
      return false;
    }
    if (stockSearch.trim()) {
      const q = stockSearch.trim().toLowerCase();
      const matchTitle = stk.title.toLowerCase().includes(q);
      const matchTitleEn = stk.titleEn?.toLowerCase().includes(q);
      const matchTags = stk.tags?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchTitleEn || matchTags;
    }
    return true;
  });

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
          topic: 'فيديو ذكاء اصطناعي احترافي',
          durationSeconds: totalDuration,
          thumbnailUrl: selectedStock.thumbnail,
          videoUrl: selectedStock.previewUrl,
          status: 'ready',
          platform: 'TikTok',
          voiceName: selectedVoice.name,
          aspectRatio,
          createdAt: lang === 'ar' ? 'الآن' : 'Just now',
        };

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
    { step: 3, labelAr: 'تغيير الصورة/الستوك', labelEn: 'Visuals', icon: ImageIcon },
    { step: 4, labelAr: 'الموسيقى', labelEn: 'Music', icon: Music },
    { step: 5, labelAr: 'الترجمة الحركية', labelEn: 'Subtitles', icon: Type },
    { step: 6, labelAr: 'المعاينة والتصدير', labelEn: 'Export', icon: Download },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {imageToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-500/90 text-white font-bold text-xs shadow-2xl backdrop-blur-md border border-emerald-400/50 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{imageToast}</span>
        </div>
      )}

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
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25 ring-2 ring-indigo-400/30'
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
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-800/50 border border-slate-700/80 shadow-xl flex flex-col justify-between min-h-[500px]">
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

            {/* STEP 2: VOICE SELECTION & LIVE PREVIEW */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Mic className="w-4 h-4 text-pink-400" />
                    {lang === 'ar' ? 'الخطوة 2: اختيار صوت الذكاء الاصطناعي مع تجربة الصوت الحية 🔊' : 'Step 2: AI Voice with Live Preview'}
                  </h3>
                  <span className="text-xs font-mono text-emerald-400">انقر ▶ لسماع نبرة الصوت</span>
                </div>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'أصوات عصبية فائقة الواقعية. انقر على أيقونة التشغيل لسماع عينة فورية لكل صوت!' : 'Ultra-realistic neural voices. Click play on any voice to preview its tone instantly.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {MOCK_VOICES.map((v) => {
                    const isSelected = selectedVoice.id === v.id;
                    const isPlayingVoice = playingVoiceId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVoice(v)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md ring-1 ring-indigo-400/40'
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
                          onClick={async (e) => {
                            e.stopPropagation();
                            await audioEngine.resumeAudioContext();
                            if (isMuted) {
                              setIsMuted(false);
                              audioEngine.setMuted(false);
                            }
                            if (isPlayingVoice) {
                              audioEngine.stopSpeaking();
                              setPlayingVoiceId(null);
                            } else {
                              audioEngine.stopAll();
                              setPlayingVoiceId(v.id);
                              audioEngine.playVoiceSample(v.id, lang, () => setPlayingVoiceId(null));
                            }
                          }}
                          className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            isPlayingVoice 
                              ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/40 animate-pulse' 
                              : 'bg-slate-800 text-indigo-300 hover:bg-slate-700'
                          }`}
                          title="تجربة هذا الصوت"
                        >
                          {isPlayingVoice ? (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="text-[10px]">يعمل..</span>
                            </>
                          ) : (
                            <Play className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: ADVANCED IMAGE & VISUAL SELECTOR */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    {lang === 'ar' ? 'الخطوة 3: تغيير الصورة وخلفية الفيديو' : 'Step 3: Change Image & Visual Background'}
                  </h3>
                  <span className="text-xs text-indigo-400 font-bold bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-800">
                    {lang === 'ar' ? 'دقة 4K عالية التباين' : '4K High Contrast'}
                  </span>
                </div>

                {/* Sub-tabs for Image Source */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-700/80">
                  <button
                    type="button"
                    onClick={() => setImageSourceTab('stock')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      imageSourceTab === 'stock'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'مكتبة الستوك 4K' : 'Stock 4K'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageSourceTab('upload')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      imageSourceTab === 'upload'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'رفع من جهازك 💻' : 'Upload File'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageSourceTab('url')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      imageSourceTab === 'url'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'رابط مباشر 🔗' : 'Image Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageSourceTab('ai')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      imageSourceTab === 'ai'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'توليد AI ✨' : 'AI Generate'}</span>
                  </button>
                </div>

                {/* TAB 1: Stock Library */}
                {imageSourceTab === 'stock' && (
                  <div className="space-y-3">
                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      {[
                        { id: 'all', labelAr: 'الكل (15+)', labelEn: 'All' },
                        { id: 'tech', labelAr: 'تكنولوجيا & AI', labelEn: 'Tech & AI' },
                        { id: 'city', labelAr: 'مدن & نيون', labelEn: 'Cyber City' },
                        { id: 'luxury', labelAr: 'ثروة & أعمال', labelEn: 'Wealth & Luxury' },
                        { id: 'space', labelAr: 'فضاء & فلك', labelEn: 'Deep Space' },
                        { id: 'nature', labelAr: 'طبيعة سينمائية', labelEn: 'Nature' },
                        { id: 'mystery', labelAr: 'غموض & تركيز', labelEn: 'Dark Mystery' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setStockCategory(cat.id as any)}
                          className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                            stockCategory === cat.id
                              ? 'bg-indigo-500 text-white font-bold shadow-sm'
                              : 'bg-slate-900/80 text-slate-400 hover:text-white'
                          }`}
                        >
                          {lang === 'ar' ? cat.labelAr : cat.labelEn}
                        </button>
                      ))}
                    </div>

                    {/* Search Input with Clear Button */}
                    <div className="relative">
                      <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${
                        lang === 'ar' ? 'right-3' : 'left-3'
                      }`} />
                      <input
                        type="text"
                        value={stockSearch}
                        onChange={(e) => setStockSearch(e.target.value)}
                        placeholder={lang === 'ar' ? 'ابحث عن المشاهد (مثال: فضاء، نيويورك، شاشات، تداول، سيارات)...' : 'Search stock scenes (e.g. space, tech, city, crypto)...'}
                        className={`w-full h-9 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 ${
                          lang === 'ar' ? 'pr-9 pl-8' : 'pl-9 pr-8'
                        }`}
                      />
                      {stockSearch && (
                        <button
                          onClick={() => setStockSearch('')}
                          className={`absolute top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white ${
                            lang === 'ar' ? 'left-2.5' : 'right-2.5'
                          }`}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Stock Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                      {filteredStockVideos.map((stk) => {
                        const isSelected = selectedStock.id === stk.id || selectedStock.thumbnail === stk.thumbnail;
                        return (
                          <div
                            key={stk.id}
                            onClick={() => handleSelectImage(stk)}
                            className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-[9/13] ${
                              isSelected 
                                ? 'border-indigo-400 ring-2 ring-indigo-500/50 shadow-lg scale-[1.02]' 
                                : 'border-slate-700/80 hover:border-slate-500 hover:scale-[1.01]'
                            }`}
                          >
                            <img src={stk.thumbnail} alt={stk.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />
                            <span className="absolute bottom-1.5 inset-x-1 text-center text-[10px] font-bold text-white truncate px-1">
                              {stk.title}
                            </span>
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow">
                                ✓
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 2: Upload from Device */}
                {imageSourceTab === 'upload' && (
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*,video/*"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-indigo-500/50 hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer bg-slate-900/60 hover:bg-slate-900 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1">
                        {lang === 'ar' ? 'انقر لاختيار صورة من جهازك أو اسحبها هنا' : 'Click to browse images or drag & drop'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'ar' ? 'يدعم صور JPG, PNG, WEBP بدقة فائقة ويتم تطبيقها فوراً' : 'Supports JPG, PNG, WEBP. Applied immediately.'}
                      </p>
                      <button
                        type="button"
                        className="mt-3 px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow hover:bg-indigo-500"
                      >
                        {lang === 'ar' ? 'تصفح جهازك 📂' : 'Browse Files 📂'}
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: Paste Image Link */}
                {imageSourceTab === 'url' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-900 border border-slate-700/80">
                    <label className="block text-xs font-bold text-white">
                      {lang === 'ar' ? 'ألصق رابط الصورة المباشر من الإنترنت:' : 'Paste direct image URL:'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyUrl}
                        disabled={!customImageUrl.trim()}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow"
                      >
                        {lang === 'ar' ? 'تطبيق الصورة' : 'Apply'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{lang === 'ar' ? 'روابط سريعة للتجربة:' : 'Quick demo links:'}</span>
                      <button
                        type="button"
                        onClick={() => setCustomImageUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800')}
                        className="text-indigo-400 hover:underline"
                      >
                        نيويورك
                      </button>
                      •
                      <button
                        type="button"
                        onClick={() => setCustomImageUrl('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800')}
                        className="text-indigo-400 hover:underline"
                      >
                        سديم الفضاء
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 4: AI Image Generation */}
                {imageSourceTab === 'ai' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-900 border border-purple-800/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        {lang === 'ar' ? 'توليد مشهد سينمائي مخصص بالذكاء الاصطناعي' : 'Generate Cinematic Scene with AI'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAiImagePrompt(scriptText.slice(0, 50))}
                        className="text-[10px] text-purple-400 hover:underline"
                      >
                        {lang === 'ar' ? 'اقتباس من السكريبت ✨' : 'Suggest from Script'}
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={aiImagePrompt}
                      onChange={(e) => setAiImagePrompt(e.target.value)}
                      placeholder={lang === 'ar' ? 'اكتب وصف المشهد الذي تريده (مثال: ناطحة سحاب ليلية بنور أزرق، أو كوكب متوهج في الفضاء)...' : 'Describe the scene you want to generate...'}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                    />

                    <button
                      type="button"
                      onClick={handleGenerateAiImage}
                      disabled={isGeneratingAi}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                      {isGeneratingAi ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{lang === 'ar' ? 'جاري توليد المشهد بدقة 4K...' : 'Generating 4K visual...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'توليد الصورة وتطبيقها الآن ✨' : 'Generate & Set Scene'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Uploaded / Custom Image History Gallery */}
                {uploadedCustomImages.length > 0 && (
                  <div className="pt-2 border-t border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                      {lang === 'ar' ? 'الصور المرفوعة والمولدة مؤخراً:' : 'Recent Custom Images:'}
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {uploadedCustomImages.map((custom) => (
                        <div
                          key={custom.id}
                          onClick={() => handleSelectImage(custom)}
                          className={`relative w-16 h-20 rounded-lg overflow-hidden border cursor-pointer shrink-0 ${
                            selectedStock.id === custom.id ? 'border-indigo-400 ring-2 ring-indigo-500' : 'border-slate-700'
                          }`}
                        >
                          <img src={custom.thumbnail} alt={custom.title} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: MUSIC SELECTION & LIVE PREVIEW */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Music className="w-4 h-4 text-purple-400" />
                    {lang === 'ar' ? 'الخطوة 4: الموسيقى التصويرية الخالية من حقوق الملكية 🎵' : 'Step 4: Royalty-Free Background Audio'}
                  </h3>
                  <span className="text-xs text-purple-400">انقر ▶ لسماع الموسيقى الحية</span>
                </div>

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
                            ? 'bg-indigo-600/25 border-indigo-500 text-white ring-1 ring-indigo-400/40'
                            : 'bg-slate-900/70 border-slate-700/70 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await audioEngine.resumeAudioContext();
                              if (isMuted) {
                                setIsMuted(false);
                                audioEngine.setMuted(false);
                              }
                              if (isPlayingMusic) {
                                audioEngine.stopMusic();
                                setPlayingMusicId(null);
                              } else {
                                audioEngine.stopAll();
                                setPlayingMusicId(m.id);
                                audioEngine.startMusic(m.id, musicVolume);
                              }
                            }}
                            className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                              isPlayingMusic 
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 animate-pulse' 
                                : 'bg-slate-800 text-indigo-400 hover:bg-slate-700'
                            }`}
                            title="تجربة الموسيقى"
                          >
                            {isPlayingMusic ? (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span className="text-[10px]">يعمل..</span>
                              </>
                            ) : (
                              <Play className="w-3.5 h-3.5" />
                            )}
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
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center gap-3 mt-3">
                  <span className="text-xs font-semibold text-slate-300 shrink-0">
                    {lang === 'ar' ? 'مستوى صوت الموسيقى خلف التعليق:' : 'Music Ducking Volume:'}
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="70"
                    value={musicVolume}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setMusicVolume(val);
                      audioEngine.setMusicVolume(val);
                    }}
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
                      subtitleStyle === 'yellow' ? 'border-amber-400 bg-amber-500/15 text-white ring-1 ring-amber-400' : 'border-slate-700 bg-slate-900 text-slate-400'
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
                      subtitleStyle === 'gradient' ? 'border-pink-500 bg-pink-500/15 text-white ring-1 ring-pink-400' : 'border-slate-700 bg-slate-900 text-slate-400'
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
                      subtitleStyle === 'bold' ? 'border-emerald-500 bg-emerald-500/15 text-white ring-1 ring-emerald-400' : 'border-slate-700 bg-slate-900 text-slate-400'
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
                      subtitleStyle === 'minimal' ? 'border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-400' : 'border-slate-700 bg-slate-900 text-slate-400'
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
                    <span className="font-bold text-white">{selectedMusic.name} ({musicVolume}%)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>{lang === 'ar' ? 'الصورة المطبقة:' : 'Background Visual:'}</span>
                    <span className="font-bold text-emerald-400 truncate max-w-[200px]">{selectedStock.title}</span>
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

        {/* Video Player & Interactive Audio Timeline (Col 8-12) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Video className="w-4 h-4 text-indigo-400" />
              {lang === 'ar' ? 'مشغل الفيديو مع الصوت الحي 🔊' : 'Live Interactive Player & Audio'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickSoundCheck}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                title={lang === 'ar' ? 'اختبار سماعات الصوت والنطق' : 'Test Audio & Speech'}
                id="btn-test-sound-player"
              >
                <Volume2 className="w-3 h-3 text-emerald-400" />
                <span>{lang === 'ar' ? 'تجربة الصوت 🔊' : 'Test Sound'}</span>
              </button>
              <span className="text-[10px] font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10">
                {aspectRatio} • {resolution}
              </span>
            </div>
          </div>

          {/* Interactive Player Container */}
          <div className="relative mx-auto w-full max-w-[280px] aspect-[9/15] rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl bg-black group">
            {/* Quick Button to Change Image right from player */}
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/85 hover:bg-indigo-600 border border-white/20 text-[11px] font-bold text-white shadow-xl backdrop-blur-md transition-all group/btn"
              title={lang === 'ar' ? 'تغيير صورة أو خلفية الفيديو' : 'Change Image'}
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400 group-hover/btn:text-white" />
              <span>{lang === 'ar' ? 'تغيير الصورة' : 'Change Image'}</span>
            </button>

            {/* Current Selected Image Display */}
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
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </div>
            </button>

            {/* Bottom In-Video Bar with Mute Toggle & Equalizer */}
            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-[10px] text-white z-10 border border-white/10">
              <div className="flex items-center gap-2">
                <button 
                  onClick={togglePlay} 
                  className="hover:text-indigo-400 p-0.5"
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل مع الصوت'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                </button>

                <button 
                  onClick={handleToggleMute} 
                  className={`hover:text-white p-0.5 transition-colors ${isMuted ? 'text-red-400' : 'text-emerald-400'}`}
                  title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                {/* Sound Equalizer Bars */}
                <div className="flex items-end gap-0.5 h-3.5">
                  {[0.4, 0.9, 0.6, 1.0, 0.7].map((barScale, idx) => (
                    <div
                      key={idx}
                      className={`w-0.5 rounded-full transition-all duration-150 ${
                        isPlaying && !isMuted ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                      style={{
                        height: isPlaying && !isMuted
                          ? `${Math.max(3, Math.min(14, 14 * visualizerLevel * barScale))}px`
                          : '3px'
                      }}
                    />
                  ))}
                </div>
              </div>

              <span className="font-mono text-[10px] text-slate-300">
                00:{playerCurrentTime.toString().padStart(2, '0')} / 00:{totalDuration}
              </span>

              <button onClick={handleResetTimeline} title="إعادة تشغيل من البداية">
                <RotateCcw className="w-3 h-3 text-slate-400 hover:text-white" />
              </button>
            </div>
          </div>

          {/* Quick Sound Status Badge */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px]">
            <div className="flex items-center gap-2 text-slate-300 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">
                {lang === 'ar' ? 'الصوت:' : 'Audio:'} <strong>{selectedVoice.name}</strong> + <strong>{selectedMusic.name}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleMute}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                isMuted 
                  ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isMuted ? (lang === 'ar' ? 'مكتوم 🔇' : 'Muted') : (lang === 'ar' ? 'يعمل 🔊' : 'Active 🔊')}
            </button>
          </div>

          {/* Quick Image Picker Strip directly beneath the player */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>{lang === 'ar' ? 'تبديل سريع لخلفية الفيديو:' : 'Quick Background Switcher:'}</span>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-indigo-400 hover:underline text-[10px]"
              >
                {lang === 'ar' ? 'المكتبة الكاملة والرفع +' : 'Full Library & Upload +'}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {STOCK_VIDEOS_PREVIEW.slice(0, 4).map((stk) => {
                const isSelected = selectedStock.id === stk.id || selectedStock.thumbnail === stk.thumbnail;
                return (
                  <div
                    key={stk.id}
                    onClick={() => handleSelectImage(stk)}
                    className={`relative rounded-lg overflow-hidden border cursor-pointer aspect-video group ${
                      isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-slate-800 hover:border-slate-600'
                    }`}
                    title={stk.title}
                  >
                    <img src={stk.thumbnail} alt={stk.title} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center text-white text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TIMELINE COMPONENT (Multi-Track Timeline with live playhead) */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                {lang === 'ar' ? 'التايم لاين الصوتي والمرئي' : 'Multi-Track Timeline'}
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
                  AI: {selectedVoice.name} 🔊
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
                  {selectedMusic.name} ({musicVolume}%) 🎵
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
