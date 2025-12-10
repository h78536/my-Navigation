import { GoogleGenAI } from "@google/genai";

export const askGemini = async (prompt: string): Promise<string> => {
  // Use Vite's import.meta.env to access environment variables
  const apiKey = import.meta.env.VITE_API_KEY;
  
  if (!apiKey) {
    console.error("API Key is missing. Please check your .env file or GitHub Secrets.");
    return "API Key 未配置，无法使用 AI 功能。";
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "你是一个集成在个人导航仪表盘中的乐于助人、简洁的 AI 助手。请使用中文回答。回答应简短、直接、有帮助。支持 Markdown 格式。",
      }
    });
    
    return response.text || "未生成回复。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，获取 AI 回复时遇到错误，请稍后再试。";
  }
};

export const editImage = async (imageBase64: string, prompt: string): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    console.error("API Key is missing.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    console.error("Invalid image format provided to editImage");
    return null;
  }
  
  const mimeType = match[1];
  const data = match[2];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};