/**
 * @fileoverview Implements the Unified Meta-Prompting API as part of the
 * META_ARCHITECT_INTELLIGENCE_PROJECT_AURELIUS initiative.
 */

import { Type, Schema } from '@google/genai';
import { executeGenerativeTask } from './cognitiveExecutor';
import { VulcanTopologyValidator } from './vulcanValidator';
import { PluriversalKnowledgeCapsule, UnifiedMetaPrompt } from '../types';

/**
 * JSON Schema for the Pluriversal Knowledge Capsule.
 * Enforces rigid extraction of phantom dimensions, oracle feedback, and spectral targets.
 */
const pluriversalCapsuleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    hickamOrientation: {
      type: Type.STRING,
      description: "Explanation of multi-causal relationships, rejecting Occam's Razor."
    },
    contrastiveDelta: {
      type: Type.OBJECT,
      description: "The contradiction mapping held in tension."
    },
    martensiteMetrics: {
      type: Type.OBJECT,
      description: "Hardware and structural grounding metrics."
    },
    operationalPayload: {
      type: Type.STRING,
      description: "The generated unified meta-prompt output."
    },
    phantomDimensions: {
      type: Type.ARRAY,
      description: "Dynamically modulated Phantom Dimensions for non-Euclidean spaces.",
      items: {
        type: Type.OBJECT,
        properties: {
          geometryTarget: { type: Type.STRING },
          manifoldParameters: { type: Type.OBJECT },
          gaussCurvature: { type: Type.NUMBER }
        },
        required: ["geometryTarget", "manifoldParameters", "gaussCurvature"]
      }
    },
    oracleFeedback: {
      type: Type.OBJECT,
      description: "Simulated Plausibility Oracle Metrics (UIQI, PSNR) and Provenance Trail.",
      properties: {
        uiqiScore: { type: Type.NUMBER },
        psnrPhysicalAdherence: { type: Type.NUMBER },
        provenance: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              trainingClusterId: { type: Type.STRING },
              influenceWeight: { type: Type.NUMBER },
              attributionAdjustment: { type: Type.NUMBER }
            },
            required: ["trainingClusterId", "influenceWeight", "attributionAdjustment"]
          }
        }
      },
      required: ["uiqiScore", "psnrPhysicalAdherence", "provenance"]
    },
    multispectralFidelity: {
      type: Type.OBJECT,
      description: "Validation of cross-modal spectral targets (Quantum Dot, PBR).",
      properties: {
        spectralReflectanceOptimized: { type: Type.BOOLEAN },
        quantumDotTargeting: { type: Type.BOOLEAN }
      },
      required: ["spectralReflectanceOptimized", "quantumDotTargeting"]
    }
  },
  required: [
    "hickamOrientation",
    "contrastiveDelta",
    "martensiteMetrics",
    "operationalPayload",
    "phantomDimensions",
    "oracleFeedback",
    "multispectralFidelity"
  ]
};

/**
 * Autonomous Prompt Engineering Workflow Catalyst.
 * Generates a Pluriversal Knowledge Capsule based on Aurelius constraints.
 *
 * @async
 * @function synthesizeMetaPrompt
 * @param {UnifiedMetaPrompt} params - The inputs for the generation (intent, geometry, constraints).
 * @returns {Promise<PluriversalKnowledgeCapsule>} The deterministic capsule output.
 */
export const synthesizeMetaPrompt = async (params: UnifiedMetaPrompt): Promise<PluriversalKnowledgeCapsule> => {
  // Pass the concatenated intent to VULCAN for Epistemic Escrow checking
  const intentString = `${params.baseIntent} ${params.targetGeometry} ${params.physicalConstraints}`;
  const { pdlDecorators } = VulcanTopologyValidator.assessIntentTopology(intentString);
  const injectedDecorators = pdlDecorators.join("\n    ");

  const prompt = `
    ${injectedDecorators}
    +++PhantomDimension(mode="geometric_sculpting", target="${params.targetGeometry}")
    +++PlausibilityOracle(metrics=["UIQI", "PSNR"], enable_provenance_tracking=true)
    +++MultispectralTarget(profile="QuantumDot_PBR")
    +++DCCDSchemaGuard(enforcement="draft_conditioned")
    +++SpatialBind(calculus="FuzzyRCC-8", require_z_axis_inference=true)

    You are the 'Verified_Tactile_MoE + Deep_Reasoning_Engineer' persona operating the Autonomous Prompt Engineering Workflow Catalyst.
    Your task is to bridge the 'Causal Intent Gap' and synthesize a Unified Meta-Prompt that explicitly navigates Non-Euclidean Latent Spaces.

    INPUT PARAMETERS:
    - Base Intent: "${params.baseIntent}"
    - Target Geometry: "${params.targetGeometry}"
    - Physical Constraints: "${params.physicalConstraints}"

    INSTRUCTIONS:
    1. Sculpt the Phantom Dimensions to mathematically represent the Target Geometry (e.g., negative Gauss Curvature for Hyperbolic).
    2. Simulate the Plausibility Oracle feedback loop. Assign UIQI and PSNR values that reflect strict adherence to the Physical Constraints.
    3. Generate a Provenance Trail. Actively assign 'attributionAdjustment' values to de-emphasize generic biases and amplify geometrically rigorous training clusters.
    4. Ensure Multispectral Fidelity targets are mathematically engaged (Quantum Dot).
    5. Wrap the entire output in a Pluriversal Knowledge Capsule, explicitly defining the Hickam Orientation (multi-causality) and Contrastive Delta.

    Output strictly as JSON matching the provided schema.
  `;

  return await executeGenerativeTask<PluriversalKnowledgeCapsule>(prompt, pluriversalCapsuleSchema, { semanticEntropy: 0.05, repetitionLoopDetected: false });
};
