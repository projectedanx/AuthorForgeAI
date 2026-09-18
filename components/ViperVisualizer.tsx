/**
 * @fileoverview Defines the ViperVisualizer component.
 * Acts as the UI layer for V.I.P.E.R. (Visual Intent & Physical Execution Router),
 * translating subjective visual desire into a rigid Optical State Matrix (OSM).
 */

import React, { useState } from 'react';
import { OpticalStateMatrix } from '../types';
import { extrudeOpticalStateMatrix } from '../services/viperService';
import LoadingSpinner from './LoadingSpinner';

/**
 * Functional component managing the state and UI for visual extrusion.
 * Captures subjective human visual prompts and enforces Hardware Forced Physicality
 * and Spatial Bind (RCC-8) via the underlying V.I.P.E.R. service.
 *
 * @returns {React.ReactElement} The ViperVisualizer interface.
 */
const ViperVisualizer: React.FC = () => {
  const [visualPrompt, setVisualPrompt] = useState<string>('');
  const [osm, setOsm] = useState<OpticalStateMatrix | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Orchestrates the extrusion of subjective visual intent into a rigid Optical State Matrix (OSM).
   * Communicates with the VIPER service to ensure output adheres to topological constraints
   * and Adjectival Bounds, preventing Semantic Saponification.
   *
   * @async
   * @function handleExtrude
   * @returns {Promise<void>} Resolves when the extrusion is complete.
   */
  const handleExtrude = async () => {
    if (!visualPrompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setOsm(null);

    try {
      const result = await extrudeOpticalStateMatrix(visualPrompt);
      setOsm(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during OSM extrusion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-700 animate-fade-in">
      <h3 className="text-xl font-bold text-slate-100 mb-2">V.I.P.E.R. Visual Extrusion</h3>
      <p className="text-sm text-slate-400 mb-4">
        Translate subjective visual desire into a rigid Optical State Matrix (OSM).
      </p>

      <div className="flex flex-col gap-4">
        <textarea
          value={visualPrompt}
          onChange={(e) => setVisualPrompt(e.target.value)}
          placeholder="e.g., 'A moody cinematic book cover featuring a lone knight on a cliff...'"
          className="w-full h-24 p-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300 resize-none"
          disabled={isLoading}
        />
        <button
          onClick={handleExtrude}
          disabled={isLoading || !visualPrompt.trim()}
          className="self-end py-2 px-6 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-600 disabled:bg-slate-700 disabled:text-slate-500 transition duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Extruding Matrix...
            </>
          ) : (
            'Extrude OSM'
          )}
        </button>
      </div>

      {error && (
        <div className="w-full p-4 mt-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {osm && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
             <h4 className="font-bold text-indigo-400 mb-2">Physical Bounds</h4>
             <p className="text-sm font-mono text-slate-300">
               Dimensions: {osm.width}px x {osm.height}px
             </p>
          </div>

          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
             <h4 className="font-bold text-indigo-400 mb-2">Matrix Elements</h4>
             <ul className="space-y-3">
               {osm.elements.map(el => (
                 <li key={el.id} className="text-sm text-slate-300 border-b border-slate-700/50 pb-2 last:border-0 last:pb-0">
                   <div className="font-semibold text-slate-100">{el.name}</div>
                   <div className="text-xs text-slate-400 font-mono mt-1">
                     Bounds: [x:{el.hardwareBoundingBox.x}, y:{el.hardwareBoundingBox.y}, w:{el.hardwareBoundingBox.width}, h:{el.hardwareBoundingBox.height}]
                   </div>
                   {el.adjectives && el.adjectives.filter(a => a).length > 0 && (
                     <div className="text-xs text-indigo-300 mt-1">
                       Adjectives: {el.adjectives.filter(a => a).join(', ')}
                     </div>
                   )}
                 </li>
               ))}
             </ul>
          </div>

          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
             <h4 className="font-bold text-indigo-400 mb-2">Topological Constraints (RCC-8)</h4>
             <ul className="space-y-2">
               {osm.topologicalConstraints.map((tc, idx) => (
                 <li key={idx} className="text-sm font-mono text-slate-300">
                   [{tc.subjectId}] <span className="text-amber-400">{tc.relation}</span> [{tc.objectId}]
                 </li>
               ))}
             </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViperVisualizer;
