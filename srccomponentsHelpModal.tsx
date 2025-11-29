import React, { useState } from 'react';
import { X, Book, Cloud, Github, CircleHelp, AlertTriangle, PlayCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'usage' | 'deploy'>('usage');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative animate-in zoom-in-95 duration-200 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <CircleHelp className="text-blue-600 dark:text-blue-400" />
             帮助与指南
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
            onClick={() => setActiveTab('usage')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'usage' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Book size={16} />
            功能介绍
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'deploy' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Cloud size={16} />
            GitHub 部署指南
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-slate-700 dark:text-slate-300 leading-relaxed">
          {activeTab === 'usage' ? (
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">👋 欢迎使用 MyNav</h3>
                <p>这是一个集成了 Gemini AI 的现代化个人导航仪表盘。您的所有数据（链接、分类、设置）都安全地存储在本地浏览器中 (Local Storage)。</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">🤖 AI 助手</h4>
                  <p className="text-sm">在搜索框输入问题（如“如何做番茄炒蛋”），如果没有匹配的本地链接，点击“询问 AI”即可获得 Gemini 的回答。</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">🎨 图片编辑</h4>
                  <p className="text-sm">点击右上角的魔术棒图标，上传图片并输入指令（如“变成素描风格”），AI 会为您处理图片。</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">🔒 隐私保护</h4>
                  <p className="text-sm">在设置中可以配置“访问密码”，保护您的导航页不被他人随意查看。</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">🔗 快捷管理</h4>
                  <p className="text-sm">您可以随意添加、删除链接或自定义分类。右键点击链接卡片可进行更多操作。</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-300 flex gap-2">
                  <Github size={20} className="shrink-0" />
                  本项目已包含自动化部署配置文件 (<code>.github/workflows/deploy.yml</code>)，您可以轻松将其免费部署到 GitHub Pages。
                </p>
              </div>

              <section className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">上传代码到 GitHub</h4>
                    <p className="text-sm mt-1">将您的项目代码提交并推送到 GitHub 仓库的 <code>main</code> 分支。</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">配置 API Key (重要)</h4>
                    <p className="text-sm mt-1 mb-2">为了让 AI 功能在部署后可用，您需要配置密钥：</p>
                    <ul className="list-disc list-inside text-sm space-y-1 ml-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                      <li>进入 GitHub 仓库页面。</li>
                      <li>点击 <strong>Settings</strong> (设置) &rarr; <strong>Secrets and variables</strong> &rarr; <strong>Actions</strong>。</li>
                      <li>点击 <strong>New repository secret</strong>。</li>
                      <li>Name 输入: <code>VITE_API_KEY</code></li>
                      <li>Secret 输入: 您的 Gemini API Key。</li>
                      <li>点击 Add secret 保存。</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">开启 GitHub Pages</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                      <li>点击仓库的 <strong>Settings</strong> &rarr; <strong>Pages</strong>。</li>
                      <li>在 <strong>Build and deployment</strong> 区域，Source 选择 <strong>GitHub Actions</strong>。</li>
                      <li>这一步非常关键，不要选错了。</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">等待自动部署</h4>
                    <p className="text-sm mt-1">
                      配置完成后，点击 <strong>Actions</strong> 标签页，您应该能看到一个名为 "Deploy to GitHub Pages" 的工作流正在运行。
                      <br />
                      等待它变成绿色对勾 ✅，您就可以在 Settings -> Pages 中看到您的网站地址了！
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};