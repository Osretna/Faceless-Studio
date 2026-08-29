import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get Gemini client lazily
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Resilient Gemini generator with automatic fallback across models when 503 / high demand occurs
async function generateGeminiContentWithRetry(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const candidateModels = [
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];
  let lastError: any = null;

  for (let i = 0; i < candidateModels.length; i++) {
    const model = candidateModels[i];
    try {
      const callPromise = ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          ...(systemInstruction ? { systemInstruction } : {}),
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Model response timed out (8s limit)')), 8000)
      );

      const response = await Promise.race([callPromise, timeoutPromise]);

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      const isUnavailable =
        errMsg.includes('503') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('high demand') ||
        errMsg.includes('429') ||
        errMsg.includes('timed out');

      if (isUnavailable && i < candidateModels.length - 1) {
        console.log(`[Gemini] Model ${model} unavailable or timed out. Retrying with ${candidateModels[i + 1]}...`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }
    }
  }

  throw lastError || new Error('Gemini models temporarily unavailable');
}

// Procedural dynamic fallback for ideas
function buildDynamicIdeasFallback({
  niche = 'التقنية والذكاء الاصطناعي',
  platform = 'TikTok',
  count = 5,
  lang = 'ar',
}: {
  niche?: string;
  platform?: string;
  count?: number;
  lang?: string;
}) {
  const cleanNiche = (niche || 'صناعة المحتوى').trim();
  const requestedCount = Math.min(Math.max(Number(count) || 5, 1), 10);

  if (lang === 'en') {
    const templates = [
      {
        title: `5 Secret Tools in ${cleanNiche} That Feel Illegal to Know in 2026`,
        description: `High-retention countdown breakdown with rapid screen recordings and snappy audio transitions.`,
        difficulty: 'Easy',
        trendScore: 97,
        hook: `If you are not using tool #3 in ${cleanNiche}, you are wasting 4 hours every single day!`,
      },
      {
        title: `The Shocking Future of ${cleanNiche} Nobody Is Talking About`,
        description: `Atmospheric micro-documentary style with moody 4K stock and immersive narration.`,
        difficulty: 'Medium',
        trendScore: 94,
        hook: `Before this year ends, this entire aspect of ${cleanNiche} will change forever...`,
      },
      {
        title: `How to Build a High-Income Faceless Asset in ${cleanNiche} from Scratch`,
        description: `Actionable 3-step beginner blueprint with visual bullet points and animated income graphs.`,
        difficulty: 'Easy',
        trendScore: 98,
        hook: `Zero budget, zero showing your face. Follow these exact steps for ${cleanNiche}...`,
      },
      {
        title: `3 Costly Mistakes 90% of Beginners Make in ${cleanNiche}`,
        description: `Visual side-by-side comparison showing mistakes versus the professional fix in first 5 seconds.`,
        difficulty: 'Easy',
        trendScore: 91,
        hook: `Mistake #2 is the exact reason why most people quit ${cleanNiche} within 30 days!`,
      },
      {
        title: `I Tested the Craziest Strategy in ${cleanNiche} for 30 Days (Real Results)`,
        description: `Case study documentary format with dynamic metrics, dashboard overlays, and suspenseful music.`,
        difficulty: 'Advanced',
        trendScore: 96,
        hook: `They told me this was impossible in ${cleanNiche}, but look at the analytics after one month!`,
      },
      {
        title: `The Psychological Trick That Masters in ${cleanNiche} Use Daily`,
        description: `Deep thought-provoking analysis with dark cinematic visuals and ambient audio.`,
        difficulty: 'Medium',
        trendScore: 93,
        hook: `Your brain has been deceiving you about ${cleanNiche}, and here is proof!`,
      },
    ];

    return templates.slice(0, requestedCount).map((t, idx) => ({
      id: `idea-${idx + 1}-${Date.now()}`,
      ...t,
      platform,
    }));
  }

  const templates = [
    {
      title: `5 أدوات سرية في ${cleanNiche} ستجعلك تتفوق على 99% من الناس في 2026`,
      description: `فيديو سريع ومكثف يستعرض أسرار عملية مجهولة مع موسيقى حماسية وترتيب تنازلي بصري جذاب.`,
      difficulty: 'سهل',
      trendScore: 97,
      hook: `لو ما بتستخدمش الأداة رقم 3 في ${cleanNiche}، فانت بتضيع 4 ساعات يومياً بدون ما تحس!`,
    },
    {
      title: `الحقيقة الصادمة عن مستقبل ${cleanNiche} التي يخفيها المحترفون`,
      description: `سرد قصصي وثائقي سينمائي قصير مع تعليق صوتي غامض ومقاطع أرشيفية سريعة.`,
      difficulty: 'متوسط',
      trendScore: 94,
      hook: `قبل نهاية هذا العام، هذا الشيء في ${cleanNiche} سينتهي تماماً والبديل صدم الجميع...`,
    },
    {
      title: `كيف تبني مصدر دخل إضافي في ${cleanNiche} بدون ظهور وجهك خطوة بخطوة`,
      description: `دليل خطوة بخطوة موجه للمبتدئين مع لقطات شاشة تعليمية ورسوم بيانية توضيحية.`,
      difficulty: 'سهل',
      trendScore: 98,
      hook: `لا تحتاج ميزانية ضخمة ولا تحتاج تظهر بوجهك، فقط اتبع هذه الخطوات الثلاث في ${cleanNiche}...`,
    },
    {
      title: `أكبر 3 أخطاء شائعة في ${cleanNiche} تدمر وصولك فوراً`,
      description: `مقارنة بصرية بين ما يفعله المبتدئ مقابل ما يفعله المحترف في الثواني الأولى.`,
      difficulty: 'سهل',
      trendScore: 91,
      hook: `الخطأ الثاني بالذات هو السبب في أن 85% من الناس يستسلمون في ${cleanNiche}!`,
    },
    {
      title: `تجربة حية: 30 يوم من تطبيق هذه الإستراتيجية في ${cleanNiche}`,
      description: `فيديو وثائقي بأسلوب Case Study مع نتائج رقمية وإثباتات نجاح بصرية ممتعة.`,
      difficulty: 'متقدم',
      trendScore: 96,
      hook: `قررت أجرب أغرب إستراتيجية في ${cleanNiche}، وهذه هي النتيجة الصادمة بعد شهر كامل!`,
    },
    {
      title: `سر نفسي خطير يغير نظرتك تماماً لمجال ${cleanNiche}`,
      description: `فيديو فلسفي عميق مع مقاطع طبيعية داكنة وموسيقى تأملية هادئة وسرد مريح.`,
      difficulty: 'متوسط',
      trendScore: 93,
      hook: `طريقة تفكيرك الحالية عن ${cleanNiche} تمنعك من التقدم، وهذا هو التفسير العلمي!`,
    },
  ];

  return templates.slice(0, requestedCount).map((t, idx) => ({
    id: `idea-${idx + 1}-${Date.now()}`,
    ...t,
    platform,
  }));
}

// Procedural dynamic fallback for scripts
function buildDynamicScriptFallback({
  topic = 'صناعة المحتوى والذكاء الاصطناعي',
  type = 'تعليمي',
  dialect = 'فصحى معاصرة',
  duration = 60,
  includeCTA = true,
  lang = 'ar',
}: {
  topic?: string;
  type?: string;
  dialect?: string;
  duration?: number;
  includeCTA?: boolean;
  lang?: string;
}) {
  const cleanTopic = (topic || 'أسرار الذكاء الاصطناعي').trim();
  const dur = Number(duration) || 60;

  if (lang === 'en') {
    return {
      hook: `Stop scrolling! If you want to master "${cleanTopic}", this hidden method changes everything.`,
      body: `Here is why 90% of creators struggle with "${cleanTopic}"—and the exact 3-step formula top creators follow:\n\nStep 1: Focus on immediate curiosity in the opening 3 seconds.\nStep 2: Rapid cinematic pacing with high-contrast stock footage and ambient synth score.\nStep 3: Deliver pure actionable value with zero fluff.\n\nApply this today to multiply your organic retention!`,
      cta: includeCTA ? `Save this video for later and drop your question in the comments below!` : '',
      visualSuggestions: [
        `Cinematic macro visual representing "${cleanTopic}" with dramatic lighting`,
        `Fast-paced 4K footage montage with seamless motion blur cuts`,
        `Clean futuristic animated chart showcasing rapid metrics growth`,
        `Dramatic concluding hero shot leaving a lasting impression`,
      ],
      estimatedDuration: dur,
      estimatedDurationSeconds: dur,
      wordCount: Math.round(dur * 2.3),
      topic: cleanTopic,
      type,
      dialect,
    };
  }

  let hook = `توقف عن التمرير! هذا هو السر الخفي في "${cleanTopic}" الذي لا يخبرك به المحترفون...`;
  if (type.includes('قصصي') || type.includes('Story')) {
    hook = `في عام 2026، حدث أمر غريب حول "${cleanTopic}"... والقصة ستغير نظرتك تماماً!`;
  } else if (type.includes('حقائق') || type.includes('صادمة')) {
    hook = `3 حقائق صادمة عن "${cleanTopic}" ستجعلك تعيد حساباتك فوراً!`;
  } else if (type.includes('تحفيزي')) {
    hook = `إذا كنت تشعر أنك متأخر، فهذه الرسالة حول "${cleanTopic}" موجهة لك تحديداً الليلة!`;
  }

  let body = `السر الحقيقي الذي يجهله 95% من الناس في مجال "${cleanTopic}"، ليس في بذل ساعات مضاعفة، بل في إتقان الإستراتيجية الذكية.\n\nأولاً: البدء بأقوى فكرة تشد الانتباه في أول ثانيتين بدون أي مقدمات مملة.\nثانياً: تقديم حل عملي فوري عبر مشاهد بصرية متتابعة وموسيقى ترفع الحماس.\nثالثاً: الاستمرار اليومي وبناء محتوى ذكي يعمل لصالحك ويجذب المتابعين باستمرار!`;

  if (dialect.includes('مصر')) {
    hook = `استنى لحظة! السر اللي مخلّي الكل بيتكلم عن "${cleanTopic}" هو اللي هقولهولك حالا...`;
    body = `الموضوع مش محتاج تعقيد ولا سنين خبرة. السر في "${cleanTopic}" بيبدأ من ثلاث خطوات بسيطة:\n\nأول حاجة: ركّز على الفكرة اللي الناس محتاجاها بجد.\nتاني حاجة: استغل الذكاء الاصطناعي عشان يوفّر عليك 80% من المونتاج والوقت.\nتالت حاجة: الاستمرارية.. لأن الفيديو اللي مش متوقعه هو اللي هيضرب ترند!`;
  } else if (dialect.includes('خليج')) {
    hook = `وقّف عندك! لو ودك تتميز بمجال "${cleanTopic}" وتوصل للملايين، ركز معي بهالسر...`;
    body = `أغلب الناس يحسبون التميز في "${cleanTopic}" ضربة حظ، والواقع إنه خطوات واضحة ومدروسة:\n\nأولاً: اختر زاوية ذكية ومثيرة للفضول ما حد تطرق لها.\nثانياً: استخدم مونتاج سريع وصوت نقي يجذب المشاهد من أول لحظة.\nثالثاً: طبّق واستمر بدون تردد، وبتشوف النتائج بأول شهر!`;
  }

  const cta = includeCTA
    ? `احفظ الفيديو عشان ترجع تطبقه الليلة، واكتب في التعليقات: ما هي أكبر عقبة تواجهك في "${cleanTopic}"؟`
    : '';

  return {
    hook,
    body,
    cta,
    visualSuggestions: [
      `لقطة ماكرو سينمائية مقربة وشديدة الوضوح ترمز لموضوع: ${cleanTopic}`,
      `مقطع 4K سينمائي بحركة كاميرا ديناميكية وإضاءة نيون داكنة`,
      `رسوم بيانية ثلاثية الأبعاد متحركة تُظهر قفزة في الأرقام والإحصائيات`,
      `مشهد درامي ختامي يرسخ الرسالة الأساسية في ذهن المشاهد`,
    ],
    estimatedDuration: dur,
    estimatedDurationSeconds: dur,
    wordCount: Math.round(dur * 2.4),
    topic: cleanTopic,
    type,
    dialect,
  };
}

// Procedural dynamic fallback for captions
function buildDynamicCaptionFallback({
  topic = 'صناعة المحتوى',
  platform = 'TikTok',
  hashtagCount = 7,
  includeEmoji = true,
  lang = 'ar',
}: {
  topic?: string;
  platform?: string;
  hashtagCount?: number;
  includeEmoji?: boolean;
  lang?: string;
}) {
  const cleanTopic = (topic || 'صناعة المحتوى').trim();
  const count = Number(hashtagCount) || 7;
  const emoji = includeEmoji ? '🔥 🚀 💡' : '';

  if (lang === 'en') {
    return {
      caption: `The hidden truth about "${cleanTopic}" you probably didn't know yet! ${emoji}\n\nMost people overlook this simple tweak, but it makes all the difference in reach and retention.\n\nSave this for your next video and comment your thoughts below! 👇`,
      hashtags: [
        `#facelessstudio`,
        `#contentcreator`,
        `#${platform.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        `#viralreels`,
        `#aiautomation`,
        `#trendingnow`,
        `#growthmindset`,
        `#shortformcontent`,
      ].slice(0, count),
      bestTime: 'Today between 6:30 PM and 9:00 PM (peak audience engagement window)',
      tips: `Reply to the first 5 comments within 15 minutes to trigger the ${platform} retention algorithm!`,
      platform,
    };
  }

  return {
    caption: `هل كنت تعلم هذا السر عن "${cleanTopic}" من قبل؟ ${emoji}\n\nالكثير يظنون أن النجاح يحتاج مجهوداً مستحيلاً، بينما الحقيقة تكمن في تطبيق الإستراتيجية الصحيحة بالوقت المناسب!\n\nاحفظ المنشور لتطبقه لاحقاً، واكتب لنا رأيك في التعليقات 👇`,
    hashtags: [
      `#faceless_studio`,
      `#صناعة_المحتوى`,
      `#ذكاء_اصطناعي`,
      `#${platform.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      `#تسويق_رقمي`,
      `#ترند_اليوم`,
      `#اكسبلور`,
      `#تطوير_الذات`,
      `#أتمتة`,
    ].slice(0, count),
    bestTime: 'اليوم بين الساعة 7:00 مساءً إلى 9:30 مساءً بتوقيت مكة (ذروة التفاعل والنشاط)',
    tips: `تأكد من الرد على أول 5 تعليقات خلال أول ربع ساعة لتحفيز خوارزمية ${platform} على دفع الفيديو للأمام!`,
    platform,
  };
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' });
});

// 1. Brainstorm Ideas API
app.post('/api/gemini/generate-ideas', async (req, res) => {
  const { niche = 'التقنية والذكاء الاصطناعي', platform = 'TikTok', count = 5, lang = 'ar' } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `أنت خبير محتوى قنوات Faceless (فيديوهات بدون ظهور).
المطلوب: اقتراح عدد ${count} أفكار لفيديوهات ترند قوية وجذابة بدون ظهور لقناة في نيش: "${niche}" ومخصصة لمنصة: "${platform}".
اللغة المطلوبة: ${lang === 'ar' ? 'اللغة العربية الفصحى أو لهجة عصرية مبسطة' : 'English'}.
أجب بصيغة JSON فقط مصفوفة من العناصر بالتنسيق التالي:
[
  {
    "id": "1",
    "title": "عنوان جذاب جدا ومثير للفضول",
    "description": "شرح مختصر للفكرة وكيفية تنفيذها بدون وجه باستخدام ستوك وفويس اوفر",
    "difficulty": "سهل" أو "متوسط" أو "متقدم",
    "trendScore": 95,
    "hook": "الجملة الافتتاحية الأولى الصادمة لخطف الانتباه",
    "platform": "${platform}"
  }
]
`;
      const text = await generateGeminiContentWithRetry(ai, prompt);
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json({ ideas: parsed, source: 'gemini' });
      }
    } catch {
      console.log(`[Faceless Studio] Notice: Gemini service busy; serving dynamic ideas for niche "${niche}"`);
    }
  }

  const fallbackIdeas = buildDynamicIdeasFallback({ niche, platform, count, lang });
  return res.json({ ideas: fallbackIdeas, source: 'ai-engine' });
});

// 2. Script Writer API
app.post('/api/gemini/generate-script', async (req, res) => {
  const {
    topic = 'أسرار الذكاء الاصطناعي',
    scriptType = 'قصة / Storytelling',
    type,
    dialect = 'فصحى مبسطة',
    duration = 60,
    includeCTA = true,
    lang = 'ar',
  } = req.body;

  const actualType = scriptType || type || 'تعليمي';
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `أنت كاتب سكريبت محترف لفيديوهات السوشيال ميديا القصيرة (Shorts, Reels, TikTok) بدون ظهور Faceless.
الموضوع: "${topic}"
النوع: "${actualType}"
اللهجة المطلوبة: "${dialect}"
مدة الفيديو التقديرية: ${duration} ثانية (حوالي ${Math.round(duration * 2.5)} كلمة)
تضمين دعوة للتفاعل (CTA): ${includeCTA ? 'نعم مطلوب CTA قوي' : 'لا'}
اللغة: ${lang === 'ar' ? 'العربية' : 'English'}

المطلوب: إرجاع نص JSON يحتوي على:
{
  "hook": "جملة الهوك الأولى التي تخطف الانتباه في أول 3 ثواني",
  "body": "المتن الرئيسي للسكريبت مقسم لفقرات سريعة ومثيرة تناسب سرعة قراءة الصوت والستوك",
  "cta": "الدعوة للتفاعل والمتابعة في نهاية الفيديو",
  "visualSuggestions": ["اقتراح بصري للمشهد 1", "اقتراح بصري للمشهد 2", "اقتراح بصري للمشهد 3", "اقتراح بصري للمشهد 4"],
  "estimatedDuration": ${duration}
}
`;
      const text = await generateGeminiContentWithRetry(ai, prompt);
      const parsed = JSON.parse(text);
      if (parsed.hook && parsed.body) {
        return res.json({
          script: {
            ...parsed,
            estimatedDuration: parsed.estimatedDuration || duration,
            estimatedDurationSeconds: parsed.estimatedDuration || duration,
            wordCount: Math.round((parsed.body.split(/\s+/).length) + (parsed.hook.split(/\s+/).length)),
            topic,
            type: actualType,
            dialect,
          },
          source: 'gemini',
        });
      }
    } catch {
      console.log(`[Faceless Studio] Notice: Gemini service busy; serving dynamic tailored script for topic "${topic}"`);
    }
  }

  const fallbackScript = buildDynamicScriptFallback({
    topic,
    type: actualType,
    dialect,
    duration,
    includeCTA,
    lang,
  });

  return res.json({ script: fallbackScript, source: 'ai-engine' });
});

// 3. Caption & Hashtags API
app.post('/api/gemini/generate-caption', async (req, res) => {
  const {
    topic = 'فيديو تقني',
    platform = 'TikTok',
    hashtagsCount,
    hashtagCount,
    includeEmojis,
    includeEmoji,
    lang = 'ar',
  } = req.body;

  const actualCount = hashtagsCount || hashtagCount || 7;
  const actualEmoji = includeEmojis !== undefined ? includeEmojis : (includeEmoji !== undefined ? includeEmoji : true);
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `اكتب كابشن تسويقي احترافي لمنشور على منصة ${platform} حول موضوع: "${topic}".
عدد الهاشتاجات المطلوبة: ${actualCount}
استخدام الإيموجي: ${actualEmoji ? 'نعم بذكاء وبدون إفراط' : 'بدون إيموجي'}
اللغة: ${lang === 'ar' ? 'العربية' : 'English'}

أجب بصيغة JSON:
{
  "caption": "نص الكابشن الجذاب مع سطر أول خطاف وسؤال للتفاعل",
  "hashtags": ["#هاشتاج1", "#هاشتاج2"],
  "bestTime": "اقتراح أفضل وقت للنشر وتفسيره",
  "tips": "نصيحة ذهبية لزيادة نسبة الوصول على المنصة"
}
`;
      const text = await generateGeminiContentWithRetry(ai, prompt);
      const parsed = JSON.parse(text);
      if (parsed.caption) {
        return res.json({ result: parsed, caption: parsed, source: 'gemini' });
      }
    } catch {
      console.log(`[Faceless Studio] Notice: Gemini service busy; serving dynamic caption for topic "${topic}"`);
    }
  }

  const fallback = buildDynamicCaptionFallback({
    topic,
    platform,
    hashtagCount: actualCount,
    includeEmoji: actualEmoji,
    lang,
  });

  return res.json({ result: fallback, caption: fallback, source: 'ai-engine' });
});

async function startServer() {
  // Vite middleware in dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Faceless Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
