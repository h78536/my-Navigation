import React, { useState } from 'react';
import { LinkItem } from '../types';
import { ExternalLink, Trash2, Globe } from 'lucide-react';

interface LinkCardProps {
  link: LinkItem;
  onDelete: (id: string) => void;
  onVisit: (id: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete, onVisit }) => {
  const [imgError, setImgError] = useState(false);

  const handleVisit = () => {
    onVisit(link.id);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  };

  const hostname = getHostname(link.url);
  const faviconUrl = hostname ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=128` : '';

  return (
    <div className="group relative bg-white/80 dark:bg-slate-800/50 hover:bg-white hover:shadow-lg dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 hover:border-cyan-200 dark:hover:border-slate-500 transition-all duration-300 rounded-xl p-4 flex flex-col gap-3 backdrop-blur-sm shadow-sm hover:shadow-cyan-500/10">
      <div className="flex justify-between items-start">
        <div 
          className="w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform overflow-hidden"
          onClick={handleVisit}
        >
          {!imgError && faviconUrl ? (
             <img 
               src={faviconUrl} 
               alt={link.title}
               className="w-10 h-10 object-contain drop-shadow-md"
               onError={() => setImgError(true)}
             />
          ) : (
            <span className="text-3xl drop-shadow-md filter">
              {link.icon && link.icon !== '🔗' ? link.icon : (link.title.charAt(0).toUpperCase() || <Globe size={28} />)}
            </span>
          )}
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(link.id); }}
            className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-md transition-colors"
            title="删除链接"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div onClick={handleVisit} className="cursor-pointer">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg truncate pr-2">{link.title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm truncate">{link.description || link.url}</p>
      </div>
      
      <div className="mt-auto pt-2 flex justify-between items-center text-xs text-slate-500 dark:text-slate-500">
        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-wider font-bold text-[10px] text-slate-600 dark:text-slate-400">
          {link.category}
        </span>
        <span className="flex items-center gap-1">
           <ExternalLink size={10} />
        </span>
      </div>
    </div>
  );
};