import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface LockScreenProps {
  onUnlock: (password: string) => boolean;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUnlock(input)) { setError(false); setInput(''); } else { setError(true); setInput(''); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-white">
      <div className="w-full max-w-sm p-8 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 shadow-2xl ring-4 ring-slate-200 dark:ring-slate-800"><Lock size={32} className="text-cyan-600" /></div>
        <h1 className="text-2xl font-bold mb-2">欢迎回来</h1>
        <form onSubmit={handleSubmit} className="w-full relative">
          <input type="password" autoFocus value={input} onChange={(e) => { setInput(e.target.value); setError(false); }} placeholder="输入密码" className={`w-full bg-white dark:bg-slate-800/50 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-xl px-5 py-4 pr-12 outline-none text-center text-lg`} />
          <button type="submit" className="absolute right-2 top-2 bottom-2 w-10 bg-cyan-600 text-white rounded-lg flex items-center justify-center"><ArrowRight size={20} /></button>
        </form>
        {error && <p className="mt-4 text-red-500 text-sm animate-pulse">密码错误</p>}
      </div>
    </div>
  );
};