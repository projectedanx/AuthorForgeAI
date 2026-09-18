import React, { useState, useCallback } from 'react';
import { analyzeGatewayArchitecture } from '../services/gatewayArchitectService';
import { TopologyViolationError } from '../services/vulcanValidator';
import type { GatewayArchitectAnalysisResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

const GatewayArchitectAnalyzer: React.FC = () => {
  const [systemContext, setSystemContext] = useState<string>('');
  const [schemaContext, setSchemaContext] = useState<string>('');
  const [result, setResult] = useState<GatewayArchitectAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [epistemicEscrow, setEpistemicEscrow] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!systemContext.trim() || !schemaContext.trim()) {
      setError('Please provide both the system context and schema context.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEpistemicEscrow(null);
    setResult(null);

    try {
      const data = await analyzeGatewayArchitecture(systemContext, schemaContext);
      setResult(data);
    } catch (err: any) {
      if (err instanceof TopologyViolationError) {
        setEpistemicEscrow(err.message);
      } else {
        setError(err.message || 'An unexpected error occurred during gateway analysis.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [systemContext, schemaContext]);

  return (
    <section className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <header className="mb-6 border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center">
          <span className="text-emerald-400 mr-2">⎈</span>
          BFF / Gateway Architect Analyzer
        </h2>
        <p className="text-slate-400 text-sm">
          A harness for Automated Verification of Payload Minimization, Adaptive Rate-Limiting, and SRP Bleed Detection.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="systemContext" className="block text-sm font-medium text-slate-300 mb-2">
            System Context (Architectural Map)
          </label>
          <textarea
            id="systemContext"
            value={systemContext}
            onChange={(e) => setSystemContext(e.target.value)}
            className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
            placeholder="e.g., We have a central API Gateway routing to 15 microservices..."
          />
        </div>
        <div>
          <label htmlFor="schemaContext" className="block text-sm font-medium text-slate-300 mb-2">
            Downstream Schema Context (Contracts)
          </label>
          <textarea
            id="schemaContext"
            value={schemaContext}
            onChange={(e) => setSchemaContext(e.target.value)}
            className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
            placeholder="e.g., ProductService returns { id, name, price, description, internalMetadata }..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Analyzing Architecture...
            </>
          ) : (
            'Run Architectural Harness'
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
          <strong className="block mb-1 font-semibold text-red-300">Analysis Error</strong>
          {error}
        </div>
      )}

      {epistemicEscrow && (
        <div className="mt-6 bg-amber-900/50 border border-amber-500 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-amber-400 text-xl mr-3 mt-0.5">⚠️</span>
            <div>
              <h3 className="text-amber-400 font-bold mb-1">EPISTEMIC ESCROW INITIATED</h3>
              <p className="text-amber-200 font-mono text-sm">{epistemicEscrow}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex justify-between items-center">
             <div>
                 <span className="text-slate-400 text-sm block">Golden Scar Protocol Tension (Autonomy vs Overhead)</span>
             </div>
             <div className="text-right">
                <span className="text-emerald-400 font-mono block">Dominant (BFF): {result.paraconsistentTension.dominantWeight.toFixed(3)}</span>
                <span className="text-slate-500 font-mono block">Subordinate (Overhead): {result.paraconsistentTension.subordinateWeight.toFixed(3)}</span>
             </div>
          </div>

          <ResultCard title="1. Schema Robustness & Payload Minimization" icon="📦">
            <div className="mb-4">
              <span className="text-slate-400 text-sm block mb-1">Robustness Score</span>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${result.schemaRobustness.score * 100}%` }}></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <h4 className="text-sm font-semibold text-slate-300 mb-2">Fallback Evaluation</h4>
                   <p className="text-sm text-slate-400 bg-slate-800 p-2 rounded">{result.schemaRobustness.fallbackEvaluation}</p>
                </div>
                <div>
                   <h4 className="text-sm font-semibold text-slate-300 mb-2">Mutation Tests</h4>
                   <ul className="list-disc list-inside text-sm text-slate-400">
                     {result.schemaRobustness.mutationTestResults.map((test, i) => <li key={i}>{test}</li>)}
                   </ul>
                </div>
            </div>
          </ResultCard>

          <ResultCard title="2. Adaptive Backpressure & Rate-Limiting" icon="⚡">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Dynamic Threshold</h4>
                    <p className="text-xl text-emerald-400 font-mono mb-2">{result.adaptiveBackpressure.dynamicThresholdRequestsPerSecond} RPS</p>
                    <h4 className="text-sm font-semibold text-slate-300 mb-1">Telemetry Factors</h4>
                    <ul className="list-disc list-inside text-sm text-slate-400">
                      {result.adaptiveBackpressure.telemetryFactors.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                </div>
                <div>
                     <h4 className="text-sm font-semibold text-slate-300 mb-2">Load Shedding</h4>
                     <p className="text-sm text-slate-400 bg-slate-800 p-2 rounded mb-2 border-l-2 border-emerald-500">
                         <strong>High Pri:</strong> {result.adaptiveBackpressure.loadSheddingPolicy.highPriorityStrategy}
                     </p>
                     <p className="text-sm text-slate-400 bg-slate-800 p-2 rounded border-l-2 border-rose-500">
                         <strong>Low Pri:</strong> {result.adaptiveBackpressure.loadSheddingPolicy.lowPriorityStrategy}
                     </p>
                </div>
            </div>
          </ResultCard>

          <ResultCard title="3. SRP Bleed & Business Logic Detection" icon="🛡️">
            {result.srpCompliance.detectedLogicBleed.length === 0 ? (
                <p className="text-emerald-400 text-sm">No business logic bleed detected. SRP is maintained.</p>
            ) : (
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Detected Logic Bleed</h4>
                        {result.srpCompliance.detectedLogicBleed.map((bleed, i) => (
                            <div key={i} className="bg-slate-800 p-3 rounded mb-2 border border-slate-700 flex justify-between items-center">
                                <span className="text-sm text-slate-300">{bleed.calculationOrRule}</span>
                                <span className={`text-xs px-2 py-1 rounded font-bold ${
                                    bleed.severity === 'HIGH' ? 'bg-red-900/50 text-red-400' :
                                    bleed.severity === 'MEDIUM' ? 'bg-amber-900/50 text-amber-400' :
                                    'bg-blue-900/50 text-blue-400'
                                }`}>{bleed.severity}</span>
                            </div>
                        ))}
                    </div>
                     <div>
                       <h4 className="text-sm font-semibold text-slate-300 mb-2">Refactoring Recommendations</h4>
                       <ul className="list-disc list-inside text-sm text-slate-400">
                         {result.srpCompliance.refactoringRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                       </ul>
                    </div>
                </div>
            )}
          </ResultCard>
        </div>
      )}
    </section>
  );
};

export default GatewayArchitectAnalyzer;
