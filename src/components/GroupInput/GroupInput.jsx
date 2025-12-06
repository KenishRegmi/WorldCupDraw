// src/components/GroupInput/GroupInput.jsx
import React, { useState } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import './GroupInput.css';

const GroupInput = () => {
  const { groups, updateGroupMatch, resetAll, exportResults, importResults } = useSimulator();
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const groupIds = ['A','B','C','D','E','F','G','H','I','J','K','L'];

  const normalizeInput = (raw) => {
    // keep only digits
    let digits = raw.replace(/\D/g, '');
    // strip leading zeros but keep a single zero if that's what user wants
    digits = digits.replace(/^0+(?=\d)/, '');
    // limit to reasonable length (e.g. 2 digits for goals)
    digits = digits.slice(0, 2);
    return digits;
  };

  const handleScoreChange = (matchId, teamType, raw) => {
    const group = groups[selectedGroup];
    if (!group) return;

    const match = group.matches.find((m) => m.id === matchId);
    if (!match) return;

    const cleaned = normalizeInput(raw);

    if (cleaned === '') {
      const homeScore = teamType === 'home' ? null : match.homeScore;
      const awayScore = teamType === 'away' ? null : match.awayScore;
      updateGroupMatch(selectedGroup, matchId, homeScore, awayScore);
      return;
    }

    const num = Number(cleaned);

    const homeScore = teamType === 'home' ? num : match.homeScore ?? 0;
    const awayScore = teamType === 'away' ? num : match.awayScore ?? 0;

    updateGroupMatch(selectedGroup, matchId, homeScore, awayScore);
  };

  const displayScore = (score) => (score === null || score === undefined ? '' : String(score));

  const handleImport = () => {
    if (!importText.trim()) return;
    importResults(importText);
    setImportText('');
    setShowImport(false);
  };

  const currentGroup = groups[selectedGroup];

  return (
    <div className="group-input">
      {/* Global actions bar */}
      <div className="group-input__topbar">
        <div className="group-input__topbar-text">
          <h3 className="group-input__title">Group results input</h3>
          <p className="group-input__subtitle">
            Enter scores for each group match, or import/export results as CSV.
          </p>
        </div>
        <div className="group-input__topbar-actions">
          <button
            type="button"
            onClick={resetAll}
            className="group-input__action group-input__action--reset"
          >
            Reset tournament
          </button>
          <button
            type="button"
            onClick={exportResults}
            className="group-input__action group-input__action--export"
          >
            Export results (CSV)
          </button>
          <button
            type="button"
            onClick={() => setShowImport((v) => !v)}
            className="group-input__action group-input__action--import"
          >
            {showImport ? 'Hide import' : 'Import results'}
          </button>
        </div>
      </div>

      {/* Group selector */}
      <div className="group-input__selector">
        <h4 className="group-input__selector-title">Select group</h4>
        <div className="group-input__buttons">
          {groupIds.map((id) => (
            <button
              key={id}
              type="button"
              className={
                'group-input__button' +
                (selectedGroup === id ? ' group-input__button--active' : '')
              }
              onClick={() => setSelectedGroup(id)}
            >
              Group {id}
            </button>
          ))}
        </div>
      </div>

      {/* Matches for current group */}
      {currentGroup && (
        <div className="group-input__matches">
          <h4 className="group-input__matches-title">Group {selectedGroup} matches</h4>
          {currentGroup.matches.map((match) => (
            <div key={match.id} className="group-input__match">
              <div className="group-input__teams">
                <span className="group-input__team-name">{match.home.name}</span>
                <span className="group-input__vs">vs</span>
                <span className="group-input__team-name">{match.away.name}</span>
              </div>

              <div className="group-input__score-row">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={displayScore(match.homeScore)}
                  onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                  className="group-input__score-input"
                  placeholder="0"
                />
                <span className="group-input__dash">-</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={displayScore(match.awayScore)}
                  onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                  className="group-input__score-input"
                  placeholder="0"
                />
              </div>

              <div
                className={
                  'group-input__match-status ' +
                  (match.played
                    ? 'group-input__match-status--played'
                    : 'group-input__match-status--pending')
                }
              >
                {match.played ? '✓ Played' : 'Pending'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Import panel */}
      {showImport && (
        <div className="group-input__import-panel">
          <h4 className="group-input__import-title">Import CSV results</h4>
          <p className="group-input__import-hint">
            Paste CSV with columns: Group,Match,Home,Away,HomeScore,AwayScore
          </p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={'A,A1,Mexico,South Africa,2,1\nA,A2,Korea Republic,Winner Play-Off D,1,0'}
            rows={6}
            className="group-input__import-textarea"
          />
          <div className="group-input__import-actions">
            <button
              type="button"
              onClick={handleImport}
              className="group-input__action"
            >
              Import
            </button>
            <button
              type="button"
              onClick={() => setShowImport(false)}
              className="group-input__action group-input__action--cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupInput;
