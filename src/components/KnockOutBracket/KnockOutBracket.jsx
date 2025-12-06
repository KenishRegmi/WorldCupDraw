// src/components/KnockOutBracket/KnockOutBracket.jsx
import React, { useState } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import MatchCard from '../MatchCard/MatchCard';
import './KnockOutBracket.css';

const KnockOutBracket = () => {
  const { groups, knockout, updateKnockoutMatch } = useSimulator();
  const [activeRound, setActiveRound] = useState('roundOf32');
  const [isSimulating, setIsSimulating] = useState(false);

  if (!knockout) {
    return null;
  }

  const handleScoreChange = (matchId, homeScore, awayScore) => {
    const hs = Number(homeScore) || 0;
    const as = Number(awayScore) || 0;
    updateKnockoutMatch(matchId, hs, as);
  };

  const allGroupsComplete = Object.values(groups).every((g) => g.isCompleted);
  const roundOf32Ready = knockout.roundOf32.every((m) => m.home && m.away);

  const simulateAllMatches = () => {
    if (!roundOf32Ready || isSimulating) return;
    setIsSimulating(true);

    // simple demo: just call updateKnockoutMatch with random scores
    knockout.roundOf32.forEach((m) => {
      if (m.home && m.away && !m.played) {
        const hs = Math.floor(Math.random() * 4);
        const as = Math.floor(Math.random() * 4);
        updateKnockoutMatch(m.id, hs, as);
      }
    });

    knockout.roundOf16.forEach((m) => {
      if (m.home && m.away && !m.played) {
        const hs = Math.floor(Math.random() * 4);
        const as = Math.floor(Math.random() * 4);
        updateKnockoutMatch(m.id, hs, as);
      }
    });

    setIsSimulating(false);
  };

  return (
    <div className="bracket">
      <div className="bracket__header">
        <h2 className="bracket__title">Knockout stage</h2>
        <div className="bracket__status">
          {!allGroupsComplete ? (
            <span className="bracket__status-text bracket__status-text--warn">
              ⚠ Complete all group matches first
            </span>
          ) : !roundOf32Ready ? (
            <span className="bracket__status-text bracket__status-text--info">
              ℹ Calculating qualified teams…
            </span>
          ) : (
            <span className="bracket__status-text bracket__status-text--ok">
              ✓ Round of 32 ready
            </span>
          )}
        </div>
      </div>

      <div className="bracket__controls">
        <div className="bracket__round-tabs">
          {['roundOf32', 'roundOf16', 'quarterFinals', 'semiFinals', 'final'].map((round) => (
            <button
              key={round}
              type="button"
              className={
                'bracket__round-btn' +
                (activeRound === round ? ' bracket__round-btn--active' : '')
              }
              onClick={() => setActiveRound(round)}
            >
              {round.replace(/([A-Z])/g, ' $1').replace('Of', 'of')}
            </button>
          ))}
        </div>

        <div className="bracket__sim-controls">
          <button
            type="button"
            className="bracket__btn bracket__btn--simulate"
            onClick={simulateAllMatches}
            disabled={!allGroupsComplete || !roundOf32Ready || isSimulating}
          >
            {isSimulating ? 'Simulating…' : 'Simulate Round of 32 & 16'}
          </button>
        </div>
      </div>

      <div className="bracket__content">
        {activeRound === 'roundOf32' && (
          <div className="bracket__round">
            <h3 className="bracket__round-title">Round of 32</h3>
            <div className="bracket__matches bracket__matches--grid-4">
              {knockout.roundOf32.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onScoreChange={handleScoreChange}
                  isEditable
                  stage="roundOf32"
                />
              ))}
            </div>
          </div>
        )}

        {activeRound === 'roundOf16' && (
          <div className="bracket__round">
            <h3 className="bracket__round-title">Round of 16</h3>
            <div className="bracket__matches bracket__matches--grid-4">
              {knockout.roundOf16.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onScoreChange={handleScoreChange}
                  isEditable
                  stage="roundOf16"
                />
              ))}
            </div>
          </div>
        )}

        {activeRound === 'quarterFinals' && (
          <div className="bracket__round">
            <h3 className="bracket__round-title">Quarter-finals</h3>
            <div className="bracket__matches bracket__matches--grid-2">
              {knockout.quarterFinals.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onScoreChange={handleScoreChange}
                  isEditable
                  stage="quarterFinals"
                />
              ))}
            </div>
          </div>
        )}

        {activeRound === 'semiFinals' && (
          <div className="bracket__round">
            <h3 className="bracket__round-title">Semi-finals</h3>
            <div className="bracket__matches bracket__matches--grid-2">
              {knockout.semiFinals.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onScoreChange={handleScoreChange}
                  isEditable
                  stage="semiFinals"
                />
              ))}
            </div>
          </div>
        )}

        {activeRound === 'final' && (
          <div className="bracket__final">
            <div className="bracket__final-side">
              <h3 className="bracket__round-title">Third-place match</h3>
              <MatchCard
                match={knockout.thirdPlace}
                onScoreChange={handleScoreChange}
                isEditable
                stage="thirdPlace"
              />
            </div>
            <div className="bracket__final-side">
              <h3 className="bracket__round-title">World Cup final</h3>
              <MatchCard
                match={knockout.final}
                onScoreChange={handleScoreChange}
                isEditable
                stage="final"
              />
            </div>
          </div>
        )}

        {knockout.final.winner && (
          <div className="bracket__champion">
            <div className="bracket__champion-trophy">🏆</div>
            <div className="bracket__champion-info">
              <div className="bracket__champion-label">World Cup 2026 champion</div>
              <div className="bracket__champion-name">
                {knockout.final.winner.name || 'TBD'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnockOutBracket;
