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
      if (file.size > 5 * 1024 * 1024) { 
         setError("图片大小不能超过 5MB");
         return;
      }
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
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await editImage(selectedImage, prompt);
      if (result) {
        setResultImage(result);
      } else {
        setError("未能生成图片，请重试。");
      }
    } catch (err) {
      setError("生成过程中发生错误。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `edited-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setResultImage(null);
    setPrompt('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative animate-in zoom-in-95 duration-200 transition-colors">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Wand2 className="text-purple-600 dark:text-purple-400" />
                    AI 图片编辑
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/50">
                {!selectedImage ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all h-full min-h-[300px]"
                    >
                        <div className="w-20 h-20 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mb-6 text-cyan-600 dark:text-cyan-400">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">上传图片</h3>
                        <p className="text-slate-500 dark:text-slate-400">点击或拖拽图片到此处 (Max 5MB)</p>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 h-full">
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-center flex-1 min-h-[300px]">
                            <div className="relative group w-full md:w-1/2 aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                <img src={selectedImage} alt="Original" className="max-w-full max-h-full object-contain" />
                                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">原图</div>
                                <button 
                                    onClick={reset}
                                    className="absolute top-2 right-2 p-2 bg-white/90 text-slate-700 rounded-full shadow hover:bg-white hover:text-red-500 transition-colors"
                                    title="移除图片"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="hidden md:flex text-slate-400 dark:text-slate-600">
                                <ArrowRight size={32} />
                            </div>

                            <div className="relative w-full md:w-1/2 aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                {isLoading ? (
                                    <div className="flex flex-col items-center gap-3 text-cyan-600 dark:text-cyan-400">
                                        <Loader2 size={40} className="animate-spin" />
                                        <span className="text-sm font-medium animate-pulse">正在施展魔法...</span>
                                    </div>
                                ) : resultImage ? (
                                    <>
                                        <img src={resultImage} alt="Result" className="max-w-full max-h-full object-contain animate-in fade-in duration-500" />
                                        <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-1 rounded backdrop-blur-sm shadow-lg">AI 生成</div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
                                        <ImageIcon size={40} />
                                        <span className="text-sm">等待指令...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">编辑指令</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="例如：添加复古滤镜，或者移除背景中的路人..."
                                    className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                />
                                <button 
                                    onClick={handleGenerate}
                                    disabled={!prompt.trim() || isLoading}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-lg font-medium transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
                                >
                                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
                                    <span className="hidden sm:inline">生成</span>
                                </button>
                            </div>
                             {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                             {resultImage && (
                                 <div className="flex justify-end mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                     <button 
                                         onClick={handleDownload}
                                         className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors font-medium text-sm"
                                     >
                                         <Download size={16} />
                                         保存图片
                                     </button>
                                 </div>
                             )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};