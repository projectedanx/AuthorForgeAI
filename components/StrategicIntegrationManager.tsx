import React, { useState, useCallback } from 'react';
import { generateStrategicWorkflow } from '../services/pmPersonaService';
import { TopologyViolationError } from '../services/vulcanValidator';
import type { StrategicIntegrationResult, JustifiedUncertaintyReport } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

const StrategicIntegrationManager: React.FC = () => {
  const [systemSpec, setSystemSpec] = useState<string>('');
  const [humanConstraint, setHumanConstraint] = useState<string>('');
  const [result, setResult] = useState<StrategicIntegrationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uncertaintyReport, setUncertaintyReport] = useState<JustifiedUncertaintyReport | null>(null);

  const handleIntegrate = useCallback(async () => {
    if (!systemSpec.trim() || !humanConstraint.trim()) {
      setError('Please provide both the system specification and the human constraint.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setUncertaintyReport(null);
    setResult(null);

    try {
      const integrationResult = await generateStrategicWorkflow(systemSpec, humanConstraint);
      setResult(integrationResult);
    } catch (err: unknown) {
      if (err instanceof TopologyViolationError || (err as any).name === 'TopologyViolationError') {
        setUncertaintyReport((err as any).report);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during strategic integration.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [systemSpec, humanConstraint]);

  return (
    <section className="max-w-4xl mx-auto flex flex-col items-center gap-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-2xl shadow-emerald-900/20 mt-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-emerald-400">Strategic Integration Manager</h2>
        <p className="text-slate-400 mt-2 max-w-2xl">
          Enter your deterministic system-first specification along with any contradictory human constraints.
          The PM Persona will orchestrate an operational workflow using the Zachman Framework,
          holding contradictions in paraconsistent tension without sycophantic averaging.
        </p>
      </div>

      <div className="w-full flex flex-col gap-4">
        <textarea
          value={systemSpec}
          onChange={(e) => setSystemSpec(e.target.value)}
          placeholder="System-First Specification (e.g., 'We need a highly available distributed architecture...')"
          className="w-full h-24 p-4 bg-slate-900 border border-slate-600 rounded-lg text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition duration-300 resize-none"
          disabled={isLoading}
        />
        <textarea
          value={humanConstraint}
          onChange={(e) => setHumanConstraint(e.target.value)}
          placeholder="Tacit Human Constraint / Contradiction (e.g., 'But it must be built as a monolith for speed of delivery.')"
          className="w-full h-24 p-4 bg-slate-900 border border-slate-600 rounded-lg text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition duration-300 resize-none"
          disabled={isLoading}
        />
        <button
          onClick={handleIntegrate}
          disabled={isLoading}
          className="w-full py-3 px-6 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Calculating Topology...
            </>
          ) : (
            'Generate Deterministic Workflow'
          )}
        </button>
      </div>

      {error && !uncertaintyReport && (
        <div className="w-full p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">{error}</div>
      )}

      {uncertaintyReport && (
        <div className="w-full p-6 bg-amber-900/40 border border-amber-600 text-amber-100 rounded-lg shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚠️</span>
            <h3 className="font-bold text-xl text-amber-400">Epistemic Escrow Triggered (VULCAN)</h3>
          </div>
          <p className="mb-4 text-amber-200">{uncertaintyReport.message}</p>
          <div className="mb-4">
            <strong className="text-amber-500 uppercase text-sm tracking-wider">Violated Constraints:</strong>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              {uncertaintyReport.violatedConstraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
          <div className="mb-4">
            <strong className="text-amber-500 uppercase text-sm tracking-wider">Corrective Proposals:</strong>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              {uncertaintyReport.correctiveProposals.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </div>
      )}

      {result && (
        <div className="w-full space-y-6 animate-fade-in">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 flex flex-col items-center justify-center">
                   <span className="text-sm text-slate-400 mb-1">Confidence Score</span>
                   <span className="text-2xl font-bold text-emerald-400 font-mono">{result.personaConfidenceScore.toFixed(2)}</span>
               </div>
               <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 flex flex-col items-center justify-center">
                   <span className="text-sm text-slate-400 mb-1">Topological Derivative</span>
                   <span className="text-2xl font-bold text-indigo-400 font-mono">{result.topologicalDerivative.toFixed(2)}</span>
               </div>
               <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 flex flex-col items-center justify-center">
                   <span className="text-sm text-slate-400 mb-1">Golden Scar Ratio</span>
                   <span className="text-lg font-bold text-amber-400 font-mono text-center">
                      {result.paraconsistentTension.dominantWeight} : {result.paraconsistentTension.subordinateWeight}
                   </span>
               </div>
           </div>

          <ResultCard title="Zachman Framework Operational Workflow">
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-slate-300">
                 <thead className="text-xs text-slate-400 uppercase bg-slate-900 border-b border-slate-700">
                   <tr>
                     <th className="px-4 py-3">Interrogative</th>
                     <th className="px-4 py-3">Perspective</th>
                     <th className="px-4 py-3">Artifact</th>
                     <th className="px-4 py-3">Description</th>
                   </tr>
                 </thead>
                 <tbody>
                   {result.workflow.cells.map((cell, index) => (
                     <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                       <td className="px-4 py-3 font-semibold text-emerald-300">{cell.interrogative}</td>
                       <td className="px-4 py-3">{cell.perspective}</td>
                       <td className="px-4 py-3 text-indigo-300">{cell.artifact}</td>
                       <td className="px-4 py-3">{cell.description}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </ResultCard>
        </div>
      )}
    </section>
  );
};

export default StrategicIntegrationManager;
