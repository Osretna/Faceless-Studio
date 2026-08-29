export type Language = 'ar' | 'en';

export type ViewMode = 
  | 'landing'
  | 'dashboard'
  | 'generator'
  | 'calendar'
  | 'publisher'
  | 'pricing'
  | 'settings'
  | 'help';

export type GeneratorTab = 'brainstorm' | 'script' | 'video' | 'captions';

export type Platform = 'TikTok' | 'Instagram' | 'YouTube' | 'Facebook' | 'Twitter';

export type ProjectStatus = 'ready' | 'processing' | 'published' | 'draft';

export interface IdeaItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'سهل' | 'متوسط' | 'متقدم' | 'Easy' | 'Medium' | 'Advanced';
  trendScore: number;
  hook: string;
  platform: Platform;
  saved?: boolean;
}

export type IdeaCard = IdeaItem;

export interface GeneratedScript {
  id?: string;
  title?: string;
  hook: string;
  body: string;
  cta: string;
  visualSuggestions?: string[];
  estimatedDuration: number;
  estimatedDurationSeconds?: number;
  wordCount?: number;
  topic?: string;
  type?: string;
  dialect?: string;
}

export type ScriptResult = GeneratedScript;

export interface CaptionResult {
  caption: string;
  hashtags: string[];
  bestTimeToPost: string;
  platform: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  dialect?: string;
  accent?: string;
  gender: 'male' | 'female';
  tone: string;
  avatar?: string;
  audioSample?: string;
}

export interface MusicTrack {
  id: string;
  name?: string;
  title?: string;
  genre: string;
  duration: string | number;
  mood: string;
  bpm?: number;
}

export type MusicOption = MusicTrack;

export interface VideoProject {
  id: string;
  title: string;
  topic?: string;
  niche?: string;
  platform: Platform | string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  style?: 'cinematic' | 'minimal' | 'energetic' | 'calm';
  script?: GeneratedScript;
  selectedVoice?: string;
  voiceName?: string;
  selectedMusic?: string;
  status: ProjectStatus;
  createdAt: string;
  thumbnailUrl: string;
  videoUrl?: string;
  durationSeconds: number;
  views?: number;
  scheduledDate?: string;
}

export interface ScheduledPost {
  id: string;
  title: string;
  caption: string;
  hashtags?: string[];
  platform: Platform;
  scheduledDate?: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  thumbnailUrl: string;
  analytics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface SocialAccount {
  id?: string;
  platform: Platform;
  accountName?: string;
  handle?: string;
  username?: string;
  avatarUrl?: string;
  followers?: string;
  connected?: boolean;
  isConnected?: boolean;
  status?: 'Connected' | 'Disconnected' | 'Expired';
  lastSync?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'Free' | 'Pro' | 'Agency';
  primaryNiche: string;
  preferredVoice?: string;
  preferredDialect: string;
  videosCreatedThisMonth: number;
  maxVideosPerMonth: number;
  scheduledPostsCount: number;
  connectedAccounts: SocialAccount[];
}
