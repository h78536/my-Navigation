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
    return saved ? JSON.parse(saved) : { theme: 'dark', language: 'zh' };
  });

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
  
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const t = TRANSLATIONS[settings.language === 'en' ? 'en' : 'zh'];

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

  const bgStyle = settings.backgroundImageUrl 
    ? { 
        backgroundImage: `url(${settings.backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } 
    : {};

  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div 
      className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 selection:bg-cyan-500/30 pb-20 transition-colors duration-500"
      style={bgStyle}
    >
      {!settings.backgroundImageUrl ? (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-[#1e293b] dark:to-[#0f172a] dark:bg-[radial-gradient(ellipse_at_top,#1e293b,#0f172a)] transition-colors duration-500" />
      ) : null}
      
      <div className="absolute top-4 right-4 md:top-6 md:right-8 z-20 flex gap-3">
        <button onClick={() => setIsHelpOpen(true)} className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm" title={t.help}><HelpCircle size={20} /></button>
        <button onClick={() => setIsImageEditorOpen(true)} className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm" title={t.imageEditor}><Wand2 size={20} /></button>
        <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm" title={t.settings}><SettingsIcon size={20} /></button>
      </div>

      <div className="pt-20 pb-8 px-4 flex flex-col items-center text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-400 dark:to-blue-600 drop-shadow-sm">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h1>
          <p className="mt-3 text-lg drop-shadow-sm">{time.toLocaleDateString()}</p>
        </div>
        <div className="w-full max-w-2xl relative flex items-center bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="pl-5 text-slate-400"><Search size={22} /></div>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && filteredLinks.length === 0 && handleAiQuery()} placeholder={t.searchPlaceholder} className="w-full bg-transparent text-lg px-4 py-5 outline-none" />
          {searchQuery && filteredLinks.length === 0 && <button onClick={handleAiQuery} disabled={isThinking} className="mr-3 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg flex items-center gap-2">{isThinking ? t.thinking : <><Sparkles size={16} />{t.askAI}</>}</button>}
        </div>
        {aiResponse && <div className="w-full max-w-2xl bg-white/90 dark:bg-slate-800/80 border rounded-2xl p-6 text-left shadow-2xl backdrop-blur-md"><div className="flex justify-between mb-3"><span className="font-bold text-purple-500">{t.geminiHelper}</span><button onClick={() => setAiResponse(null)} className="text-xs hover:underline">{t.clear}</button></div><p className="whitespace-pre-wrap">{aiResponse}</p></div>}
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button onClick={() => setActiveCategory('all')} className={`px-5 py-2 rounded-full transition-all ${activeCategory === 'all' ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-200/60 dark:bg-slate-800/40'}`}>{t.all}</button>
          {categories.map(cat => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2 rounded-full transition-all ${activeCategory === cat.id ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-200/60 dark:bg-slate-800/40'}`}>{cat.name}</button>)}
          <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 rounded-full bg-cyan-100 text-cyan-700 flex items-center gap-1"><Plus size={16} />{t.add}</button>
        </div>
        {filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">{filteredLinks.map(link => <LinkCard key={link.id} link={link} onDelete={(id) => window.confirm('删除？') && setLinks(prev => prev.filter(l => l.id !== id))} onVisit={(id) => setLinks(prev => prev.map(l => l.id === id ? { ...l, visits: l.visits + 1 } : l))} />)}</div>
        ) : !aiResponse && <div className="text-center py-24 text-slate-500"><Command size={36} className="mx-auto mb-4 opacity-50" /><p>{t.noLinksFound}</p></div>}
      </div>

      <AddLinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddLink} categories={categories} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onSave={setSettings} categories={categories} onUpdateCategories={setCategories} links={links} onUpdateLinks={setLinks} />
      <ImageEditorModal isOpen={isImageEditorOpen} onClose={() => setIsImageEditorOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}