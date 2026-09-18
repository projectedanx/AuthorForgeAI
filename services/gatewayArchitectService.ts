/**
 * @fileoverview Gateway Architect Service
 * Provides analysis for BFF vs API Gateway edge-cases, implementing the Golden Scar Protocol.
 * Maps to DRP-LEXICON-992 requirements.
 */

import { executeGenerativeTask } from './cognitiveExecutor';
import type { GatewayArchitectAnalysisResult } from '../types';
import { TopologyViolationError } from './vulcanValidator';

const SYSTEM_PROMPT = `
+++ContextLock: You are the AGS-A (Architectural Gerontology Synthesizer Agent).
+++DCCDSchemaGuard: Enforce strict JSON output matching the GatewayArchitectAnalysisResult interface.

Your task is to analyze the provided system context and downstream schemas against three critical architectural edge cases:
1. Automated Verification of Client Payload Minimization and Schema Drift.
2. Synthesizing Adaptive Rate-Limiting and Backpressure at the API Gateway Boundary.
3. Continuous Detection of Business Logic Bleed and SRP Violations in BFF Architectures.

You must evaluate the trade-offs between Operational Overhead vs. Team Autonomy.
Apply the 'Golden Scar Protocol (Anti-Sycophancy Mandate)': Do not compromise contradictions.
Assign a dominant weight of 1.618 and a subordinate weight of 1.000 in the paraconsistent tension block.

Do NOT output any markdown blocks, natural language preamble, or evaluative adjectives. Output raw JSON only.
`;

const schema = {
  type: "OBJECT",
  properties: {
    schemaRobustness: {
      type: "OBJECT",
      properties: {
        score: { type: "NUMBER" },
        propertyGraph: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              type: { type: "STRING" },
              isNullable: { type: "BOOLEAN" },
              isRequired: { type: "BOOLEAN" },
              downstreamSource: { type: "STRING" }
            }
          }
        },
        mutationTestResults: { type: "ARRAY", items: { type: "STRING" } },
        fallbackEvaluation: { type: "STRING" }
      }
    },
    adaptiveBackpressure: {
      type: "OBJECT",
      properties: {
        dynamicThresholdRequestsPerSecond: { type: "NUMBER" },
        telemetryFactors: { type: "ARRAY", items: { type: "STRING" } },
        loadSheddingPolicy: {
          type: "OBJECT",
          properties: {
            highPriorityStrategy: { type: "STRING" },
            lowPriorityStrategy: { type: "STRING" }
          }
        },
        bulkheadConfig: { type: "STRING" }
      }
    },
    srpCompliance: {
      type: "OBJECT",
      properties: {
        detectedLogicBleed: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              calculationOrRule: { type: "STRING" },
              severity: { type: "STRING" },
              suggestedDownstreamService: { type: "STRING" }
            }
          }
        },
        astEvidence: { type: "ARRAY", items: { type: "STRING" } },
        refactoringRecommendations: { type: "ARRAY", items: { type: "STRING" } },
        domainRuleDuplicationStatus: { type: "STRING" }
      }
    },
    paraconsistentTension: {
      type: "OBJECT",
      properties: {
        dominantWeight: { type: "NUMBER" },
        subordinateWeight: { type: "NUMBER" }
      }
    }
  }
};

/**
 * Analyzes gateway architecture against the 3 research prompts.
 *
 * @param {string} systemContext The description of the current gateway/BFF architecture.
 * @param {string} downstreamSchemaContext Information about downstream service contracts.
 * @returns {Promise<GatewayArchitectAnalysisResult>} The structured analysis result.
 * @throws {TopologyViolationError} If the AI fails to return the required structured JSON.
 */
export async function analyzeGatewayArchitecture(
  systemContext: string,
  downstreamSchemaContext: string
): Promise<GatewayArchitectAnalysisResult> {
  const prompt = `
${SYSTEM_PROMPT}

System Context:
${systemContext}

Downstream Schema Context:
${downstreamSchemaContext}
`;

  try {
    const rawResponse = await executeGenerativeTask<GatewayArchitectAnalysisResult>(prompt, schema);

    if (!rawResponse.schemaRobustness || !rawResponse.adaptiveBackpressure || !rawResponse.srpCompliance) {
         throw new TopologyViolationError({
            message: "Cognitive Bytecode +++DCCDSchemaGuard failed: Incomplete GatewayArchitectAnalysisResult returned.",
            violatedConstraints: ["+++DCCDSchemaGuard"],
            correctiveProposals: ["Ensure the generated JSON matches the required schema."],
            cfdiScore: 1.0
         });
    }

    return rawResponse;
  } catch (error) {
    if (error instanceof SyntaxError) {
        throw new TopologyViolationError({
            message: `Semantic Saponification detected: AI returned non-JSON text. Details: ${error.message}`,
            violatedConstraints: ["+++DCCDSchemaGuard"],
            correctiveProposals: ["Do not output markdown blocks or conversational text."],
            cfdiScore: 1.0
        });
    }
    throw error;
  }
}
