import { describe, it, expect, vi, beforeEach } from 'vitest';
import { discoverPluriversalFeatures } from './featureDiscoveryAgent';

// Mock import.meta.env
vi.stubEnv('VITE_API_KEY', 'mock-key-for-tests');

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

describe('discoverPluriversalFeatures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully discover a pluriversal feature with CoC Enactment Simulation', async () => {
    const mockResponseText = JSON.stringify({
      featureName: 'Liquidity Viscosity Router',
      description: 'Routes tokenomics through fluid dynamics equations via a Phantom Dimension.',
      edsScore: 0.85,
      cacrRatio: 1.618,
      topology: {
        nodes: [
          { id: 'node1', domain: 'Fluid Dynamics', concept: 'Bernoulli Equation' },
          { id: 'node2', domain: 'Tokenomics', concept: 'Liquidity Pools' }
        ],
        edges: [
          { source: 'node1', target: 'node2', relation: 'PO' }
        ],
        zAxisInferences: [
          { nodeId: 'node2', phantomDimension: 'Viscosity H_k', orthogonalVector: [0, 0, 1] }
        ]
      },
      enactmentSimulation: {
        simulationLanguage: 'Python',
        codePayload: 'def bernoulli_liquidity(pressure, density, velocity):\n    return pressure + 0.5 * density * velocity**2',
        mathematicalProof: 'Proof that energy is conserved across the token boundary layer.',
        isViable: true
      }
    });

    mocks.generateContent.mockResolvedValueOnce({
      text: mockResponseText,
    });

    const result = await discoverPluriversalFeatures('Fluid Dynamics', 'Tokenomics');

    expect(mocks.generateContent).toHaveBeenCalledTimes(1);
    expect(result.featureName).toBe('Liquidity Viscosity Router');
    expect(result.cacrRatio).toBeCloseTo(1.618);
    expect(result.topology.zAxisInferences.length).toBeGreaterThan(0);
    expect(result.enactmentSimulation.isViable).toBe(true);
    expect(result.enactmentSimulation.codePayload).toContain('def bernoulli_liquidity');
  });
});
