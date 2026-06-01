import { describe, it, expect, vi } from 'vitest';
import { extrudeOpticalStateMatrix } from './viperService';
import { RCC8Relation } from '../types';
import { ai } from './geminiService';

vi.mock('./geminiService', () => ({
  ai: {
    models: {
      generateContent: vi.fn()
    }
  }
}));

describe('VIPER Service: Analytical-to-Generative Inversion', () => {
  it('extrudes a subjective human prompt into a rigid Optical State Matrix', async () => {
    const mockOsm = {
      width: 1024,
      height: 1024,
      elements: [
        { id: '1', name: 'knight', adjectives: ['lone'], hardwareBoundingBox: { x: 500, y: 700, width: 50, height: 100 } },
        { id: '2', name: 'cliff edge', adjectives: ['steep'], hardwareBoundingBox: { x: 0, y: 800, width: 1024, height: 224 } },
        { id: '3', name: 'giant glowing moon', adjectives: ['giant', 'glowing'], hardwareBoundingBox: { x: 200, y: 50, width: 300, height: 300 } }
      ],
      topologicalConstraints: [
        { subjectId: '1', objectId: '2', relation: RCC8Relation.EC },
        { subjectId: '1', objectId: '3', relation: RCC8Relation.DC }
      ]
    };

    (ai.models.generateContent as any).mockResolvedValueOnce({
      text: JSON.stringify(mockOsm)
    });

    const prompt = 'A moody, cinematic book cover featuring a lone knight standing on a cliff edge beneath a giant glowing moon.';

    const osm = await extrudeOpticalStateMatrix(prompt);

    // Verify matrix dimensions
    expect(osm.width).toBeGreaterThan(0);
    expect(osm.height).toBeGreaterThan(0);

    // Verify elements and Adjectival Bounds
    expect(osm.elements.length).toBeGreaterThanOrEqual(3); // Knight, Cliff, Moon

    const knight = osm.elements.find(e => e.name.toLowerCase().includes('knight'));
    expect(knight).toBeDefined();
    // Hardware grounding verification
    expect(knight!.hardwareBoundingBox).toBeDefined();
    expect(knight!.hardwareBoundingBox.width).toBeGreaterThan(0);

    // Strict adherence to Adjectival Bound (max 2)
    const validAdjectives = knight!.adjectives.filter(a => a !== undefined && a !== null && a !== '');
    expect(validAdjectives.length).toBeLessThanOrEqual(2);

    // Verify topological constraints (RCC-8)
    expect(osm.topologicalConstraints.length).toBeGreaterThan(0);

    // The knight should be externally connected to the cliff
    const cliff = osm.elements.find(e => e.name.toLowerCase().includes('cliff'));
    if (knight && cliff) {
      const knightCliffRelation = osm.topologicalConstraints.find(
        c => (c.subjectId === knight.id && c.objectId === cliff.id) ||
             (c.subjectId === cliff.id && c.objectId === knight.id)
      );

      expect(knightCliffRelation).toBeDefined();
      expect(knightCliffRelation?.relation).toBe(RCC8Relation.EC);
    }
  });
});
