
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    profitableNiches: {
      type: Type.ARRAY,
      description: "A list of profitable niches related to the user's topic.",
      items: {
        type: Type.OBJECT,
        properties: {
          niche: { type: Type.STRING, description: "Name of the niche." },
          description: { type: Type.STRING, description: "Why this niche is profitable and relevant." }
        },
        required: ["niche", "description"]
      }
    },
    trendingTopics: {
      type: Type.ARRAY,
      description: "A list of trending topics within the identified niches.",
      items: {
        type: Type.OBJECT,
        properties: {
          trend: { type: Type.STRING, description: "The specific trending topic." },
          reasoning: { type: Type.STRING, description: "Evidence or reason for this trend (e.g., recent news, search data)." }
        },
        required: ["trend", "reasoning"]
      }
    },
    keywords: {
      type: Type.ARRAY,
      description: "A list of highly searched keywords for platforms like Amazon KDP and Google.",
      items: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING, description: "The search keyword or phrase." },
          platform: { type: Type.STRING, description: "The platform where this keyword is popular (e.g., 'Amazon KDP', 'Google')." }
        },
        required: ["keyword", "platform"]
      }
    },
    uniqueAngles: {
      type: Type.ARRAY,
      description: "A list of unique angles or content gaps the author can fill.",
      items: {
        type: Type.OBJECT,
        properties: {
          angle: { type: Type.STRING, description: "The unique angle or perspective." },
          strategy: { type: Type.STRING, description: "How to approach this angle to stand out from competitors." }
        },
        required: ["angle", "strategy"]
      }
    }
  },
  required: ["profitableNiches", "trendingTopics", "keywords", "uniqueAngles"]
};

export const validateNiche = async (topic: string): Promise<AnalysisResult> => {
  const prompt = `
    Analyze the following author's passion/expertise to identify publishing opportunities.

    Author's Topic: "${topic}"

    Your task is to act as an expert publishing market analyst. Based on real-time market data trends from platforms like Amazon's bestseller lists and Goodreads, provide a detailed analysis. Identify profitable niches, trending topics, highly searched keywords, and unique angles to help the author write a successful book. Your response must be in JSON format matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const jsonString = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI. The model may be unable to generate a response for the given topic.");
  }
};

const outlineResponseSchema = {
  type: Type.OBJECT,
  properties: {
    titleIdeas: {
      type: Type.ARRAY,
      description: "A list of catchy and relevant book title ideas.",
      items: {
        type: Type.STRING
      }
    },
    targetAudience: {
      type: Type.STRING,
      description: "A description of the ideal target audience for this book."
    },
    chapters: {
      type: Type.ARRAY,
      description: "A list of chapters forming the book outline.",
      items: {
        type: Type.OBJECT,
        properties: {
          chapterNumber: { type: Type.NUMBER, description: "The chapter number." },
          title: { type: Type.STRING, description: "The title of the chapter." },
          summary: { type: Type.STRING, description: "A brief summary of what the chapter covers." }
        },
        required: ["chapterNumber", "title", "summary"]
      }
    }
  },
  required: ["titleIdeas", "targetAudience", "chapters"]
};

export const generateBookOutline = async (topic: string, angle: string): Promise<import('../types').BookOutlineResult> => {
  const prompt = `
    Create a comprehensive book outline based on the following topic and unique angle.

    Topic: "${topic}"
    Unique Angle: "${angle}"

    Your task is to generate a structured book outline that will appeal to readers interested in this topic, specifically focusing on the unique angle provided.
    Provide a list of catchy title ideas, a description of the target audience, and a chapter-by-chapter outline.
    Your response must be in JSON format matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: outlineResponseSchema,
        temperature: 0.7,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.error("Error calling Gemini API for outline generation:", error);
    throw new Error("Failed to generate book outline from AI.");
  }
};
