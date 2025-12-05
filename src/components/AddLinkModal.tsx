import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Category, LinkItem } from '../types';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (link: Omit<LinkItem, 'id' | 'visits'>) => void;
  categories: Category[];
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, onAdd, categories }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'tools');
  const [icon, setIcon] = useState('🔗');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(''); setUrl(''); setCategory(categories[0]?.id || 'tools'); setIcon('🔗'); setDescription('');
    }
  }, [isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) formattedUrl = 'https://' + url;
    onAdd({ title, url: formattedUrl, category, icon, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 transition-colors">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">添加新导航</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">标题</label><input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：GitHub" className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">链接</label><input type="text" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="github.com" className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">分类</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 outline-none appearance-none">{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">图标</label><input type="text" maxLength={2} value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🔗" className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-center outline-none" /></div>
          </div>
          <button type="submit" className="w-full mt-6 bg-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg">添加</button>
        </form>
      </div>
    </div>
  );
};