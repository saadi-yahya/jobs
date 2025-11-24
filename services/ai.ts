
import { GoogleGenAI, Type } from "@google/genai";
import { Job, MarketStat } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMarketInsights = async (): Promise<MarketStat> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Fournis une analyse simulée et réaliste du marché de l'emploi en France aujourd'hui. Inclus un taux de chômage fictif mais réaliste, une estimation des postes ouverts, la tendance et un court conseil stratégique.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            unemploymentRate: { type: Type.NUMBER, description: "Taux de chômage en pourcentage (ex: 7.2)" },
            openPositions: { type: Type.NUMBER, description: "Nombre estimé de postes ouverts" },
            trend: { type: Type.STRING, enum: ["up", "down", "stable"] },
            insight: { type: Type.STRING, description: "Un conseil stratégique court pour les chercheurs d'emploi (max 2 phrases)." }
          },
          required: ["unemploymentRate", "openPositions", "trend", "insight"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MarketStat;
    }
    throw new Error("Pas de réponse de l'IA");
  } catch (error) {
    console.error("Erreur Gemini Insights:", error);
    // Fallback data if API fails or key is missing
    return {
      unemploymentRate: 7.3,
      openPositions: 250000,
      trend: 'stable',
      insight: "Le secteur technologique recrute activement. Concentrez-vous sur les compétences numériques."
    };
  }
};

export const searchJobsWithAI = async (query: string, location: string = ''): Promise<Job[]> => {
  try {
    const locationPrompt = location ? ` à "${location}"` : " en France";
    const prompt = `Génère 6 offres d'emploi fictives mais très réalistes${locationPrompt} correspondant à la recherche : "${query}". Si la recherche est vide, génère des offres populaires tech/marketing. Inclus 3 mots-clés de compétences (skills) pour chaque offre.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              type: { type: Type.STRING, description: "CDI, CDD, Freelance, etc." },
              salary: { type: Type.STRING },
              description: { type: Type.STRING, description: "Courte description accrocheuse de 20 mots max" },
              postedAt: { type: Type.STRING, description: "ex: 'Il y a 2 jours'" },
              skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 compétences clés (ex: React, SEO, Management)" }
            },
            required: ["id", "title", "company", "location", "type", "salary", "description", "postedAt", "skills"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Job[];
    }
    return [];
  } catch (error) {
    console.error("Erreur Gemini Jobs:", error);
    return [
      {
        id: '1',
        title: 'Développeur Frontend (Mode Secours)',
        company: 'TechCorp France',
        location: 'Paris (Hybride)',
        type: 'CDI',
        salary: '45k - 55k €',
        description: 'Nous cherchons un expert React pour rejoindre notre équipe dynamique.',
        postedAt: 'Il y a 1 jour',
        skills: ['React', 'TypeScript', 'Tailwind']
      }
    ];
  }
};
