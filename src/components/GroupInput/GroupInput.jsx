import React, { useState } from 'react';
import { useSimulator } from '../../SimulatorContext';
import './GroupInput.css';

const GroupInput = () => {
  const { groups, updateGroupMatch, resetAll, exportResults, importResults } = useSimulator();
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const handleScoreChange = (matchId, teamType, value) => {
    const group = groups[selectedGroup];
    if (!group) return;

    const match = group.matches.find(m => m.id === matchId);
    if (!match) return;

    const homeScore = teamType === 'home' ? value : match.homeScore;
    const awayScore = teamType === 'away' ? value : match.awayScore;

    updateGroupMatch(selectedGroup, matchId, homeScore, awayScore);
  };

  const handleImport = () => {
    if (importText.trim()) {
      importResults(importText);
      setImportText('');
      setShowImport(false);
    }
  };

  return (
    <div className="group-input-container">
      <div className="group-selector">
        <h3>Select Group to Input Results</h3>
        <div className="group-buttons">
          {['A','B','C','D','E','F','G','H','I','J','K','L'].map(group => (
            <button
              key={group}
              className={`group-button ${selectedGroup === group ? 'active' : ''}`}
              onClick={() => setSelectedGroup(group)}
            >
              Group {group}
            </button>
          ))}
        </div>
      </div>

      {groups[selectedGroup] && (
        <div className="match-inputs">
          <h4>Group {selectedGroup} Matches</h4>
          {groups[selectedGroup].matches.map(match => (
            <div key={match.id} className="match-input">
              <div className="teams">
                <span className="team-name">{match.home.name}</span>
                <span className="vs">vs</span>
                <span className="team-name">{match.away.name}</span>
              </div>
              <div className="score-inputs">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={match.homeScore ?? ''}
                  onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                  className="score-input"
                  placeholder="0"
                />
                <span className="dash">-</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={match.awayScore ?? ''}
                  onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                  className="score-input"
                  placeholder="0"
                />
              </div>
              <div className={`match-status ${match.played ? 'played' : 'pending'}`}>
                {match.played ? '✓ Played' : 'Pending'}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="actions-panel">
        <button onClick={resetAll} className="action-button reset">
          Reset All Groups
        </button>
        <button onClick={exportResults} className="action-button export">
          Export Results (CSV)
        </button>
        <button 
          onClick={() => setShowImport(!showImport)} 
          className="action-button import"
        >
          Import Results
        </button>
      </div>

      {showImport && (
        <div className="import-panel">
          <h4>Import CSV Results</h4>
          <p>Paste CSV data in format: Group,Match,Home,Away,HomeScore,AwayScore</p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="A,A1,Mexico,South Africa,2,1&#10;A,A2,Korea Republic,Playoff Winner,1,0"
            rows={6}
            className="import-textarea"
          />
          <div className="import-actions">
            <button onClick={handleImport} className="action-button">
              Import
            </button>
            <button onClick={() => setShowImport(false)} className="action-button cancel">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupInput;