import { QualitativeExperienceNode, RetrievalAuditResult, QualitativePayload, SensoryCausalIndicators, CryptographicProvenance } from '../types';
import { v4 as uuidv4 } from 'uuid';


export class TopologyViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TopologyViolationError';
  }
}

/**
 * Qualitative Experience Database (QED) Service
 * Manages ingestion and retrieval of lived experience context bundles.
 */
export class QEDService {
  private database: Map<string, QualitativeExperienceNode> = new Map();

  /**
   * Generates a Verifiable Signature (simulated)
   */
  private generateSignature(payload: any, agentDid: string): string {
    const dataString = JSON.stringify(payload) + agentDid;

    // Using a simplistic hash for browser compatibility in this demo
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16) + 'a8b9c0d1e2f3'; // Pseudo-hex signature

  }

  /**
   * Ingests a new qualitative node into the feature store.
   * Compiles subjective experience into a strict MEMS Executable Context Bundle.
   */
  public ingestNode(
    payload: QualitativePayload,
    indicators: SensoryCausalIndicators,
    alignments: string[],
    agentDid: string
  ): QualitativeExperienceNode {
    const nodeId = `QEN-${uuidv4().substring(0, 8)}-${uuidv4().substring(0, 4)}`;
    const temporalAnchor = new Date().toISOString();

    const nodeWithoutProv = {
      node_id: nodeId,
      temporal_anchor: temporalAnchor,
      qualitative_payload: payload,
      sensory_causal_indicators: indicators,
      ontological_alignments: alignments,
    };

    const signature = this.generateSignature(nodeWithoutProv, agentDid);

    const node: QualitativeExperienceNode = {
      ...nodeWithoutProv,
      cryptographic_provenance: {
        agent_did: agentDid,
        verifiable_signature: signature
      }
    };

    this.database.set(nodeId, node);
    return node;
  }

  /**
   * Evaluates Topological Alignment and Epistemic Escrow triggers
   */
  public evaluateDrift(
    sds: number,
    cfd: number,
    cfi: number,
    wgds: number
  ): RetrievalAuditResult {
    let escrowTriggered = false;
    let reasons: string[] = [];

    // Semantic Drift Score (SDS) > 0.05
    if (sds > 0.05) {
      escrowTriggered = true;
      reasons.push(`Semantic Drift Score (${sds}) exceeded 0.05 threshold.`);
    }

    // Confidence-Fidelity Divergence (CFD) > 0.4
    if (cfd > 0.4) {
      escrowTriggered = true;
      reasons.push(`Confidence-Fidelity Divergence (${cfd}) exceeded 0.4 threshold.`);
    }

    // Cultural Fidelity Index (CFI) < 0.8
    if (cfi < 0.8) {
      escrowTriggered = true;
      reasons.push(`Cultural Fidelity Index (${cfi}) fell below 0.8 threshold.`);
    }

    // Western Gaze Dominance Score (WGDS) > 0.2
    if (wgds > 0.2) {
      escrowTriggered = true;
      reasons.push(`Western Gaze Dominance Score (${wgds}) exceeded 0.2 threshold.`);
    }

    return {
      semanticDriftScore: sds,
      confidenceFidelityDivergence: cfd,
      culturalFidelityIndex: cfi,
      westernGazeDominanceScore: wgds,
      epistemicEscrowTriggered: escrowTriggered,
      escrowReason: escrowTriggered ? reasons.join(' ') : undefined
    };
  }

  /**
   * Retrieves context from the QED through a Semantic Firewall.
   * Throws TopologyViolationError if Epistemic Escrow is triggered.
   */
  public retrieveWithFirewall(
    query: string,
    simulatedSds: number = 0.01,
    simulatedCfd: number = 0.1,
    simulatedCfi: number = 0.9,
    simulatedWgds: number = 0.1
  ): { nodes: QualitativeExperienceNode[], audit: RetrievalAuditResult } {

    // 1. Semantic Firewall & Topological Audit
    const audit = this.evaluateDrift(simulatedSds, simulatedCfd, simulatedCfi, simulatedWgds);

    // 2. Epistemic Escrow Circuit Breaker
    if (audit.epistemicEscrowTriggered) {
      throw new TopologyViolationError(`EPISTEMIC ESCROW TRIGGERED: ${audit.escrowReason}`);
    }

    // Simulated Semantic Retrieval (returning all nodes for prototype)
    const nodes = Array.from(this.database.values());

    return { nodes, audit };
  }
}
