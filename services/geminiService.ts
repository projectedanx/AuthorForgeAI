import { Type } from "@google/genai";
import { VulcanTopologyValidator } from "./vulcanValidator";
import type { AnalysisResult, BookOutlineResult, CMDARefinementResult } from "../types";
import { executeGenerativeTask } from "./cognitiveExecutor";

/**
 * The JSON Schema definition for the `validateNiche` generative response.
 *
 * @constant
 */
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    profitableNiches: {
      type: Type.ARRAY,
      description: "A list of identified profitable niches.",
      items: {
        type: Type.OBJECT,
        properties: {
          niche: { type: Type.STRING, description: "The name of the niche." },
          description: { type: Type.STRING, description: "Why it is profitable." }
        },
        required: ["niche", "description"]
      }
    },
    trendingTopics: {
      type: Type.ARRAY,
      description: "A list of current trending topics.",
      items: {
        type: Type.OBJECT,
        properties: {
          trend: { type: Type.STRING, description: "The trending topic." },
          reasoning: { type: Type.STRING, description: "Why it is trending." }
        },
        required: ["trend", "reasoning"]
      }
    },
    keywords: {
      type: Type.ARRAY,
      description: "A list of high-value keywords.",
      items: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING, description: "The keyword string." },
          platform: { type: Type.STRING, description: "The platform it performs best on." }
        },
        required: ["keyword", "platform"]
      }
    },
    uniqueAngles: {
      type: Type.ARRAY,
      description: "A list of unique angles to approach the topic.",
      items: {
        type: Type.OBJECT,
        properties: {
          angle: { type: Type.STRING, description: "The specific angle." },
          strategy: { type: Type.STRING, description: "How to execute the strategy." }
        },
        required: ["angle", "strategy"]
      }
    }
  },
  required: ["profitableNiches", "trendingTopics", "keywords", "uniqueAngles"]
};

/**
 * Orchestrates the generative market analysis while enforcing strict topological constraints.
 *
 * This function intercepts the human's high-entropy topic via the `VulcanTopologyValidator`.
 * If VULCAN detects an impossible synthesis (e.g., requesting a CAP theorem violation),
 * it throws a `TopologyViolationError`. Otherwise, it injects the necessary Cognitive Bytecode
 * (PDL Decorators) into the prompt to ensure the output adheres to the structural schema.
 *
 * @async
 * @function validateNiche
 * @param {string} topic - The raw, unstructured topic provided by the user.
 * @returns {Promise<AnalysisResult>} A promise resolving to the fully structured, schema-compliant market analysis.
 * @throws {Error} Throws a standard error if the API call fails, or a `TopologyViolationError` if VULCAN triggers an Epistemic Escrow.
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

  return await executeGenerativeTask<AnalysisResult>(prompt, responseSchema, 0.7);
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

  return await executeGenerativeTask<BookOutlineResult>(prompt, outlineResponseSchema, 0.7);
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
    paraconsistentTension: {
      type: Type.OBJECT,
      description: "Mapping of contradiction weights based on the Golden Scar Protocol.",
      properties: {
        dominantWeight: { type: Type.NUMBER, description: "Weight of the dominant frame (e.g., 1.618)." },
        subordinateWeight: { type: Type.NUMBER, description: "Weight of the subordinate frame (e.g., 1.000)." }
      },
      required: ["dominantWeight", "subordinateWeight"]
    },
    topologicalDerivative: {
      type: Type.NUMBER,
      description: "The calculated organizational force required to lock the project structure together."
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
    If the +++GoldenScarProtocol decorator is present, you MUST return the paraconsistentTension object mapping the weights (dominant=1.618, subordinate=1.000) and estimate the topologicalDerivative.
    Return any injected active PDL decorators in the pdlDecorators array of the response.
    Return betti number > 0 if any architectural contradiction (scar) remains unresolved in the bettiNumber field of the response.

    Your response must be in JSON format matching the provided schema.
  `;

  return await executeGenerativeTask<CMDARefinementResult>(prompt, cmdaRefinementSchema, 0.8);
};
