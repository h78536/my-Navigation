import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Image as ImageIcon, Lock, List, Plus, Trash2, Edit2, Check, Settings as SettingsIcon, Moon, Sun, Download, Upload, Database, Globe } from 'lucide-react';
import { AppSettings, Category, LinkItem } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  links: LinkItem[];
  onUpdateLinks: (links: LinkItem[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSave,
  categories,
  onUpdateCategories,
  links,
  onUpdateLinks
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'categories' | 'data'>('general');
  const [bgUrl, setBgUrl] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setBgUrl(settings.backgroundImageUrl || '');
      setPassword(settings.password || '');
      setTheme(settings.theme || 'dark');
      setLanguage(settings.language || 'zh');
      setActiveTab('general');
      setEditingId(null);
      setNewCategoryName('');
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      backgroundImageUrl: bgUrl,
      password: password,
      theme: theme,
      language: language
    });
    onClose();
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const newId = Date.now().toString(); 
    onUpdateCategories([...categories, { id: newId, name: newCategoryName.trim() }]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id: string) => {
    if (categories.length <= 1) {
      alert("至少需要保留一个分类。");
      return;
    }
    if (window.confirm("确定要删除此分类吗？该分类下的链接将仅在“全部”中可见。")) {
      onUpdateCategories(categories.filter(c => c.id !== id));
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const saveEditing = (id: string) => {
    if (!editName.trim()) return;
    onUpdateCategories(categories.map(c => c.id === id ? { ...c, name: editName.trim() } : c));
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleExport = () => {
    const data = {
      version: 1,
      date: new Date().toISOString(),
      links,
      categories,
      settings: { ...settings, backgroundImageUrl: bgUrl, password, theme, language }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mynav-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.links && Array.isArray(json.links)) {
          if (window.confirm("这将覆盖当前的链接、分类和设置。确定要继续导入吗？")) {
            onUpdateLinks(json.links);
            if (json.categories) onUpdateCategories(json.categories);
            if (json.settings) onSave(json.settings);
            alert("导入成功！");
            onClose();
          }
        } else {
          alert("无效的备份文件格式。");
        }
      } catch (err) {
        alert("文件解析失败，请确保是有效的 JSON 备份文件。");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative animate-in zoom-in-95 duration-200 transition-colors">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <SettingsIcon className="text-cyan-600 dark:text-cyan-400" />
             设置 / Settings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-900/50">
          <button onClick={() => setActiveTab('general')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'general' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>常规 / General</button>
          <button onClick={() => setActiveTab('categories')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'categories' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>分类 / Categories</button>
          <button onClick={() => setActiveTab('data')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'data' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>备份 / Backup</button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'general' && (
            <form onSubmit={handleGeneralSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><Globe size={16} className="text-blue-500" /> 语言 / Language</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setLanguage('zh')} className={`flex-1 py-3 rounded-xl border transition-all ${language === 'zh' ? 'bg-slate-100 dark:bg-slate-800 border-cyan-500' : 'border-slate-200 dark:border-slate-700'}`}>中文</button>
                  <button type="button" onClick={() => setLanguage('en')} className={`flex-1 py-3 rounded-xl border transition-all ${language === 'en' ? 'bg-slate-100 dark:bg-slate-800 border-cyan-500' : 'border-slate-200 dark:border-slate-700'}`}>English</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><Sun size={16} className="text-orange-500" /> 外观主题 / Theme</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setTheme('light')} className={`flex-1 py-3 rounded-xl border transition-all ${theme === 'light' ? 'bg-slate-100 dark:bg-slate-800 border-cyan-500' : 'border-slate-200 dark:border-slate-700'}`}><Sun size={18} /> 浅色</button>
                  <button type="button" onClick={() => setTheme('dark')} className={`flex-1 py-3 rounded-xl border transition-all ${theme === 'dark' ? 'bg-slate-100 dark:bg-slate-800 border-cyan-500' : 'border-slate-200 dark:border-slate-700'}`}><Moon size={18} /> 深色</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><ImageIcon size={16} className="text-cyan-600" /> 背景图片链接</label>
                <input type="text" value={bgUrl} onChange={(e) => setBgUrl(e.target.value)} placeholder="https://example.com/wallpaper.jpg" className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><Lock size={16} className="text-purple-600" /> 访问密码</label>
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码 (留空则不启用)" className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none" />
              </div>
              <button type="submit" className="w-full mt-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"><Save size={18} /> 保存 / Save</button>
            </form>
          )}
          {activeTab === 'categories' && (
            <div className="space-y-6">
               <div className="space-y-2">{categories.map(c => (<div key={c.id} className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">{editingId === c.id ? (<><input value={editName} onChange={(e)=>setEditName(e.target.value)} className="flex-1 bg-white dark:bg-slate-900 border rounded px-2 py-1"/><button onClick={()=>saveEditing(c.id)}><Check size={16}/></button></>) : (<><span className="text-sm">{c.name}</span><div className="flex gap-1"><button onClick={()=>startEditing(c)}><Edit2 size={14}/></button><button onClick={()=>handleDeleteCategory(c.id)}><Trash2 size={14}/></button></div></>)}</div>))}</div>
               <div className="flex gap-2"><input value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)} placeholder="新分类名称" className="flex-1 bg-slate-100 dark:bg-slate-800 border rounded-lg px-4 py-2"/><button onClick={handleAddCategory} disabled={!newCategoryName.trim()} className="bg-cyan-600 text-white px-4 rounded-lg"><Plus size={18}/></button></div>
            </div>
          )}
          {activeTab === 'data' && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-xl border flex flex-col items-center"><Download size={24} className="mb-2"/><button onClick={handleExport} className="w-full bg-cyan-600 text-white py-2 rounded-lg text-sm">下载备份</button></div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-xl border flex flex-col items-center"><Upload size={24} className="mb-2"/><button onClick={()=>fileInputRef.current?.click()} className="w-full bg-slate-200 dark:bg-slate-700 py-2 rounded-lg text-sm">导入备份</button><input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden"/></div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};