import ViperVisualizer from "./ViperVisualizer";
/**
 * @fileoverview Defines the OutlineGenerator component.
 * Responsible for managing the UI state for generating initial book outlines and subsequently
 * applying the Context-Mediated Domain Adaptation (CMDA) refinement process.
 */

import { TopologyViolationError } from '../services/vulcanValidator';
import type { JustifiedUncertaintyReport } from '../types';
import React, { useState, useCallback } from 'react';
import { generateBookOutline, refineOutlineCMDA } from '../services/geminiService';
import type { BookOutlineResult, CMDARefinementResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

/**
 * Props defining the initial context required to generate an outline.
 *
 * @interface OutlineGeneratorProps
 */
interface OutlineGeneratorProps {
  /** The base topic validated by the parent component. */
  topic: string;
  /** The specific, unique angle the outline should focus on. */
  angle: string;
}

/**
 * Functional component that orchestrates the generative outline process.
 * Acts as a secondary Epistemic Window, capable of displaying VULCAN escrow events.
 *
 * @param {OutlineGeneratorProps} props - The topic and angle context.
 * @returns {React.ReactElement} The rendered OutlineGenerator interface.
 */
const OutlineGenerator: React.FC<OutlineGeneratorProps> = ({ topic, angle }) => {
  const [outline, setOutline] = useState<BookOutlineResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uncertaintyReport, setUncertaintyReport] = useState<JustifiedUncertaintyReport | null>(null);

  const [humanConstraint, setHumanConstraint] = useState<string>('');
  const [refinedOutline, setRefinedOutline] = useState<CMDARefinementResult | null>(null);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  /**
   * Orchestrates the CMDA refinement process.
   * Invokes the Gemini service to topologically sculpt the existing outline based on a new contradictory human constraint,
   * holding the tension using paraconsistent logic.
   *
   * @async
   * @function handleRefineOutline
   * @returns {Promise<void>}
   */
  const handleRefineOutline = useCallback(async () => {
    if (!outline || !humanConstraint.trim()) return;
    setIsRefining(true);
    setRefineError(null);
    setRefinedOutline(null);

    try {
      const result = await refineOutlineCMDA(topic, angle, outline, humanConstraint);
      setRefinedOutline(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setRefineError(err.message);
      } else {
        setRefineError('An unexpected error occurred during CMDA refinement.');
      }
    } finally {
      setIsRefining(false);
    }
  }, [topic, angle, outline, humanConstraint]);

  /**
   * Orchestrates the initial book outline generation process.
   * Handles asynchronous communication with the Gemini service and updates state based on
   * successful generation, standard errors, or Epistemic Escrow triggers (TopologyViolationError).
   *
   * @async
   * @function handleGenerateOutline
   * @returns {Promise<void>}
   */
  const handleGenerateOutline = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setUncertaintyReport(null);
    setOutline(null);

    try {
      const result = await generateBookOutline(topic, angle);
      setOutline(result);
    } catch (err: unknown) {
      if (err instanceof TopologyViolationError || (err as any).name === 'TopologyViolationError') {
        setUncertaintyReport((err as any).report);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during outline generation.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [topic, angle]);

  return (
    <div className="mt-6 p-6 bg-slate-800 rounded-lg border border-indigo-500/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100">Generate Book Outline</h3>
          <p className="text-sm text-slate-400 mt-1">
            Generate an outline for <span className="text-indigo-400 font-semibold">{topic}</span> focusing on the angle: <span className="italic text-slate-300">"{angle}"</span>
          </p>
        </div>
        <button
          onClick={handleGenerateOutline}
          disabled={isLoading}
          className="whitespace-nowrap py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Generating...
            </>
          ) : (
            'Generate Outline'
          )}
        </button>
      </div>

            {error && !uncertaintyReport && <div className="w-full p-4 mb-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">{error}</div>}

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

      {outline && (
        <div className="space-y-6 animate-fade-in">
          <ResultCard title="Catchy Title Ideas">
            <ul className="list-disc list-inside space-y-1">
              {outline.titleIdeas.map((title, idx) => (
                <li key={idx} className="text-indigo-300 font-medium">{title}</li>
              ))}
            </ul>
          </ResultCard>

          <ResultCard title="Target Audience">
            <p className="text-slate-300 leading-relaxed">{outline.targetAudience}</p>
          </ResultCard>

          <ResultCard title="Chapter-by-Chapter Outline">
            <div className="space-y-4">
              {outline.chapters.map((chapter) => (
                <div key={chapter.chapterNumber} className="border-l-2 border-indigo-500/50 pl-4 py-1">
                  <h4 className="text-lg font-semibold text-slate-200">
                    Chapter {chapter.chapterNumber}: <span className="text-indigo-400">{chapter.title}</span>
                  </h4>
                  <p className="text-slate-400 text-sm mt-1">{chapter.summary}</p>
                </div>
              ))}
            </div>
          </ResultCard>
        </div>
      )}

      {outline && (
        <div className="mt-8 pt-8 border-t border-slate-700 animate-fade-in">
          <h3 className="text-xl font-bold text-slate-100 mb-2">Apply CMDA Refiner</h3>
          <p className="text-sm text-slate-400 mb-4">
            Inject a tacit human constraint or contradictory directive to topologically sculpt the outline using paraconsistent logic.
          </p>
          <div className="flex flex-col gap-4">
            <textarea
              value={humanConstraint}
              onChange={(e) => setHumanConstraint(e.target.value)}
              placeholder="e.g., 'Target enterprise executives but write entirely in Gen-Z slang'"
              className="w-full h-24 p-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300 resize-none"
              disabled={isRefining}
            />
            <button
              onClick={handleRefineOutline}
              disabled={isRefining || !humanConstraint.trim()}
              className="self-end py-2 px-6 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-600 disabled:bg-slate-700 disabled:text-slate-500 transition duration-300 flex items-center justify-center gap-2"
            >
              {isRefining ? (
                <>
                  <LoadingSpinner />
                  Sculpting...
                </>
              ) : (
                'Apply CMDA Refinement'
              )}
            </button>
          </div>

          {refineError && <div className="w-full p-4 mt-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">{refineError}</div>}

          {refinedOutline && (
             <div className="mt-6 space-y-6 animate-fade-in-up">
               <ResultCard title="Contradiction Resolution Strategy">
                 <p className="text-slate-300 leading-relaxed">{refinedOutline.contradictionResolution}</p>
                 <div className="mt-2 text-xs text-slate-500">
                   CFDI Score: <span className="font-mono text-indigo-400">{refinedOutline.cfdiScore}</span>
                 </div>
               </ResultCard>

               <ResultCard title="Refined Chapters">
                 <div className="space-y-4">
                   {refinedOutline.refinedChapters.map((chapter) => (
                     <div key={chapter.chapterNumber} className="border-l-2 border-indigo-400/80 pl-4 py-1 bg-slate-900/30 rounded-r-md">
                       <h4 className="text-lg font-semibold text-slate-200">
                         Chapter {chapter.chapterNumber}: <span className="text-indigo-300">{chapter.title}</span>
                       </h4>
                       <p className="text-slate-400 text-sm mt-1">{chapter.summary}</p>
                     </div>
                   ))}
                 </div>
               </ResultCard>
             </div>
          )}
        </div>
      )}

    </div>
  );
};

export default OutlineGenerator;
