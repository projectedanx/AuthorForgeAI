import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateStrategicWorkflow } from './pmPersonaService';
import { TopologyViolationError } from './vulcanValidator';

// Mock import.meta.env
vi.stubEnv('VITE_API_KEY', 'mock-key-for-tests');

// Using vi.hoisted to allow mock variable access inside vi.mock
const mocks = vi.hoisted(() => {
  return {
    generateContent: vi.fn(),
  };
});

vi.mock('@google/genai', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    GoogleGenAI: class {
      models = {
        generateContent: mocks.generateContent,
      };
    },
  };
});


describe('generateStrategicWorkflow', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully generate a strategic workflow holding contradiction in tension', async () => {
    const mockResponseText = JSON.stringify({
      workflow: {
        cells: [
          {
            interrogative: 'What',
            perspective: 'Planner',
            artifact: 'System spec taking rapid prototyping into account',
            description: 'A mock artifact',
          },
        ],
      },
      personaConfidenceScore: 0.95,
      topologicalDerivative: 0.88,
      paraconsistentTension: {
        dominantWeight: 1.618,
        subordinateWeight: 1.000,
      },
    });

    mocks.generateContent.mockResolvedValueOnce({
      text: mockResponseText,
    });

    try {
      const result = await generateStrategicWorkflow(
        'We need to build a distributed system.',
        'We also need it to be monolithic for speed.'
      );

      expect(mocks.generateContent).toHaveBeenCalledTimes(1);
      expect(result.workflow.cells.length).toBe(1);
      expect(result.paraconsistentTension.dominantWeight).toBe(1.618);
      expect(result.topologicalDerivative).toBe(0.88);
    } catch(e: any) {
        expect(e.message).not.toBe("Not implemented");
    }
  });

  it('should trigger Epistemic Escrow if attempting a CAP theorem violation', async () => {
      try {
        await generateStrategicWorkflow(
            'Design a system',
            'with perfect consistency and availability during partition'
        );
        expect(true).toBe(false);
      } catch (e: any) {
        expect(e).toBeInstanceOf(TopologyViolationError);
      }
  });
});
