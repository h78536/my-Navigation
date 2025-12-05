import React, { useState } from 'react';
import { X, Book, Cloud, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'usage' | 'deploy'>('usage');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><HelpCircle className="text-blue-600" /> 帮助与指南</h2>
          <button onClick={onClose}><X size={24} className="text-slate-400 hover:text-white" /></button>
        </div>
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-900/50">
          <button onClick={() => setActiveTab('usage')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'usage' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500'}`}><Book size={16} /> 功能介绍</button>
          <button onClick={() => setActiveTab('deploy')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'deploy' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500'}`}><Cloud size={16} /> 部署指南</button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar text-slate-700 dark:text-slate-300 leading-relaxed">
          {activeTab === 'usage' ? (
            <div className="space-y-6">
              <section><h3 className="text-lg font-bold">👋 欢迎使用 MyNav</h3><p>这是一个集成了 Gemini AI 的现代化个人导航仪表盘。</p></section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border"><h4 className="font-bold">🤖 AI 助手</h4><p>在搜索框输入问题，点击“询问 AI”即可。</p></div>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border"><h4 className="font-bold">🎨 图片编辑</h4><p>使用 Gemini Nano Banana 模型编辑图片。</p></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p>本项目已包含 GitHub Actions 配置文件，推送代码后会自动部署。</p>
              <p>请确保在 GitHub Settings 中配置了 <code>VITE_API_KEY</code>。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};