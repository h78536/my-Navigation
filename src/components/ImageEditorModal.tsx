import React, { useState, useRef } from 'react';
import { X, Upload, Wand2, Download, Image as ImageIcon, Loader2, ArrowRight } from 'lucide-react';
import { editImage } from '../services/geminiService';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) return;
    setIsLoading(true); setError(null);
    try {
      const result = await editImage(selectedImage, prompt);
      if (result) setResultImage(result);
      else setError("未能生成图片，请重试。");
    } catch (err) { setError("生成过程中发生错误。"); } finally { setIsLoading(false); }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a'); link.href = resultImage; link.download = `edited-image.png`; document.body.appendChild(link); link.click(); document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><Wand2 className="text-purple-600" /> AI 图片编辑</h2>
                <button onClick={onClose}><X size={24} className="text-slate-400 hover:text-white" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/50">
                {!selectedImage ? (
                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 h-full min-h-[300px]">
                        <Upload size={32} className="text-cyan-600 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">上传图片</h3>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 h-full">
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-center flex-1 min-h-[300px]">
                            <div className="relative w-full md:w-1/2 aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden"><img src={selectedImage} className="max-w-full max-h-full object-contain" /><button onClick={()=>setSelectedImage(null)} className="absolute top-2 right-2 p-2 bg-white rounded-full"><X size={16}/></button></div>
                            <ArrowRight size={32} className="hidden md:flex text-slate-400" />
                            <div className="relative w-full md:w-1/2 aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                                {isLoading ? <Loader2 size={40} className="animate-spin text-cyan-600" /> : resultImage ? <img src={resultImage} className="max-w-full max-h-full object-contain" /> : <ImageIcon size={40} className="text-slate-400" />}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="flex gap-2"><input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="输入编辑指令..." className="flex-1 bg-slate-100 dark:bg-slate-900 border rounded-lg px-4 py-3 outline-none" /><button onClick={handleGenerate} disabled={!prompt.trim() || isLoading} className="bg-purple-600 text-white px-6 rounded-lg">生成</button></div>
                            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                            {resultImage && <div className="flex justify-end mt-4"><button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"><Download size={16} /> 保存</button></div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};