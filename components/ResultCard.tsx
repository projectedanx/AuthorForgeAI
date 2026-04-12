
import React from 'react';

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
}

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
