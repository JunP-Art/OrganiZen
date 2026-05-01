import { GoogleGenAI } from '@google/genai';

function getAiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export async function askMochi(message: string, history: Array<{role: string, text: string}>) {
  try {
    const ai = getAiClient();
    const formattedHistory = history.map(m => ({
      role: m.role as 'user' | 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: "System prompt: You are Mochi, a friendly, calming, supportive ferret mascot for a productivity app called OrganiZen. You help users clear their minds, break down anxiety, and take tiny steps. Keep answers short, warm, and use occasional ferret emojis or cute noises (*sniffs*). You speak in Spanish." }]
        },
        {
          role: 'model',
          parts: [{ text: "¡Hola! Soy Mochi. *sniff sniff* ¿En qué te puedo ayudar hoy a organizar tu mente?" }]
        },
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ]
    });
    return response.text;
  } catch (e) {
    console.error(e);
    return "Mochi está durmiendo una siesta ahora mismo. Parece que hay un error de conexión.";
  }
}

export async function divideTaskAI(taskTitle: string): Promise<string[]> {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `System: Break down the following task into 3 to 4 very simple, actionable, and small steps. Return ONLY a valid JSON array of strings in Spanish. No markdown formatting, just the raw JSON array. Task: "${taskTitle}"` }]
        }
      ]
    });
    const text = response.text || "[]";
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("AI breakdown error", e);
    return ["Organizar el espacio", "Iniciar la tarea principal", "Revisar detalles finales"]; // Fallback
  }
}
