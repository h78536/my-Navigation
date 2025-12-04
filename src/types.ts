export interface LinkItem {
  id: string;
  title: string;
  url: string;
  category: string;
  icon?: string;
  description?: string;
  visits: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface SearchResult {
  type: 'link' | 'ai';
  content: LinkItem | string;
}

export interface AppSettings {
  password?: string;
  backgroundImageUrl?: string;
  theme?: 'dark' | 'light';
  language?: 'zh' | 'en';
}