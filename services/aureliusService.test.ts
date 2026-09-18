import { describe, it, expect, vi } from 'vitest';
import { synthesizeMetaPrompt } from './aureliusService';
import { PluriversalKnowledgeCapsule, UnifiedMetaPrompt } from '../types';

// Mock the cognitive executor
vi.mock('./cognitiveExecutor', () => {
  return {
    executeGenerativeTask: vi.fn()
  };
});
import { executeGenerativeTask } from './cognitiveExecutor';

describe('Aurelius Service: Unified Meta-Prompting API', () => {
  it('synthesizes a Pluriversal Knowledge Capsule with Phantom Dimensions and Oracle Feedback', async () => {

    // Mock the expected return from the generative model
    const mockCapsule: PluriversalKnowledgeCapsule = {
      hickamOrientation: "Multi-causal geometric rendering overriding Occam's simplification.",
      contrastiveDelta: { tension: "Hyperbolic vs Euclidean" },
      martensiteMetrics: { tensionIndex: 1.618 },
      operationalPayload: "Render a tesseract in a hyperbolic dodecahedron space.",
      phantomDimensions: [{
        geometryTarget: "hyperbolic_dodecahedron_space",
        manifoldParameters: { curvature: -1.5, boundaryTolerance: 0.15 },
        gaussCurvature: -1.5
      }],
      oracleFeedback: {
        uiqiScore: 0.95,
        psnrPhysicalAdherence: 35.2,
        provenance: [{
          trainingClusterId: "hash_42_geometric_primitives",
          influenceWeight: 0.8,
          attributionAdjustment: -0.1 // Active de-emphasis
        }]
      },
      multispectralFidelity: {
        spectralReflectanceOptimized: true,
        quantumDotTargeting: true
      }
    };

    // Cast to any to mock the resolved value
    (executeGenerativeTask as any).mockResolvedValueOnce(mockCapsule);

    const inputParams: UnifiedMetaPrompt = {
      baseIntent: "A crystalline structure refracting light.",
      targetGeometry: "Hyperbolic Geometry",
      physicalConstraints: "Quantum Dot color gamut, physically based rendering."
    };

    const result = await synthesizeMetaPrompt(inputParams);

    // Verify structural bounds (Negative Space Scaffolding)
    expect(result.hickamOrientation).toBeDefined();

    // Verify Geometric Cognition (Phantom Dimensions)
    expect(result.phantomDimensions.length).toBeGreaterThan(0);
    expect(result.phantomDimensions[0].gaussCurvature).toBeLessThan(0); // Hyperbolic space implies negative curvature

    // Verify Agentic Auto-Optimization (Plausibility Oracle)
    expect(result.oracleFeedback).toBeDefined();
    expect(result.oracleFeedback.uiqiScore).toBeGreaterThan(0.9);

    // Verify Provenance Trail and Semantic Drift control
    expect(result.oracleFeedback.provenance.length).toBeGreaterThan(0);
    expect(result.oracleFeedback.provenance[0].attributionAdjustment).toBeDefined();

    // Verify Cross-Modal Perceptual Fusion
    expect(result.multispectralFidelity).toBeDefined();
    expect(result.multispectralFidelity.quantumDotTargeting).toBe(true);
  });
});
