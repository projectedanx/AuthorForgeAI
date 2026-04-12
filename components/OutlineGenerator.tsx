import React, { useState, useCallback } from 'react';
import { generateBookOutline } from '../services/geminiService';
import type { BookOutlineResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

interface OutlineGeneratorProps {
  topic: string;
  angle: string;
}

const OutlineGenerator: React.FC<OutlineGeneratorProps> = ({ topic, angle }) => {
  const [outline, setOutline] = useState<BookOutlineResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateOutline = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setOutline(null);

    try {
      const result = await generateBookOutline(topic, angle);
      setOutline(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
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

      {error && <div className="w-full p-4 mb-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">{error}</div>}

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
    </div>
  );
};

export default OutlineGenerator;
