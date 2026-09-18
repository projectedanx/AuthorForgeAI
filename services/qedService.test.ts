import { describe, it, expect, beforeEach } from 'vitest';
import { QEDService, TopologyViolationError } from './qedService';
import { QualitativePayload, SensoryCausalIndicators } from '../types';

describe('QEDService', () => {
  let service: QEDService;

  beforeEach(() => {
    service = new QEDService();
  });

  describe('ingestNode', () => {
    it('should successfully ingest a QualitativeExperienceNode and seal it with cryptographic provenance', () => {
      const payload: QualitativePayload = {
        experience_type: 'Direct_Trial',
        raw_observation: 'System latency spiked during unboxing.',
        counterfactual_variance: 'Expected smooth operation, but observed 500ms delay.',
      };
      const indicators: SensoryCausalIndicators = {
        causal_perturbation_index: 8,
        structural_roughness: 0.9,
      };
      const alignments = ['OntologyA', 'OntologyB'];
      const agentDid = 'did:example:12345';

      const node = service.ingestNode(payload, indicators, alignments, agentDid);

      expect(node).toBeDefined();
      expect(node.node_id).toMatch(/^QEN-[a-f0-9]{8}-[a-f0-9]{4}$/);
      expect(node.temporal_anchor).toBeDefined();
      expect(node.qualitative_payload).toEqual(payload);
      expect(node.sensory_causal_indicators).toEqual(indicators);
      expect(node.ontological_alignments).toEqual(alignments);
      expect(node.cryptographic_provenance).toBeDefined();
      expect(node.cryptographic_provenance.agent_did).toBe(agentDid);
      expect(node.cryptographic_provenance.verifiable_signature).toBeDefined();
    });
  });

  describe('evaluateDrift', () => {
    it('should not trigger Epistemic Escrow for normal values', () => {
      const result = service.evaluateDrift(0.01, 0.1, 0.9, 0.1);
      expect(result.epistemicEscrowTriggered).toBe(false);
      expect(result.escrowReason).toBeUndefined();
    });

    it('should trigger Epistemic Escrow if SDS > 0.05', () => {
      const result = service.evaluateDrift(0.06, 0.1, 0.9, 0.1);
      expect(result.epistemicEscrowTriggered).toBe(true);
      expect(result.escrowReason).toContain('Semantic Drift Score');
    });

    it('should trigger Epistemic Escrow if CFD > 0.4', () => {
      const result = service.evaluateDrift(0.01, 0.5, 0.9, 0.1);
      expect(result.epistemicEscrowTriggered).toBe(true);
      expect(result.escrowReason).toContain('Confidence-Fidelity Divergence');
    });

    it('should trigger Epistemic Escrow if CFI < 0.8', () => {
      const result = service.evaluateDrift(0.01, 0.1, 0.7, 0.1);
      expect(result.epistemicEscrowTriggered).toBe(true);
      expect(result.escrowReason).toContain('Cultural Fidelity Index');
    });

    it('should trigger Epistemic Escrow if WGDS > 0.2', () => {
      const result = service.evaluateDrift(0.01, 0.1, 0.9, 0.3);
      expect(result.epistemicEscrowTriggered).toBe(true);
      expect(result.escrowReason).toContain('Western Gaze Dominance Score');
    });

    it('should accumulate multiple reasons if several thresholds are breached', () => {
        const result = service.evaluateDrift(0.06, 0.5, 0.7, 0.3);
        expect(result.epistemicEscrowTriggered).toBe(true);
        expect(result.escrowReason).toContain('Semantic Drift Score');
        expect(result.escrowReason).toContain('Confidence-Fidelity Divergence');
        expect(result.escrowReason).toContain('Cultural Fidelity Index');
        expect(result.escrowReason).toContain('Western Gaze Dominance Score');
    });
  });

  describe('retrieveWithFirewall', () => {
    it('should return nodes and audit result when Epistemic Escrow is not triggered', () => {
      service.ingestNode(
        { experience_type: 'Direct_Trial', raw_observation: 'obs', counterfactual_variance: 'var' },
        { causal_perturbation_index: 1, structural_roughness: 0.1 },
        [],
        'did:1'
      );

      const { nodes, audit } = service.retrieveWithFirewall('test query');
      expect(nodes.length).toBe(1);
      expect(audit.epistemicEscrowTriggered).toBe(false);
    });

    it('should throw TopologyViolationError when Epistemic Escrow is triggered', () => {
      expect(() => {
        service.retrieveWithFirewall('test query', 0.1, 0.1, 0.9, 0.1);
      }).toThrowError(TopologyViolationError);

      expect(() => {
        service.retrieveWithFirewall('test query', 0.1, 0.1, 0.9, 0.1);
      }).toThrow(/EPISTEMIC ESCROW TRIGGERED/);
    });
  });
});
