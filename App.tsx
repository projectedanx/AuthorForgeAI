
import React from 'react';
import Header from './components/Header';
import NicheValidator from './components/NicheValidator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <NicheValidator />
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by AuthorForge AI &copy; 2024</p>
      </footer>
    </div>
  );
};

export default App;
