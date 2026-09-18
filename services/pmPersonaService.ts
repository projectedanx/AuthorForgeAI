/**
 * @fileoverview Defines the Strategic Integration Project Manager Persona Service.
 * Orchestrates the generation of Zachman Framework operational workflows,
 * enforcing the Golden Scar Protocol to map structural tensions without semantic collapse.
 */

import { Type } from '@google/genai';
import { VulcanTopologyValidator } from './vulcanValidator';
import type { StrategicIntegrationResult } from '../types';
import { executeGenerativeTask } from './cognitiveExecutor';

/**
 * The JSON Schema definition for the `StrategicIntegrationResult` generative response.
 */
const strategicIntegrationSchema = {
  type: Type.OBJECT,
  properties: {
    workflow: {
      type: Type.OBJECT,
      description: "The operational workflow mapped to the Zachman Framework.",
      properties: {
        cells: {
          type: Type.ARRAY,
          description: "The cells populated within the framework.",
          items: {
            type: Type.OBJECT,
            properties: {
              interrogative: {
                type: Type.STRING,
                description: "The specific question being answered (What, How, Where, Who, When, Why)."
              },
              perspective: {
                type: Type.STRING,
                description: "The perspective level (e.g., Planner, Owner, Designer, Builder, Subcontractor)."
              },
              artifact: {
                type: Type.STRING,
                description: "The deterministic system artifact resolving the cell."
              },
              description: {
                type: Type.STRING,
                description: "Description or rationalization."
              }
            },
            required: ["interrogative", "perspective", "artifact", "description"]
          }
        }
      },
      required: ["cells"]
    },
    personaConfidenceScore: {
      type: Type.NUMBER,
      description: "A Persona Confidence Score, updating based on recency and quality of signals."
    },
    topologicalDerivative: {
      type: Type.NUMBER,
      description: "The calculated organizational force required to lock the project structure together."
    },
    paraconsistentTension: {
      type: Type.OBJECT,
      description: "Mapping of contradiction weights based on the Golden Scar Protocol.",
      properties: {
        dominantWeight: { type: Type.NUMBER, description: "Weight of the dominant frame (e.g., 1.618)." },
        subordinateWeight: { type: Type.NUMBER, description: "Weight of the subordinate frame (e.g., 1.000)." }
      },
      required: ["dominantWeight", "subordinateWeight"]
    }
  },
  required: ["workflow", "personaConfidenceScore", "topologicalDerivative", "paraconsistentTension"]
};

/**
 * Acts as the Strategic Integration Project Manager Persona.
 * Takes human intent and contradictory constraints, runs them through the VULCAN validator,
 * and generates a Zachman framework deterministic schema.
 * Utilizes Paraconsistent Logic and the Golden Scar Protocol to enforce cognitive bounds.
 *
 * @async
 * @function generateStrategicWorkflow
 * @param {string} systemFirstSpec - The initial, deterministic system requirements.
 * @param {string} humanConstraint - The potentially contradictory human directive to be held in tension.
 * @returns {Promise<StrategicIntegrationResult>} A promise resolving to the structured workflow and tension metrics.
 * @throws {Error} Throws if the API call fails or if VULCAN triggers an Epistemic Escrow.
 */
export const generateStrategicWorkflow = async (
  systemFirstSpec: string,
  humanConstraint: string
): Promise<StrategicIntegrationResult> => {
  // 1. Run through VULCAN to intercept structural impossibilities and gather PDL decorators
  const intent = `${systemFirstSpec} | ${humanConstraint}`;
  const { pdlDecorators } = VulcanTopologyValidator.assessIntentTopology(intent);
  const injectedDecorators = pdlDecorators.join("\n    ");

  // 2. The prompt injecting the PDT Specification Block logic and constraints
  const prompt = `
    ${injectedDecorators}
    +++DCCDSchemaGuard(enforcement="draft_conditioned")
    +++ContextLock(anchor="PERSONA_EMPIRICAL_MATRIX", refresh_interval=4096)
    +++MereologyRoute(relation_type="Concept-Operationalization", transitivity_check=true)

    You are operating under DRP-SCOS-PERSONA-METROLOGY-2026-v6.1.
    ROLE: Strategic Integration Project Manager.
    TASK: Translate deterministic system-first specs into agentic operational workflows.
    CONTEXT: Empirical documentation standards (AGENTS.md, DOMAIN_GLOSSARY.md).

    System-First Specification: "${systemFirstSpec}"
    Tacit Human Constraint (Contradiction): "${humanConstraint}"

    Your task is to generate an Operational Workflow based on the Zachman Framework.
    You MUST NOT compromise or average out the contradiction. Apply the Golden Scar Protocol.
    Hold the contradiction in tension. Assign 1.618 to the dominant frame and 1.000 to the subordinate.
    Calculate the topologicalDerivative representing the organizational force required to lock this structure together.

    Provide your response strictly in the JSON format matching the provided schema.
  `;

  return await executeGenerativeTask<StrategicIntegrationResult>(prompt, strategicIntegrationSchema, 0.7);
};
