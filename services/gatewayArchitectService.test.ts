import { describe, it, expect, vi } from 'vitest';
import { analyzeGatewayArchitecture } from './gatewayArchitectService';
import * as cognitiveExecutor from './cognitiveExecutor';

// Mock the dependencies
vi.mock('./cognitiveExecutor', () => ({
  executeGenerativeTask: vi.fn(),
}));

describe('Gateway Architect Service (AGS-A TDD)', () => {
  it('should successfully parse a valid JSON payload describing gateway analysis and enforce Golden Scar paraconsistent logic', async () => {
    // Arrange
    const mockAnalysisPayload = {
      schemaRobustness: {
        score: 0.85,
        propertyGraph: [
          {
            name: "userId",
            type: "string",
            isNullable: false,
            isRequired: true,
            downstreamSource: "UserService"
          }
        ],
        mutationTestResults: [
          "Removed 'address' field -> Handled via empty object fallback"
        ],
        fallbackEvaluation: "Robust fallbacks exist for non-critical fields."
      },
      adaptiveBackpressure: {
        dynamicThresholdRequestsPerSecond: 1500,
        telemetryFactors: ["DB latency > 50ms", "CPU utilization at 70%"],
        loadSheddingPolicy: {
          highPriorityStrategy: "Queue and prioritize checkout requests",
          lowPriorityStrategy: "Drop 50% of recommendation requests (HTTP 429)"
        },
        bulkheadConfig: "Dedicated thread pools for critical downstream services"
      },
      srpCompliance: {
        detectedLogicBleed: [
          {
            calculationOrRule: "Cart total calculation in Web BFF",
            severity: "HIGH",
            suggestedDownstreamService: "CheckoutService"
          }
        ],
        astEvidence: ["Found reduce() operation on cart items array in BFF controller"],
        refactoringRecommendations: ["Move calculation logic to CheckoutService and expose an endpoint."],
        domainRuleDuplicationStatus: "High risk: cart logic duplicated across Web and Mobile BFFs."
      },
      paraconsistentTension: {
        dominantWeight: 1.618,
        subordinateWeight: 1.000
      }
    };

    vi.mocked(cognitiveExecutor.executeGenerativeTask).mockResolvedValue(mockAnalysisPayload);

    const systemContext = "Evaluate our current e-commerce API gateway setup.";
    const downstreamSchemaContext = "UserService v2, CheckoutService v1";

    // Act
    const result = await analyzeGatewayArchitecture(systemContext, downstreamSchemaContext);

    // Assert
    expect(cognitiveExecutor.executeGenerativeTask).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();

    // Validate schema properties
    expect(result.schemaRobustness.score).toBe(0.85);
    expect(result.schemaRobustness.propertyGraph[0].name).toBe('userId');

    // Validate Adaptive Rate Limit Policy
    expect(result.adaptiveBackpressure.dynamicThresholdRequestsPerSecond).toBe(1500);
    expect(result.adaptiveBackpressure.loadSheddingPolicy.highPriorityStrategy).toContain('checkout');

    // Validate SRP Bleed
    expect(result.srpCompliance.detectedLogicBleed[0].severity).toBe('HIGH');

    // Validate Golden Scar Protocol enforcement
    expect(result.paraconsistentTension.dominantWeight).toBe(1.618);
    expect(result.paraconsistentTension.subordinateWeight).toBe(1.000);
  });

  it('should throw an error if the model returns invalid JSON', async () => {
     vi.mocked(cognitiveExecutor.executeGenerativeTask).mockRejectedValue(new SyntaxError("Unexpected end of JSON input"));

     await expect(analyzeGatewayArchitecture("context", "schema")).rejects.toThrow();
  });
});
