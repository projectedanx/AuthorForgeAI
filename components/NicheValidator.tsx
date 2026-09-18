/**
 * @fileoverview Defines the NicheValidator component.
 * Acts as the primary entry point for user intent, orchestrating the initial market analysis
 * and rendering the primary Epistemic Escrow alerts if VULCAN detects a topology violation.
 */

import { TopologyViolationError } from '../services/vulcanValidator';
import type { JustifiedUncertaintyReport } from '../types';

import React, { useState, useCallback } from 'react';
import { validateNiche } from '../services/geminiService';
import type { AnalysisResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';
import OutlineGenerator from './OutlineGenerator';

/**
 * Functional component managing the state and UI for validating an initial book topic/niche.
 * Integrates directly with the validateNiche service, which applies Failure-Informed Prompt Inversion (FIPI).
 *
 * @returns {React.ReactElement} The NicheValidator interface.
 */
const NicheValidator: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uncertaintyReport, setUncertaintyReport] = useState<JustifiedUncertaintyReport | null>(null);
  const [selectedAngle, setSelectedAngle] = useState<string | null>(null);

  /**
   * Orchestrates the market analysis process.
   * Transmits the high-entropy user input to the backend, updating UI state based on
   * structural validation (VULCAN) or generative success, utilizing Failure-Informed Prompt Inversion (FIPI).
   *
   * @async
   * @function handleAnalyze
   * @returns {Promise<void>}
   */
  const handleAnalyze = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or idea.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setUncertaintyReport(null);
    setAnalysis(null);
    setSelectedAngle(null);

    try {
      const result = await validateNiche(topic);
      setAnalysis(result);
    } catch (err: unknown) {
      if (err instanceof TopologyViolationError || (err as any).name === 'TopologyViolationError') {
        setUncertaintyReport((err as any).report);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  return (
    <section className="max-w-4xl mx-auto flex flex-col items-center gap-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-2xl shadow-indigo-900/20">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-100">Niche & Trend Validator</h2>
        <p className="text-slate-400 mt-2 max-w-2xl">
          Enter your passion, expertise, or book idea below. Our AI will analyze market data to find profitable niches and trending topics for your next bestseller.
        </p>
      </div>

      <div className="w-full flex flex-col gap-4">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., 'Sustainable urban gardening for beginners', 'A fantasy novel about elemental magic', 'Productivity hacks for remote workers'..."
          className="w-full h-32 p-4 bg-slate-900 border border-slate-600 rounded-lg text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300 resize-none"
          disabled={isLoading}
        />
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Analyzing Market...
            </>
          ) : (
            'Validate My Idea'
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
          <p className="text-sm font-mono mt-4 pt-4 border-t border-amber-800">
            <strong className="text-amber-500">CFDI Score:</strong> {uncertaintyReport.cfdiScore}
          </p>
        </div>
      )}

      {analysis && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 animate-fade-in">
          <ResultCard title="Profitable Niches">
            <ul className="space-y-3">
              {analysis.profitableNiches.map((item, index) => (
                <li key={index}>
                  <strong className="text-indigo-400">{item.niche}</strong>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </li>
              ))}
            </ul>
          </ResultCard>
          <ResultCard title="Trending Topics">
             <ul className="space-y-3">
              {analysis.trendingTopics.map((item, index) => (
                <li key={index}>
                  <strong className="text-indigo-400">{item.trend}</strong>
                  <p className="text-slate-400 text-sm">{item.reasoning}</p>
                </li>
              ))}
            </ul>
          </ResultCard>
          <ResultCard title="High-Value Keywords">
            <ul className="space-y-2">
              {analysis.keywords.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-slate-300">{item.keyword}</span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{item.platform}</span>
                </li>
              ))}
            </ul>
          </ResultCard>
          <ResultCard title="Unique Angles to Stand Out">
            <ul className="space-y-4">
              {analysis.uniqueAngles.map((item, index) => (
                <li key={index} className="flex flex-col gap-2">
                  <div>
                    <strong className="text-indigo-400">{item.angle}</strong>
                    <p className="text-slate-400 text-sm">{item.strategy}</p>
                  </div>
                  <button
                    onClick={() => setSelectedAngle(item.angle)}
                    className="self-start text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 px-3 py-1.5 rounded-md transition duration-200 border border-indigo-500/30"
                  >
                    Generate Outline for this Angle
                  </button>
                </li>
              ))}
            </ul>
          </ResultCard>
        </div>
      )}

      {selectedAngle && (
        <div className="w-full animate-fade-in-up">
          <OutlineGenerator topic={topic} angle={selectedAngle} />
        </div>
      )}
    </section>
  );
};

export default NicheValidator;
