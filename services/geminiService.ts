/**
 * @fileoverview The primary integration layer with the Google Gemini API.
 * This service handles the generative execution while strictly adhering to the topological constraints
 * (Cognitive Bytecode / PDL Decorators) dynamically provided by the VULCAN Validator.
 */

import { VulcanTopologyValidator, TopologyViolationError } from './vulcanValidator';

import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, BookOutlineResult, CMDARefinementResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * The JSON Schema definition for the `validateNiche` generative response.
 * Used to enforce Draft-Conditioned Constrained Decoding (DCCD) on the LLM output.
 *
 * @constant
 */
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

/**
 * Validates a user's book idea/topic against market trends.
 *
 * This function first passes the topic through the `VulcanTopologyValidator` to retrieve any necessary
 * PDL decorators (Cognitive Bytecode). It then constructs a prompt injecting these constraints and calls
 * the Gemini API, enforcing the structured `responseSchema`.
 *
 * @async
 * @function validateNiche
 * @param {string} topic - The user's proposed book topic or area of expertise.
 * @returns {Promise<AnalysisResult>} A promise resolving to the structured market analysis.
 * @throws {Error} Throws an error if the API call fails or if VULCAN triggers an Epistemic Escrow (TopologyViolationError).
 */
export const validateNiche = async (topic: string): Promise<AnalysisResult> => {
  const { pdlDecorators } = VulcanTopologyValidator.assessIntentTopology(topic);
  const injectedDecorators = pdlDecorators.join("\n    ");

  const prompt = `
    ${injectedDecorators}
    +++DCCDSchemaGuard(enforcement="draft_conditioned")
    +++ContextLock(anchor=DOMAIN_PAIR, refresh_interval=2048)
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

/**
 * The JSON Schema definition for the `generateBookOutline` generative response.
 *
 * @constant
 */
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

/**
 * Generates a comprehensive book outline based on a validated topic and chosen angle.
 *
 * Utilizes the `VulcanTopologyValidator` to ensure structural integrity and applies the
 * `+++MereologyRoute` PDL decorator to enforce rigid step-by-step reasoning without ontological shear.
 *
 * @async
 * @function generateBookOutline
 * @param {string} topic - The base topic of the book.
 * @param {string} angle - The specific, unique angle selected by the user.
 * @returns {Promise<BookOutlineResult>} A promise resolving to the structured book outline.
 * @throws {Error} Throws an error if the API call fails or if VULCAN triggers an Epistemic Escrow.
 */
export const generateBookOutline = async (topic: string, angle: string): Promise<BookOutlineResult> => {
  const { pdlDecorators } = VulcanTopologyValidator.assessIntentTopology(topic + " " + angle);
  const injectedDecorators = pdlDecorators.join("\n    ");

  const prompt = `
    ${injectedDecorators}
    +++MereologyRoute(relation_type="Concept-Operationalization", transitivity_check=true)
    +++ContextLock(anchor=DOMAIN_PAIR, refresh_interval=2048)
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

/**
 * The JSON Schema definition for the `refineOutlineCMDA` generative response.
 *
 * @constant
 */
const cmdaRefinementSchema = {
  type: Type.OBJECT,
  properties: {
    contradictionResolution: {
      type: Type.STRING,
      description: "Explanation of how the contradictory human constraint and original topic are held in tension."
    },
    cfdiScore: {
      type: Type.NUMBER,
      description: "Confidence-Fidelity Divergence Index (a value between 0.0 and 1.0 indicating the strictness of the adherence, closer to 0 is better)."
    },
    refinedChapters: {
      type: Type.ARRAY,
      description: "The list of chapters refined to incorporate the human constraint.",
      items: {
        type: Type.OBJECT,
        properties: {
          chapterNumber: { type: Type.NUMBER, description: "The chapter number." },
          title: { type: Type.STRING, description: "The refined title of the chapter." },
          summary: { type: Type.STRING, description: "The refined summary incorporating the contradiction." }
        },
        required: ["chapterNumber", "title", "summary"]
      }
    }
  },
  required: ["contradictionResolution", "cfdiScore", "refinedChapters"]
};

/**
 * Applies Context-Mediated Domain Adaptation (CMDA) to refine an existing outline against a new, often contradictory, constraint.
 *
 * This function utilizes paraconsistent logic (enforced via `+++ParaconsistentLens`) to ensure the LLM holds
 * the tension between the original topic and the new constraint, preventing it from producing a watered-down,
 * sycophantic compromise.
 *
 * @async
 * @function refineOutlineCMDA
 * @param {string} topic - The original topic of the book.
 * @param {string} angle - The original angle of the book.
 * @param {BookOutlineResult} originalOutline - The previously generated outline structure.
 * @param {string} humanConstraint - The new, potentially contradictory constraint or directive provided by the human.
 * @returns {Promise<CMDARefinementResult>} A promise resolving to the topologically sculpted outline and CFDI score.
 * @throws {Error} Throws an error if the API call fails.
 */
export const refineOutlineCMDA = async (topic: string, angle: string, originalOutline: BookOutlineResult, humanConstraint: string): Promise<CMDARefinementResult> => {
  const { pdlDecorators } = VulcanTopologyValidator.assessIntentTopology(topic + " " + angle + " " + humanConstraint);
  const injectedDecorators = pdlDecorators.join("\n    ");

  const prompt = `
    ${injectedDecorators}
    +++ParaconsistentLens[Contradiction -> Opportunity -> Architecture]
    +++DCCDSchemaGuard(enforcement="draft_conditioned")
    +++ContextLock(anchor=DOMAIN_PAIR, refresh_interval=2048)

    You are tasked with applying Context-Mediated Domain Adaptation (CMDA). The user has provided an original book outline generated for a specific topic, but now wishes to inject a "Tacit Constraint" or contradictory directive.

    Topic: "${topic}"
    Angle: "${angle}"
    Human Constraint (Contradiction to hold in tension): "${humanConstraint}"

    Original Outline Structure:
    ${JSON.stringify(originalOutline.chapters, null, 2)}

    Your task is NOT to flatten this contradiction or create a watered-down compromise (Sycophantic Attractor). Instead, hold the tension. Refine the chapter titles and summaries to explicitly serve both the original topic and the new constraint simultaneously.
    Ensure that the returned CFDI score reflects the mathematical rigour of this binding.
    Return any injected active PDL decorators in the pdlDecorators array of the response.
    Return betti number > 0 if any architectural contradiction (scar) remains unresolved in the bettiNumber field of the response.

    Your response must be in JSON format matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: cmdaRefinementSchema,
        temperature: 0.8, // Slightly higher to allow conceptual blending
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.error("Error calling Gemini API for CMDA refinement:", error);
    throw new Error("Failed to refine outline using CMDA.");
  }
};
