/**
 * @fileoverview The root application component.
 * Establishes the global layout and renders the primary Epistemic Window (NicheValidator).
 */

import React from 'react';
import Header from './components/Header';
import NicheValidator from './components/NicheValidator';
import StrategicIntegrationManager from './components/StrategicIntegrationManager';
import GatewayArchitectAnalyzer from './components/GatewayArchitectAnalyzer';


/**
 * Functional component representing the structural core of the AuthorForge UI.
 * Integrates the branding header and the primary interaction node.
 * Applies Negative Space Scaffolding around dynamic content.
 *
 * @returns {React.ReactElement} The complete application layout.
 */
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <GatewayArchitectAnalyzer />
        <NicheValidator />
        <StrategicIntegrationManager />
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by AuthorForge AI &copy; 2024</p>
      </footer>
    </div>
  );
};

export default App;
