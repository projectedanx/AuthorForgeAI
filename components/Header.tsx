
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 text-center border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                AuthorForge AI
            </h1>
            <p className="text-slate-400 mt-2">The Intelligent Publishing & Marketing Co-Pilot</p>
        </div>
    </header>
  );
};

export default Header;
