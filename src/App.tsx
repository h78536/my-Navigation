import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Sparkles, Command, Settings as SettingsIcon, Wand2, HelpCircle } from 'lucide-react';
import { LinkItem, Category, AppSettings } from './types';
import { DEFAULT_CATEGORIES, DEFAULT_LINKS, TRANSLATIONS } from './constants';
import { LinkCard } from './components/LinkCard';
import { AddLinkModal } from './components/AddLinkModal';
import { SettingsModal } from './components/SettingsModal';
import { ImageEditorModal } from './components/ImageEditorModal';
import { HelpModal } from './components/HelpModal';
import { LockScreen } from './components/LockScreen';
import { askGemini } from './services/geminiService';

export default function App() {
  // --- State ---
  const [links, setLinks] = useState<LinkItem[]>(() => {
    const saved = localStorage.getItem('mynav_links');
    return saved ? JSON.parse(saved) : DEFAULT_LINKS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('mynav_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('mynav_settings');
    // Default language to zh
    return saved ? JSON.parse(saved) : { theme: 'dark', language: 'zh' };
  });

  // Lock state defaults to true if a password is set
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const savedSettings = localStorage.getItem('mynav_settings');
    const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {};
    return !!parsedSettings.password;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // AI State
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // --- Helpers ---
  // Get current language strings
  const t = TRANSLATIONS[settings.language === 'en' ? 'en' : 'zh'];

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('mynav_links', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem('mynav_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('mynav_settings', JSON.stringify(settings));
    if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [settings]);

  // --- Handlers ---
  const handleAddLink = (newLink: Omit<LinkItem, 'id' | 'visits'>) => {
    const id = Date.now().toString();
    setLinks(prev => [...prev, { ...newLink, id, visits: 0 }]);
  };

  const handleDeleteLink = (id: string) => {
    if (window.confirm('确定要删除此链接吗？')) {
      setLinks(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleVisitLink = (id: string) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, visits: l.visits + 1 } : l));
  };

  const handleAiQuery = async () => {
    if (!searchQuery.trim()) return;
    setIsThinking(true);
    setAiResponse(null);
    const response = await askGemini(searchQuery);
    setAiResponse(response);
    setIsThinking(false);
  };

  const handleUnlock = (password: string) => {
    if (password === settings.password) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  // --- Filtering ---
  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const matchesCategory = activeCategory === 'all' || link.category === activeCategory;
      const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            link.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [links, activeCategory, searchQuery]);

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // --- Styles ---
  // Apply custom background if set
  const bgStyle = settings.backgroundImageUrl 
    ? { 
        backgroundImage: `url(${settings.backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } 
    : {};

  // --- Render ---
  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div 
      className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 selection:bg-cyan-500/30 pb-20 transition-colors duration-500"
      style={bgStyle}
    >
      {/* Default Background Gradient (if no image) */}
      {!settings.backgroundImageUrl ? (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-[#1e293b] dark:to-[#0f172a] dark:bg-[radial-gradient(ellipse_at_top,#1e293b,#0f172a)] transition-colors duration-500" />
      ) : null}
      
      {/* Header Controls */}
      <div className="absolute top-4 right-4 md:top-6 md:right-8 z-20 flex gap-3">
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-all bg-white/50 dark:bg-black/20 backdrop-blur-sm"
          title={t.help}
        >
          <HelpCircle size={20} />
        </button>
        <button 
          onClick={() => setIsImageEditorOpen(true)}
          className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-all bg-white/50 dark:bg-black/20 backdrop-blur-sm"
          title={t.imageEditor}
        >
          <Wand2 size={20} />
        </button>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-all bg-white/50 dark:bg-black/20 backdrop-blur-sm"
          title={t.settings}
        >
          <SettingsIcon size={20} />
        </button>
      </div>

      {/* Hero Section */}
      <div className="pt-20 pb-8 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-400 dark:to-blue-600 tracking-tight font-[Inter]">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300/80 text-lg md:text-xl font-light tracking-wide">
            {time.toLocaleDateString(settings.language === 'en' ? 'en-US' : 'zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl relative group z-10">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative flex items-center bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-xl dark:shadow-2xl transition-colors duration-300">
            <div className="pl-5 text-slate-400 dark:text-slate-500">
              <Search size={22} />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                   if (filteredLinks.length === 0 && searchQuery) {
                      handleAiQuery();
                   }
                }
              }}
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent text-lg px-4 py-5 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors"
            />
            {searchQuery && filteredLinks.length === 0 && (
              <button 
                onClick={handleAiQuery}
                disabled={isThinking}
                className="mr-3 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
              >
                 {isThinking ? (
                   <span className="animate-pulse">{t.thinking}</span>
                 ) : (
                   <>
                     <Sparkles size={16} />
                     <span>{t.askAI}</span>
                   </>
                 )}
              </button>
            )}
          </div>
        </div>

        {/* AI Response Area */}
        {aiResponse && (
          <div className="mt-8 w-full max-w-2xl bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 text-left shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold">
                <Sparkles size={18} />
                <span>{t.geminiHelper}</span>
              </div>
              <button 
                onClick={() => setAiResponse(null)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-white/5"
              >
                {t.clear}
              </button>
            </div>
            <div className="prose prose-slate dark:prose-invert prose-sm max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-200">{aiResponse}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === 'all' 
                ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-lg scale-105' 
                : 'bg-slate-200/60 text-slate-600 hover:bg-slate-300/80 hover:text-slate-900 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-white backdrop-blur-sm'
            }`}
          >
            {t.all}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id 
                  ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-lg scale-105' 
                  : 'bg-slate-200/60 text-slate-600 hover:bg-slate-300/80 hover:text-slate-900 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-white backdrop-blur-sm'
              }`}
            >
              {cat.name}
            </button>
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 rounded-full bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:hover:bg-cyan-500/20 dark:border-cyan-500/30 flex items-center gap-1.5 text-sm font-medium transition-all ml-2"
          >
            <Plus size={16} />
            <span>{t.add}</span>
          </button>
        </div>

        {/* Grid Content */}
        {filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-10">
            {filteredLinks.map(link => (
              <LinkCard 
                key={link.id} 
                link={link} 
                onDelete={handleDeleteLink}
                onVisit={handleVisitLink}
              />
            ))}
          </div>
        ) : (
          !aiResponse && (
            <div className="text-center py-24 text-slate-500 flex flex-col items-center animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 ring-1 ring-slate-300 dark:ring-slate-700 transition-colors">
                <Command size={36} className="opacity-40 text-slate-600 dark:text-slate-400" />
              </div>
              <p className="text-xl font-medium text-slate-600 dark:text-slate-400">{t.noLinksFound} "{searchQuery}"</p>
              <p className="text-sm mt-2 text-slate-500">{t.tryAskAI}</p>
            </div>
          )
        )}
      </div>

      <AddLinkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddLink}
        categories={categories}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
        categories={categories}
        onUpdateCategories={setCategories}
        links={links}
        onUpdateLinks={setLinks}
      />

      <ImageEditorModal 
        isOpen={isImageEditorOpen}
        onClose={() => setIsImageEditorOpen(false)}
      />

      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}