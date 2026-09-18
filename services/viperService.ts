/**
 * @fileoverview The V.I.P.E.R. (Visual Intent & Physical Execution Router) Service.
 * Implements the Analytical-to-Generative Inversion, extruding human visual desire
 * into a mathematically rigid Optical State Matrix (OSM).
 */

import { Type, Schema } from "@google/genai";
import { OpticalStateMatrix, RCC8Relation } from "../types";
import { ai } from "./cognitiveExecutor"; // We will export 'ai' instance from geminiService

/**
 * The JSON Schema for the Optical State Matrix (OSM).
 * Clamps the output to a zero-entropy state.
 */
const osmSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    width: { type: Type.NUMBER, description: "Total matrix width in pixels." },
    height: { type: Type.NUMBER, description: "Total matrix height in pixels." },
    elements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          adjectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Maximum of 2 adjectives allowed."
          },
          hardwareBoundingBox: {
            type: Type.OBJECT,
            properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              width: { type: Type.NUMBER },
              height: { type: Type.NUMBER }
            },
            required: ["x", "y", "width", "height"]
          }
        },
        required: ["id", "name", "adjectives", "hardwareBoundingBox"]
      }
    },
    topologicalConstraints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          subjectId: { type: Type.STRING },
          objectId: { type: Type.STRING },
          relation: {
            type: Type.STRING,
            enum: Object.values(RCC8Relation)
          }
        },
        required: ["subjectId", "objectId", "relation"]
      }
    }
  },
  required: ["width", "height", "elements", "topologicalConstraints"]
};

/**
 * Extrudes a subjective visual prompt into an Optical State Matrix.
 * Utilizes Negative Space Scaffolding via PDL decorators to enforce spatial rigidity.
 *
 * @param visualPrompt - The human-provided visual intent (e.g. "moody cinematic cover")
 * @returns {Promise<OpticalStateMatrix>} The grounded physical matrix
 */
export const extrudeOpticalStateMatrix = async (visualPrompt: string): Promise<OpticalStateMatrix> => {
  const prompt = `
    +++DCCDSchemaGuard(enforcement="draft_conditioned")
    +++SpatialBind(engine="RCC-8")
    +++HardwareForcedPhysicality(base_dimensions=[1024, 1024])
    +++AdjectivalBound(max=2, entity="OSMElement")

    You are V.I.P.E.R. (Visual Intent & Physical Execution Router).
    Your task is NOT to generate an image or subjective prose.
    Your task is to translate the following subjective human visual desire into a mathematically rigid Optical State Matrix (OSM).

    Visual Desire: "${visualPrompt}"

    INSTRUCTIONS:
    1. Parse the core subjects and background elements.
    2. Assign rigid hardware bounds (x, y, width, height) within a 1024x1024 matrix.
    3. Calculate and assign exact RCC-8 topological relations between elements (e.g., if a knight is on a cliff, they are Externally Connected - EC).
    4. You MUST restrict your descriptive adjectives to a MAXIMUM of 2 per element to prevent semantic saponification.

    Output strictly as JSON matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: osmSchema,
        temperature: 0.1, // Near-zero entropy required for structural extrusion
      },
    });

    const jsonString = response.text.trim();
    const result: OpticalStateMatrix = JSON.parse(jsonString);

    // Safety check enforcing Adjectival Bound (the model should do this via schema, but we guard here too)
    result.elements.forEach(el => {
       if (el.adjectives && el.adjectives.length > 2) {
           el.adjectives = [el.adjectives[0], el.adjectives[1]] as [string, string];
       }
    });

    return result;
  } catch (error) {
    console.error("V.I.P.E.R. Extrusion Failure:", error);
    throw new Error("Failed to extrude Optical State Matrix from the visual prompt.");
  }
};
