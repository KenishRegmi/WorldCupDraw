// src/App.jsx
import React, { useState } from 'react';
import { SimulatorProvider, useSimulator } from './context/SimulatorContext';
import GroupInput from './components/GroupInput/GroupInput';
import GroupTable from './components/GroupTable/GroupTable';
import ThirdPlaceCalculator from './components/ThirdPlaceCalculator/ThirdPlaceCalculator';
import ThirdPlaceTable from './components/ThirdPlaceTable/ThirdPlaceTable';
import KnockOutBracket from './components/KnockOutBracket/KnockOutBracket';
import './App.css';

const AppContent = () => {
  const { groups } = useSimulator();
  const [activeView, setActiveView] = useState('groups');

  const groupIds = ['A','B','C','D','E','F','G','H','I','J','K','L'];

  return (
    <div className="wc-app">
      <header className="wc-app__header">
        <div className="wc-app__brand">
          <span className="wc-app__badge">WC 2026</span>
          <h1 className="wc-app__title">World Cup 2026 Simulator</h1>
          <p className="wc-app__subtitle">
            Simulate the 12‑group World Cup: groups, third places, and full knockout bracket.
          </p>
        </div>

        <nav className="wc-app__nav">
          <button
            type="button"
            className={
              'wc-app__nav-btn' +
              (activeView === 'groups' ? ' wc-app__nav-btn--active' : '')
            }
            onClick={() => setActiveView('groups')}
          >
            Group stage
          </button>
          <button
            type="button"
            className={
              'wc-app__nav-btn' +
              (activeView === 'third' ? ' wc-app__nav-btn--active' : '')
            }
            onClick={() => setActiveView('third')}
          >
            Third‑place rules
          </button>
          <button
            type="button"
            className={
              'wc-app__nav-btn' +
              (activeView === 'knockout' ? ' wc-app__nav-btn--active' : '')
            }
            onClick={() => setActiveView('knockout')}
          >
            Knockout bracket
          </button>
        </nav>
      </header>

      <main className="wc-app__main">
        {activeView === 'groups' && (
          <>
            <GroupInput />
            <section className="wc-app__groups-layout">
              {groupIds.map((id) => (
                <GroupTable key={id} groupId={id} />
              ))}
            </section>
          </>
        )}

        {activeView === 'third' && (
          <div className="wc-app__third-view">
            <ThirdPlaceCalculator />
            <ThirdPlaceTable />
          </div>
        )}

        {activeView === 'knockout' && (
          <div className="wc-app__knockout-view">
            <KnockOutBracket />
          </div>
        )}
      </main>

      <footer className="wc-app__footer">
        <span>Unofficial World Cup 2026 simulator.</span>
        <span>Format: 12 groups of 4, 32‑team knockout.</span>
      </footer>
    </div>
  );
};

const App = () => (
  <SimulatorProvider>
    <AppContent />
  </SimulatorProvider>
);

export default App;
