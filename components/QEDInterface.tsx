import React, { useState } from 'react';
import { QEDService, TopologyViolationError } from '../services/qedService';
import { QualitativeExperienceNode, RetrievalAuditResult } from '../types';

export const QEDInterface: React.FC = () => {
  const [qedService] = useState(() => new QEDService());
  const [nodes, setNodes] = useState<QualitativeExperienceNode[]>([]);
  const [query, setQuery] = useState('');
  const [auditResult, setAuditResult] = useState<RetrievalAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ingestion Form State
  const [experienceType, setExperienceType] = useState<'Direct_Trial' | 'Failure_Incident' | 'Socratic_Review'>('Direct_Trial');
  const [rawObservation, setRawObservation] = useState('');
  const [counterfactualVariance, setCounterfactualVariance] = useState('');
  const [cpi, setCpi] = useState<number>(0);
  const [sr, setSr] = useState<number>(0);

  // Simulation controls
  const [simSds, setSimSds] = useState<number>(0.01);
  const [simCfd, setSimCfd] = useState<number>(0.1);
  const [simCfi, setSimCfi] = useState<number>(0.9);
  const [simWgds, setSimWgds] = useState<number>(0.1);


  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newNode = qedService.ingestNode(
        {
          experience_type: experienceType,
          raw_observation: rawObservation,
          counterfactual_variance: counterfactualVariance,
        },
        {
          causal_perturbation_index: cpi,
          structural_roughness: sr,
        },
        ['Ontology-Default'],
        'did:local:user'
      );

      // Clear form
      setRawObservation('');
      setCounterfactualVariance('');

      // Provide visual feedback (could use a toast)
      console.log('Node ingested:', newNode);

      // Update local view if we already queried
      handleQuery(new Event('submit') as unknown as React.FormEvent);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleQuery = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAuditResult(null);
    setNodes([]);

    try {
      const { nodes: retrievedNodes, audit } = qedService.retrieveWithFirewall(
        query,
        simSds,
        simCfd,
        simCfi,
        simWgds
      );
      setNodes(retrievedNodes);
      setAuditResult(audit);
    } catch (err: any) {
      if (err instanceof TopologyViolationError) {
        setError(err.message);
        // We can still try to get the audit result by evaluating directly to show *why* it failed visually
        const audit = qedService.evaluateDrift(simSds, simCfd, simCfi, simWgds);
        setAuditResult(audit);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="bg-[--surface] p-6 rounded-lg border border-[--border] space-y-6">
      <h2 className="text-2xl font-bold text-[--text-primary] mb-4">Qualitative Experience Database (QED)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingestion Panel */}
        <div className="bg-[--surface-variant] p-4 rounded border border-[--border]">
          <h3 className="text-lg font-semibold text-[--text-secondary] mb-2 border-b border-[--border] pb-2">Ingestion Pipeline</h3>
          <form onSubmit={handleIngest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[--text-muted]">Experience Type</label>
              <select
                value={experienceType}
                onChange={(e) => setExperienceType(e.target.value as any)}
                className="mt-1 block w-full rounded-md border-[--border] bg-[--surface] text-[--text-primary] shadow-sm focus:border-[--primary] focus:ring focus:ring-[--primary] focus:ring-opacity-50"
              >
                <option value="Direct_Trial">Direct Trial</option>
                <option value="Failure_Incident">Failure Incident</option>
                <option value="Socratic_Review">Socratic Review</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[--text-muted]">Raw Observation</label>
              <textarea
                value={rawObservation}
                onChange={(e) => setRawObservation(e.target.value)}
                className="mt-1 block w-full rounded-md border-[--border] bg-[--surface] text-[--text-primary] shadow-sm"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[--text-muted]">Counterfactual Variance</label>
              <textarea
                value={counterfactualVariance}
                onChange={(e) => setCounterfactualVariance(e.target.value)}
                className="mt-1 block w-full rounded-md border-[--border] bg-[--surface] text-[--text-primary] shadow-sm"
                rows={2}
                required
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[--text-muted]">Causal Perturbation (0-10)</label>
                <input type="number" min="0" max="10" value={cpi} onChange={e => setCpi(Number(e.target.value))} className="mt-1 block w-full rounded-md border-[--border] bg-[--surface] text-[--text-primary]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[--text-muted]">Structural Roughness (0-1)</label>
                <input type="number" min="0" max="1" step="0.1" value={sr} onChange={e => setSr(Number(e.target.value))} className="mt-1 block w-full rounded-md border-[--border] bg-[--surface] text-[--text-primary]" />
              </div>
            </div>
            <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[--primary] hover:bg-[--primary-hover]">
              Ingest & Cryptographically Seal
            </button>
          </form>
        </div>

        {/* Retrieval & Audit Panel */}
        <div className="space-y-6">
             <div className="bg-[--surface-variant] p-4 rounded border border-[--border]">
                <h3 className="text-lg font-semibold text-[--text-secondary] mb-2 border-b border-[--border] pb-2">Topological Audit Simulation</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                        <label className="block text-xs font-medium text-[--text-muted]">Simulated SDS (Drift)</label>
                        <input type="number" step="0.01" value={simSds} onChange={e => setSimSds(Number(e.target.value))} className="block w-full rounded bg-[--surface] text-[--text-primary] border-[--border] text-sm" />
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-[--text-muted]">Simulated CFD (Divergence)</label>
                        <input type="number" step="0.01" value={simCfd} onChange={e => setSimCfd(Number(e.target.value))} className="block w-full rounded bg-[--surface] text-[--text-primary] border-[--border] text-sm" />
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-[--text-muted]">Simulated CFI (Cultural Fid)</label>
                        <input type="number" step="0.01" value={simCfi} onChange={e => setSimCfi(Number(e.target.value))} className="block w-full rounded bg-[--surface] text-[--text-primary] border-[--border] text-sm" />
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-[--text-muted]">Simulated WGDS (Gaze Dom)</label>
                        <input type="number" step="0.01" value={simWgds} onChange={e => setSimWgds(Number(e.target.value))} className="block w-full rounded bg-[--surface] text-[--text-primary] border-[--border] text-sm" />
                    </div>
                </div>
             </div>

          <div className="bg-[--surface-variant] p-4 rounded border border-[--border]">
            <h3 className="text-lg font-semibold text-[--text-secondary] mb-2 border-b border-[--border] pb-2">Semantic Firewall Retrieval</h3>
            <form onSubmit={handleQuery} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Query database..."
                className="flex-1 rounded-md border-[--border] bg-[--surface] text-[--text-primary]"
              />
              <button type="submit" className="py-2 px-4 border border-[--border] rounded-md shadow-sm text-sm font-medium text-[--text-primary] bg-[--surface] hover:bg-[--surface-variant]">
                Retrieve
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-400 font-mono text-sm break-words">
                {error}
              </div>
            )}

            {auditResult && (
               <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/50 rounded font-mono text-xs text-blue-300">
                    <div>SDS: {auditResult.semanticDriftScore} {auditResult.semanticDriftScore > 0.05 && '⚠️'}</div>
                    <div>CFD: {auditResult.confidenceFidelityDivergence} {auditResult.confidenceFidelityDivergence > 0.4 && '⚠️'}</div>
                    <div>CFI: {auditResult.culturalFidelityIndex} {auditResult.culturalFidelityIndex < 0.8 && '⚠️'}</div>
                    <div>WGDS: {auditResult.westernGazeDominanceScore} {auditResult.westernGazeDominanceScore > 0.2 && '⚠️'}</div>
                    <div className={`mt-2 font-bold ${auditResult.epistemicEscrowTriggered ? 'text-red-400' : 'text-green-400'}`}>
                        EPISTEMIC ESCROW: {auditResult.epistemicEscrowTriggered ? 'ENGAGED' : 'OFF'}
                    </div>
               </div>
            )}

            {nodes.length > 0 && !error && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                <h4 className="text-sm font-medium text-[--text-muted]">Retrieved Context Bundles: {nodes.length}</h4>
                {nodes.map((node) => (
                  <div key={node.node_id} className="p-2 bg-[--surface] border border-[--border] rounded text-xs text-[--text-primary]">
                    <div className="font-mono text-[--primary] mb-1">{node.node_id}</div>
                    <div className="font-semibold">{node.qualitative_payload.experience_type}</div>
                    <div className="italic mb-1">{node.qualitative_payload.raw_observation}</div>
                    <div className="text-[--text-muted]">Signature: {node.cryptographic_provenance.verifiable_signature.substring(0, 16)}...</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
