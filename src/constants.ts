import { LinkItem, Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'social', name: '社交' },
  { id: 'work', name: '工作' },
  { id: 'dev', name: '开发' },
  { id: 'news', name: '资讯' },
  { id: 'tools', name: '工具' },
];

export const DEFAULT_LINKS: LinkItem[] = [
  {
    id: '1',
    title: 'Google',
    url: 'https://google.com',
    category: 'tools',
    icon: '🔍',
    description: '全球最大的搜索引擎',
    visits: 0,
  },
  {
    id: '2',
    title: 'GitHub',
    url: 'https://github.com',
    category: 'dev',
    icon: '🐙',
    description: '代码托管与协作平台',
    visits: 0,
  },
  {
    id: '3',
    title: 'Bilibili',
    url: 'https://www.bilibili.com',
    category: 'social',
    icon: '📺',
    description: '国内知名的视频弹幕网站',
    visits: 0,
  },
  {
    id: '4',
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    category: 'tools',
    icon: '🤖',
    description: '强大的 AI 助手',
    visits: 0,
  },
];

export const TRANSLATIONS = {
  zh: {
    searchPlaceholder: "搜索链接或询问 Gemini...",
    askAI: "询问 AI",
    thinking: "思考中...",
    geminiHelper: "Gemini 助手",
    clear: "清除",
    all: "全部",
    add: "添加",
    noLinksFound: "未找到匹配链接",
    tryAskAI: "尝试询问 Gemini 或添加新链接。",
    settings: "设置",
    imageEditor: "AI 图片编辑",
    help: "帮助与指南"
  },
  en: {
    searchPlaceholder: "Search links or ask Gemini...",
    askAI: "Ask AI",
    thinking: "Thinking...",
    geminiHelper: "Gemini Assistant",
    clear: "Clear",
    all: "All",
    add: "Add",
    noLinksFound: "No matching links found",
    tryAskAI: "Try asking Gemini or add a new link.",
    settings: "Settings",
    imageEditor: "AI Image Editor",
    help: "Help & Guide"
  }
};