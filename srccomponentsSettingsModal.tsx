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
  
  // General Settings State
  const [bgUrl, setBgUrl] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  // Category Management State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Data Import Ref
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

  // --- Category Handlers ---
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

  // --- Data Handlers ---
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
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <SettingsIcon className="text-cyan-600 dark:text-cyan-400" />
             设置 / Settings
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'general' 
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            常规 / General
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'categories' 
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            分类 / Categories
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'data' 
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            备份 / Backup
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {activeTab === 'general' && (
            <form onSubmit={handleGeneralSubmit} className="space-y-6">
              
              {/* Language Setting */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Globe size={16} className="text-blue-500 dark:text-blue-400" />
                  语言 / Language
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setLanguage('zh')}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      language === 'zh'
                        ? 'bg-slate-100 border-cyan-500 text-cyan-700 dark:bg-slate-800 dark:text-cyan-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>中文</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      language === 'en'
                        ? 'bg-slate-800 border-cyan-500 text-cyan-400 dark:bg-slate-800'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>English</span>
                  </button>
                </div>
              </div>

              {/* Theme Setting */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Sun size={16} className="text-orange-500 dark:text-orange-400" />
                  外观主题 / Theme
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      theme === 'light'
                        ? 'bg-slate-100 border-cyan-500 text-cyan-700 dark:bg-slate-800 dark:text-cyan-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Sun size={18} />
                    <span>浅色 / Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-cyan-500 text-cyan-400 dark:bg-slate-800'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Moon size={18} />
                    <span>深色 / Dark</span>
                  </button>
                </div>
              </div>

              {/* Background Setting */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <ImageIcon size={16} className="text-cyan-600 dark:text-cyan-400" />
                  背景图片链接 / Background URL
                </label>
                <input 
                  type="text" 
                  value={bgUrl}
                  onChange={(e) => setBgUrl(e.target.value)}
                  placeholder="https://example.com/wallpaper.jpg"
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>

              {/* Password Setting */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Lock size={16} className="text-purple-600 dark:text-purple-400" />
                  访问密码 / Password
                </label>
                <input 
                  type="text" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (Empty to disable)"
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>

              <button 
                type="submit"
                className="w-full mt-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} />
                保存 / Save
              </button>
            </form>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <List size={16} className="text-green-600 dark:text-green-400" />
                  现有分类
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 group transition-colors">
                      {editingId === category.id ? (
                        <div className="flex items-center gap-2 w-full">
                          <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                            autoFocus
                          />
                          <button onClick={() => saveEditing(category.id)} className="p-1 text-green-600 dark:text-green-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><Check size={16} /></button>
                          <button onClick={cancelEditing} className="p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><X size={16} /></button>
                        </div>
                      ) : (
                        <>
                          <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">{category.name}</span>
                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={() => startEditing(category)}
                               className="p-1.5 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                               title="重命名"
                             >
                               <Edit2 size={14} />
                             </button>
                             <button 
                               onClick={() => handleDeleteCategory(category.id)}
                               className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                               title="删除"
                             >
                               <Trash2 size={14} />
                             </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <form onSubmit={handleAddCategory} className="space-y-3">
                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">添加新分类</label>
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       value={newCategoryName}
                       onChange={(e) => setNewCategoryName(e.target.value)}
                       placeholder="分类名称 (如: 娱乐)"
                       className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
                     />
                     <button 
                       type="submit"
                       disabled={!newCategoryName.trim()}
                       className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white px-4 rounded-lg font-medium transition-colors flex items-center gap-1"
                     >
                       <Plus size={18} />
                       添加
                     </button>
                   </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <h4 className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300 mb-2">
                  <Database size={18} />
                  关于数据同步
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
                  本站是纯静态应用，所有数据存储在您当前浏览器的本地缓存中，因此不同设备间无法自动同步。
                  <br /><br />
                  <strong>解决方案：</strong> 您可以使用下方的导出/导入功能，将数据文件手动传输到另一台设备上。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-3 shadow-sm text-cyan-600 dark:text-cyan-400">
                    <Download size={24} />
                  </div>
                  <h5 className="font-semibold text-slate-800 dark:text-white mb-1">导出备份</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">保存当前的链接、分类和设置到文件。</p>
                  <button 
                    onClick={handleExport}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    下载 JSON 文件
                  </button>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-3 shadow-sm text-purple-600 dark:text-purple-400">
                    <Upload size={24} />
                  </div>
                  <h5 className="font-semibold text-slate-800 dark:text-white mb-1">导入备份</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">从 JSON 文件恢复数据（会覆盖当前数据）。</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    选择文件导入
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImport} 
                    accept=".json" 
                    className="hidden" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};