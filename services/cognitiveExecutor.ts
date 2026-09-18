/**
 * @fileoverview Defines the cognitive execution service.
 * Centralizes API interactions and Epistemic Escrow logic to reduce complexity.
 */

import { GoogleGenAI } from "@google/genai";
import { TopologyViolationError } from "./vulcanValidator";
import { RheologicalModeSwitcher, TelemetryData, ViscosityMode } from "./rheologyService";

// Initialize the Gemini SDK
const apiKey = import.meta.env?.VITE_API_KEY || import.meta.env?.API_KEY || 'mock-key-for-tests';
export const ai = new GoogleGenAI({ apiKey });

/**
 * Executes a generative task using the Gemini API.
 * Centralizes the try/catch logic and propagation of TopologyViolationError (Epistemic Escrow).
 *
 * @template T - The expected return type matching the provided JSON schema.
 * @param {string} prompt - The complete prompt including injected PDL decorators.
 * @param {object} responseSchema - The expected JSON schema for the response.
 * @param {number} [temperature=0.7] - The temperature for the generation.
 * @returns {Promise<T>} A promise resolving to the parsed JSON response.
 * @throws {TopologyViolationError} If VULCAN triggered an Epistemic Escrow, or the model throws a similar topology violation.
 * @throws {Error} If a general API error occurs.
 */
export const executeGenerativeTask = async <T>(
  prompt: string,
  responseSchema: object,
  telemetry?: TelemetryData
): Promise<T> => {
  try {
    // 1. Determine Rheological Mode
    const rms = new RheologicalModeSwitcher();
    let currentCalibration;

    if (telemetry) {
        currentCalibration = rms.evaluateTelemetry(telemetry);
    } else {
        // Default to Crystal mode if no telemetry is provided for deterministic execution
        currentCalibration = rms.forceMode(ViscosityMode.CRYSTAL);
    }

    // 2. Wrap prompt in Salted Sequence Tags if in Crystal Mode
    let finalPrompt = prompt;
    if (currentCalibration.saltedTags) {
        const [openTag, closeTag] = currentCalibration.saltedTags;
        finalPrompt = `${openTag}
${prompt}
${closeTag}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: finalPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: currentCalibration.temperature,
        topP: currentCalibration.topP,
      },
    });

    const jsonString = response.text.trim();
    const result: T = JSON.parse(jsonString);
    return result;
  } catch (error) {
    if (error instanceof TopologyViolationError) {
      throw error;
    }
    console.error("Error executing generative task:", error);
    throw new Error("Failed to execute generative task. The model may be unable to generate a response for the given input.");
  }
};
