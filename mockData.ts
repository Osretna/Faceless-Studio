import { 
  VideoProject, 
  ScheduledPost, 
  SocialAccount, 
  UserProfile, 
  VoiceOption, 
  MusicTrack, 
  IdeaItem, 
  GeneratedScript, 
  CaptionResult 
} from './types';

export const INITIAL_SOCIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'acc-tiktok',
    platform: 'TikTok',
    accountName: 'TechVibes Arabia',
    handle: '@techvibes_ar',
    username: '@techvibes_ar',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    followers: '248.5K',
    connected: true,
    isConnected: true,
    status: 'Connected',
    lastSync: 'قبل 12 دقيقة',
  },
  {
    id: 'acc-insta',
    platform: 'Instagram',
    accountName: 'TechVibes Reels',
    handle: '@techvibes_reels',
    username: '@techvibes_reels',
    avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=80',
    followers: '96.2K',
    connected: true,
    isConnected: true,
    status: 'Connected',
    lastSync: 'قبل 45 دقيقة',
  },
  {
    id: 'acc-yt',
    platform: 'YouTube',
    accountName: 'TechVibes Shorts',
    handle: '@techvibes_shorts',
    username: '@techvibes_shorts',
    avatarUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&auto=format&fit=crop&q=80',
    followers: '182.0K',
    connected: true,
    isConnected: true,
    status: 'Connected',
    lastSync: 'قبل ساعتين',
  },
  {
    id: 'acc-fb',
    platform: 'Facebook',
    accountName: 'TechVibes Page',
    handle: 'TechVibesOfficial',
    username: '@TechVibesOfficial',
    avatarUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&auto=format&fit=crop&q=80',
    followers: '45.1K',
    connected: false,
    isConnected: false,
    status: 'Disconnected',
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'سامي المحمدي',
  email: 'sami.creator@faceless.io',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'Pro',
  primaryNiche: 'الذكاء الاصطناعي والتقنية',
  preferredVoice: 'آدم (فصحى وثائقية فخمة)',
  preferredDialect: 'عربية فصحى معاصرة',
  videosCreatedThisMonth: 18,
  maxVideosPerMonth: 30,
  scheduledPostsCount: 8,
  connectedAccounts: INITIAL_SOCIAL_ACCOUNTS,
};

export const INITIAL_VOICES: VoiceOption[] = [
  {
    id: 'voice-adam',
    name: 'آدم (فصحى وثائقية فخمة)',
    dialect: 'فصحى فخمة',
    accent: 'فصحى معاصرة',
    gender: 'male',
    tone: 'عميق، سينمائي، موثوق',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'voice-sarah',
    name: 'سارة (حماسية للريلز والتيك توك)',
    dialect: 'عصرية سريعة',
    accent: 'ريلز شبابية',
    gender: 'female',
    tone: 'طاقة عالية، تفاعلية، شابة',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'voice-tariq',
    name: 'طارق (خليجي إعلاني مقنع)',
    dialect: 'لهجة خليجية بيضاء',
    accent: 'خليجي معاصر',
    gender: 'male',
    tone: 'دافئ، تسويقي، مقنع',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'voice-layla',
    name: 'ليلى (راوية قصص غامضة)',
    dialect: 'فصحى شعرية هادئة',
    accent: 'قصص وروايات',
    gender: 'female',
    tone: 'غامض، حكواتي، تأملي',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'voice-omar',
    name: 'عمر (مصري عفوي وبودكاست)',
    dialect: 'لهجة مصرية بيضاء',
    accent: 'مصري خفيف',
    gender: 'male',
    tone: 'عفوي، محبب، سريع الفهم',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'voice-alex',
    name: 'Alex (US Silicon Valley Tech)',
    dialect: 'English (US)',
    accent: 'American Crisp',
    gender: 'male',
    tone: 'Crisp, articulate, professional',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
  }
];

export const MOCK_VOICES = INITIAL_VOICES;

export const INITIAL_MUSIC: MusicTrack[] = [
  {
    id: 'music-1',
    name: 'Cyberpunk Drift',
    title: 'Cyberpunk Drift',
    genre: 'Synthwave / Tech',
    duration: 35,
    mood: 'حماسي وتقني',
    bpm: 128,
  },
  {
    id: 'music-2',
    name: 'Midnight Lo-Fi Chill',
    title: 'Midnight Lo-Fi Chill',
    genre: 'Lo-Fi Study',
    duration: 45,
    mood: 'هادئ ومريح للتركيز',
    bpm: 85,
  },
  {
    id: 'music-3',
    name: 'Epic Cinematic Rise',
    title: 'Epic Cinematic Rise',
    genre: 'Orchestral',
    duration: 38,
    mood: 'تشويق وثائقي عظيم',
    bpm: 110,
  },
  {
    id: 'music-4',
    name: 'Inspiring Deep Ambient',
    title: 'Inspiring Deep Ambient',
    genre: 'Atmospheric',
    duration: 40,
    mood: 'فلسفي وتأملي',
    bpm: 90,
  },
];

export const MOCK_MUSIC = INITIAL_MUSIC;

export const STOCK_VIDEOS_PREVIEW = [
  {
    id: 'stock-1',
    title: 'تكنولوجيا وشاشات مستقبلية 4K',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'stock-2',
    title: 'مدينة نيويورك ليلية وسينمائية',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'stock-3',
    title: 'ساعات وثروة وتداول واستثمار',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'stock-4',
    title: 'مجرات وفضاء عميق مذهل',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_IDEAS: IdeaItem[] = [
  {
    id: 'idea-1',
    title: '5 أدوات ذكاء اصطناعي سرية لإنشاء فيديوهات فيسلس في 2026',
    description: 'استعراض سريع لأهم التقنيات التي تحول فكرتك إلى فيديو 4K كامل خلال ثوانٍ معدودة دون الحاجة لمهارات تقنية معقدة.',
    difficulty: 'سهل',
    trendScore: 98,
    hook: 'توقف عن إضاعة وقتك في برامج المونتاج التقليدية! هذا هو سر قنوات المليون متابع.',
    platform: 'TikTok',
  },
  {
    id: 'idea-2',
    title: 'كيف استطاع طالب جامعي جني $10,000 شهرياً من قناة كارتون بدون رسم؟',
    description: 'دراسة حالة مشوقة تلهم المشاهدين وتوضح قوة استغلال القصص الدرامية القصيرة ونماذج التحريك الآلي.',
    difficulty: 'متوسط',
    trendScore: 94,
    hook: 'هذا الحساب ينشر مقطعين يومياً، ويحقق أرباحاً تفوق مدراء الشركات الكبرى!',
    platform: 'YouTube',
  },
  {
    id: 'idea-3',
    title: 'أغرب 3 تجارب علمية سرية تم حظرها دولياً',
    description: 'سرد وثائقي مشوق بأسلوب الغموض والتشويق العالي، مصحوب بلقطات أرشيفية نادرة تجبر المشاهد على المشاهدة للنهاية.',
    difficulty: 'سهل',
    trendScore: 91,
    hook: 'في عام 1974، حاولت مجموعة علماء تغيير جينات النوم... وما حدث صدم العالم!',
    platform: 'Instagram',
  }
];

export const SAMPLE_SCRIPTS: GeneratedScript[] = [
  {
    title: '5 أدوات ذكاء اصطناعي سرية لإنشاء قنوات يوتيوب بدون ظهور',
    hook: 'توقف عن تضييع ساعات في المونتاج! هذا هو السر الخفي لأنجح قنوات الفيسلس اليوم.',
    body: `أولاً: أداة توليد الأفكار الفيروسية بنقرة واحدة.\nثانياً: محركات الذكاء الاصطناعي التي تكتب سكريبتات بهوك عالي الاحتفاظ.\nثالثاً: الأصوات العصبية الواقعية التي تخدع أي خوارزمية.\nرابعاً: الترجمة الحركية ذات التباين اللوني الجذاب.\nخامساً: منصات النشر التلقائي التي تجعل قناتك تعمل وأنت نائم.`,
    cta: 'احفظ الفيديو لتطبقه الليلة واكتب "قناة" في التعليقات لأرسل لك الروابط!',
    visualSuggestions: [
      '00:00 - لقطة شاشة سوداء مع صوت عد تنازلي وتأثير ضوضاء سينمائي',
      '00:08 - واجهات برمجية متحركة وشاشات تداول وتوليد سريع 4K',
      '00:25 - مؤشرات نمو بيانية باللون الأخضر الصاعد'
    ],
    estimatedDuration: 45,
  }
];

export const SAMPLE_CAPTIONS: CaptionResult[] = [
  {
    caption: `🔥 توقف عن إضاعة الساعات في المونتاج وتصوير نفسك بالكاميرا!\n\nهذه الاستراتيجية الخفية جعلت مئات الشباب يؤسسون قنوات يوتيوب وتيك توك تحقق آلاف الدولارات شهرياً فقط بالذكاء الاصطناعي وبدون أي ظهور وجه 🚀✨\n\n👇 طبق الخطوات الموجودة بالفيديو اليوم وأخبرنا بنيشك المفضل في التعليقات!`,
    hashtags: ['#ذكاء_اصطناعي', '#فيسلس_ستوديو', '#ريلز_ترند', '#صناعة_المحتوى', '#أتمتة_المحتوى', '#يوتيوب_شورتس', '#تيك_توك', '#بيزنس_أونلاين'],
    bestTimeToPost: '08:30 م (اليوم)',
    platform: 'TikTok'
  }
];

export const PRICING_PLANS = [
  {
    id: 'Free',
    name: 'Starter (المبتدئ)',
    descriptionAr: 'لتجربة إمكانيات المنصة وإنشاء أول قناة تجريبية مجاناً',
    descriptionEn: 'Test platform automation & create your initial prototype channel',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      '3 فيديوهات شهرياً بدقة 720p',
      'صوت AI أساسي واحد',
      'ربط منصة واحدة (TikTok أو YouTube)',
      'توليد أفكار وسكريبتات أساسية',
      'علامة مائية خفيفة'
    ]
  },
  {
    id: 'Pro',
    name: 'Pro Creator (المحترف)',
    descriptionAr: 'الخطة الأكثر اختياراً لصناع المحتوى الطامحين لتحقيق دخل شهري مستمر',
    descriptionEn: 'The golden choice for creators scaling high-CPM viral faceless channels',
    priceMonthly: 19,
    priceYearly: 15,
    popular: true,
    features: [
      '30 فيديو شهرياً بدقة 1080p FHD و4K',
      'جميع أصوات الذكاء الاصطناعي (10 أصوات)',
      'بدون أي علامة مائية نهائياً',
      'جدولة ونشر تلقائي على 3 منصات',
      'مكتبة ستوك 4K وموسيقى تصويرية مجانية',
      'ترجمة حركية بألوان Alex Hormozi',
      'أولوية رندرة وتوليد فوري'
    ]
  },
  {
    id: 'Agency',
    name: 'Agency & Scale (الوكالات)',
    descriptionAr: 'لأصحاب القنوات المتعددة ووكالات التسويق وإدارة المحتوى',
    descriptionEn: 'For multi-channel networks and performance marketing agencies',
    priceMonthly: 49,
    priceYearly: 39,
    features: [
      'فيديوهات غير محدودة (Unlimited)',
      'جميع المنصات بلا استثناء',
      'دعم دقة 4K فائقة 60fps',
      'نشر تلقائي متعدد الحسابات (Multi-Account)',
      'إتاحة واجهة برمجة التطبيقات (API Access)',
      'دعم فني مخصص VIP على مدار الساعة',
      'إمكانية إضافة 5 أعضاء فريق'
    ]
  }
];

export const INITIAL_PROJECTS: VideoProject[] = [
  {
    id: 'proj-1',
    title: '5 وظائف ستختفي تماماً بسبب الذكاء الاصطناعي في 2026',
    topic: 'وظائف الذكاء الاصطناعي',
    niche: 'تكنولوجيا وذكاء اصطناعي',
    platform: 'TikTok',
    aspectRatio: '9:16',
    style: 'energetic',
    script: {
      hook: 'لو فاكر إن وظيفتك بأمان لأنك مش مبرمج، استنى لما تسمع الرقم 3!',
      body: 'الشركات الكبرى بدأت تعتمد على خوارزميات أتمتة كاملة في خدمة العملاء، تدقيق الحسابات، وصناعة المحتوى الترويجي السريع. التغيير مش قادم في المستقبل.. هو بيحصل دلوقتي حالا!',
      cta: 'اعمل حفظ للفيديو وشوف البدائل اللي لازم تتعلمها في الرابط بالبايو.',
      estimatedDuration: 45,
    },
    selectedVoice: 'voice-sarah',
    voiceName: 'سارة (حماسية)',
    selectedMusic: 'music-1',
    status: 'ready',
    createdAt: '2026-08-28',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    durationSeconds: 42,
    views: 45200,
    scheduledDate: '2026-08-30 19:30',
  },
  {
    id: 'proj-2',
    title: 'سر قاعدة الـ 20 دقيقة التي ضاعفت ثروات رواد الأعمال',
    topic: 'ريادة الأعمال',
    niche: 'ريادة أعمال وتطوير ذات',
    platform: 'Instagram',
    aspectRatio: '9:16',
    style: 'cinematic',
    script: {
      hook: 'وارن بافيت وإيلون ماسك بيطبقوا القاعدة دي كل صباح بدون استثناء.',
      body: 'بدل ما تبدأ يومك بالرد على الإيميلات والإشعارات المشتتة، خصص أول 20 دقيقة لمهمة واحدة فقط تحرك إبرة مشروعك بنسبة 80% وفق مبدأ باريتو.',
      cta: 'شارك الفيديو مع صديق يحتاج يركز في أهدافه هذا الأسبوع.',
      estimatedDuration: 55,
    },
    selectedVoice: 'voice-adam',
    voiceName: 'آدم (فخمة)',
    selectedMusic: 'music-3',
    status: 'published',
    createdAt: '2026-08-26',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&auto=format&fit=crop&q=80',
    durationSeconds: 52,
    views: 128400,
  },
  {
    id: 'proj-3',
    title: 'ماذا سيحدث لو توقفت الأرض عن الدوران لثانية واحدة؟',
    topic: 'حقائق علمية وفضاء',
    niche: 'حقائق وفضاء غامض',
    platform: 'YouTube',
    aspectRatio: '16:9',
    style: 'calm',
    script: {
      hook: 'في جزء من الثانية، كل شيء على سطح الكوكب سيطير بسرعة 1600 كم/ساعة!',
      body: 'الرياح العاتية ستقتلع ناطحات السحاب والمحيطات ستتحول إلى تسونامي عملاق يغمر القارات. إليكم المحاكاة الفيزيائية الدقيقة.',
      cta: 'اشترك في القناة لاكتشاف أسرار الكون الغامضة كل يوم.',
      estimatedDuration: 60,
    },
    selectedVoice: 'voice-layla',
    voiceName: 'ليلى (وثائقية)',
    selectedMusic: 'music-4',
    status: 'processing',
    createdAt: '2026-08-29',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80',
    durationSeconds: 58,
  }
];

export const INITIAL_SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: 'post-1',
    title: '5 وظائف ستختفي بالذكاء الاصطناعي في 2026',
    caption: 'التغيير قادم أسرع مما تتخيل! هل وظيفتك في القائمة؟ شاركنا رأيك في التعليقات 👇🔥',
    hashtags: ['#ذكاء_اصطناعي', '#مستقبل_العمل', '#تكنولوجيا', '#فيسلس_ستوديو', '#ترند'],
    platform: 'TikTok',
    scheduledDate: '2026-09-01',
    scheduledTime: '20:30',
    status: 'scheduled',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    analytics: {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0
    }
  },
  {
    id: 'post-2',
    title: 'سر قاعدة الـ 20 دقيقة التي ضاعفت ثروات رواد الأعمال',
    caption: 'طريقة بسيطة جداً لكنها تفرق بين من ينجز أهدافه ومن يظل مكانه. احفظ الفيديو لتجربته غداً صباحاً 🚀💡',
    hashtags: ['#ريادة_أعمال', '#إنتاجية', '#نجاح', '#بيزنس', '#عادات'],
    platform: 'Instagram',
    scheduledDate: '2026-09-02',
    scheduledTime: '19:00',
    status: 'published',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80',
    analytics: {
      views: 128400,
      likes: 14200,
      shares: 3820,
      comments: 642
    }
  },
  {
    id: 'post-3',
    title: 'أغرب 3 حقائق عن المحيطات لم تسمع بها من قبل',
    caption: 'أعماق البحار تخفي أسراراً أكثر غموضاً من الفضاء الخارجي! شاهد للنهاية 🌊👁️',
    hashtags: ['#حقائق', '#غرائب', '#فيديوهات_قصيرة', '#shorts', '#explore'],
    platform: 'YouTube',
    scheduledDate: '2026-09-04',
    scheduledTime: '18:15',
    status: 'scheduled',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80',
    analytics: {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0
    }
  }
];

export const FAQS = [
  {
    qAr: 'ما هي قناة الـ Faceless وكيف أربح منها بدون ظهور؟',
    qEn: 'What is a Faceless channel and how can I monetize without appearing on camera?',
    aAr: 'قناة Faceless هي قناة تنشر محتوى احترافي وجذاب يعتمد على مقاطع الفيديو الأرشيفية (Stock Footage)، الصوت التوليدي الذكي (AI Voice)، والترجمة الحركية. يمكنك الربح منها عبر إعلانات يوتيوب وتيك توك، التسويق بالعمولة (Affiliate)، والرعايات الإعلانية.',
    aEn: 'A faceless channel creates engaging, high-retention content using stock footage, AI voice narration, and dynamic subtitles. You can monetize through creator ad rewards, affiliate marketing, sponsorships, and digital product sales.',
  },
  {
    qAr: 'هل الفيديوهات مقبولة لتحقيق الدخل (Monetization) على يوتيوب وتيك توك؟',
    qEn: 'Are AI faceless videos eligible for YouTube & TikTok monetization?',
    aAr: 'نعم 100%! منصة Faceless Studio تنشئ سكريبتات فريدة تماماً وتدمج مقاطع مرئية خالية من حقوق الملكية وموسيقى مرخصة وأصوات بشرية عالية النقاء مطابقة لسياسات المحتوى الأصلي.',
    aEn: 'Yes 100%! Faceless Studio generates completely unique scripts, licenses royalty-free stock footage, and uses human-quality neural voiceover that strictly complies with fair use and original content guidelines.',
  },
  {
    qAr: 'كم من الوقت أحتاجه لإنشاء وجدولة فيديو كامل؟',
    qEn: 'How long does it take to generate and schedule a video?',
    aAr: 'أقل من 3 إلى 5 دقائق فقط! من توليد الفكرة وكتابة السكريبت، وحتى تركيب الصوت والمؤثرات البصرية والجدولة على حساباتك بضغطة زر.',
    aEn: 'Under 3 to 5 minutes! From brainstorming viral hooks and scripts to assembling video, syncing captions, and multi-platform scheduling.',
  },
  {
    qAr: 'هل تدعم المنصة اللغة العربية واللهجات المحلية؟',
    qEn: 'Does the platform support Arabic and regional dialects?',
    aAr: 'نعم، تم تدريب نماذجنا خصيصاً على العربية الفصحى واللهجات الخليجية، المصرية، والشامية، مع ضبط تلقائي للتشكيل ومخارج الحروف ونبرة الصوت.',
    aEn: 'Yes! Our custom models support Modern Standard Arabic, Egyptian, Gulf, and Levant dialects alongside English with natural emotional pacing.',
  }
];
