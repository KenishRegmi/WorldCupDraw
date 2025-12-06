import React, { useState } from 'react';
import { SimulatorProvider } from './SimulatorContext';
import GroupInput from './components/GroupInput/GroupInput';
import GroupTable from './components/GroupTable/GroupTable';
import ThirdPlaceCalculator from './components/ThirdPlaceCalculator/ThirdPlaceCalculator';
import ThirdPlaceTable from './components/ThirdPlaceTable/ThirdPlaceTable';
import KnockOutBracket from './components/KnockOutBracket/KnockOutBracket';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('groups');

  return (
    <SimulatorProvider>
      <div className="app">
        <header className="app-header">
          <h1>🏆 2026 World Cup Simulator</h1>
          <p>Predict matches and simulate the entire tournament</p>
          <div className="tournament-info">
            <span>48 Teams • 12 Groups • 104 Matches</span>
            <span>USA • Canada • Mexico</span>
          </div>
        </header>

        <nav className="app-nav">
          <button 
            className={activeView === 'groups' ? 'active' : ''}
            onClick={() => setActiveView('groups')}
          >
            <span className="nav-icon">⚽</span>
            Group Stage
          </button>
          <button 
            className={activeView === 'thirdPlace' ? 'active' : ''}
            onClick={() => setActiveView('thirdPlace')}
          >
            <span className="nav-icon">📊</span>
            Third Place Table
          </button>
          <button 
            className={activeView === 'knockout' ? 'active' : ''}
            onClick={() => setActiveView('knockout')}
          >
            <span className="nav-icon">🏆</span>
            Knockout Bracket
          </button>
        </nav>

        <main className="app-main">
          {activeView === 'groups' && (
            <>
              <GroupInput />
              <ThirdPlaceCalculator />
              <div className="groups-container">
                {['A','B','C','D','E','F','G','H','I','J','K','L'].map(group => (
                  <GroupTable key={group} groupId={group} />
                ))}
              </div>
            </>
          )}
          
          {activeView === 'thirdPlace' && (
            <ThirdPlaceTable />
          )}
          
          {activeView === 'knockout' && (
            <KnockOutBracket />
          )}
        </main>

        <footer className="app-footer">
          <p>FIFA World Cup 2026 Simulator • Data based on official tournament format</p>
          <p className="disclaimer">
            This is a simulation tool for educational purposes. Team rankings and results are simulated.
          </p>
        </footer>
      </div>
    </SimulatorProvider>
  );
}

export default App;