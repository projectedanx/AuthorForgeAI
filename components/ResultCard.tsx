/**
 * @fileoverview Defines the ResultCard layout component.
 * Serves as the standard structural container for rendering generative AI outputs
 * within the UI, enforcing a consistent Negative Space Scaffolding around dynamic content.
 */

import React from 'react';

/**
 * Props defining the content structure of a ResultCard.
 *
 * @interface ResultCardProps
 */
interface ResultCardProps {
  /** The heading text displayed at the top of the card. */
  title: string;
  /** The dynamic generative content to be rendered within the card body. */
  children: React.ReactNode;
}

/**
 * Functional component for wrapping content in a styled card layout.
 * Used extensively by the `NicheValidator` and `OutlineGenerator` to segment structured JSON responses.
 *
 * @param {ResultCardProps} props - The properties required to render the card.
 * @returns {React.ReactElement} The styled container block.
 */
const ResultCard: React.FC<ResultCardProps> = ({ title, children }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
      <h3 className="text-xl font-bold text-slate-200 mb-4 border-b border-slate-600 pb-2">{title}</h3>
      <div className="text-slate-300">
        {children}
      </div>
    </div>
  );
};

export default ResultCard;
