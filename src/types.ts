export type CategoryKey = 'all' | 'scholars' | 'managers' | 'figures' | 'special';

export interface Episode {
  id: string;
  number: string;
  title: string;
  guest: string;
  guestRole: string;
  guestAvatar: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  description: string;
  topics: string[];
  quote: string;
  publishedAt: string;
  category: CategoryKey;
  viewsCount: number;
  featured?: boolean;
  takeaways?: string[];
  relatedClipIds?: string[];
}

export interface Guest {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  fieldOfExpertise: string;
  quote: string;
  episodesCount: number;
  episodeIds: string[];
  keyMoment: string;
}

export interface Clip {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  guest: string;
  guestRole: string;
  duration: string;
  episodeId: string;
  views: string;
  highlightCategory: string;
}

export interface QuoteItem {
  id: string;
  text: string;
  guestName: string;
  guestRole: string;
  guestImage: string;
  episodeId: string;
  episodeNumber: string;
}

export interface InteractiveOption {
  id: string;
  title: string;
  iconName: string;
  description: string;
  insight: string;
  recommendedEpisodeIds: string[];
}

export interface SiteSettings {
  eitaaUrl: string;
  eitaaChannelUrl: string;
  aparatUrl?: string;
  youtubeUrl?: string;
  baleUrl?: string;
  telegramUrl?: string;
  contactEmail?: string;
  showTitle: string;
  showSubtitle: string;
}

export type PageRoute = 
  | { path: '/' }
  | { path: '/episodes' }
  | { path: '/episodes/:id'; id: string }
  | { path: '/guests' }
  | { path: '/guests/:id'; id: string }
  | { path: '/clips' }
  | { path: '/about' }
  | { path: '/admin' };
