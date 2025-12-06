// src/components/ThirdPlaceCalculator/ThirdPlaceCalculator.jsx
import React, { useState, useEffect } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { calculateThirdPlaceTeams, assignThirdPlaceTeams } from '../../utils/thirdPlace';
import './ThirdPlaceCalculator.css';

const ThirdPlaceCalculator = () => {
  const { groups } = useSimulator();
  const [allThirdPlaces, setAllThirdPlaces] = useState([]);
  const [qualifiedThirds, setQualifiedThirds] = useState([]);
  const [eliminatedThirds, setEliminatedThirds] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!groups || Object.keys(groups).length !== 12) return;

    const thirds = calculateThirdPlaceTeams(groups);
    setAllThirdPlaces(thirds);

    const qualified = thirds.slice(0, 8);
    const eliminated = thirds.slice(8);

    setQualifiedThirds(qualified);
    setEliminatedThirds(eliminated);

    const thirdPlaceAssignments = assignThirdPlaceTeams(qualified);
    setAssignments(thirdPlaceAssignments);
  }, [groups]);

  const getMatchInfo = (matchId) => {
    const info = {
      74: { vs: 'Winner E', allowed: ['A', 'B', 'C', 'D', 'F'] },
      77: { vs: 'Winner I', allowed: ['C', 'D', 'F', 'G', 'H'] },
      79: { vs: 'Winner A', allowed: ['C', 'E', 'F', 'H', 'I'] },
      80: { vs: 'Winner L', allowed: ['E', 'H', 'I', 'J', 'K'] },
      81: { vs: 'Winner D', allowed: ['B', 'E', 'F', 'I', 'J'] },
      82: { vs: 'Winner G', allowed: ['A', 'E', 'H', 'I', 'J'] },
      85: { vs: 'Winner B', allowed: ['E', 'F', 'G', 'I', 'J'] },
      87: { vs: 'Winner K', allowed: ['D', 'E', 'I', 'J', 'L'] },
    };
    return info[matchId] || { vs: 'Unknown', allowed: [] };
  };

  if (allThirdPlaces.length === 0) {
    return (
      <div className="third-calc third-calc--empty">
        <h3 className="third-calc__title">Third-place calculator</h3>
        <p className="third-calc__text">
          Complete all group matches to calculate third-place rankings.
        </p>
      </div>
    );
  }

  return (
    <div className="third-calc">
      <div className="third-calc__header">
        <h3 className="third-calc__title">Third-place qualification calculator</h3>
        <button
          type="button"
          className="third-calc__toggle"
          onClick={() => setShowDetails((v) => !v)}
        >
          {showDetails ? 'Hide details' : 'Show calculation details'}
        </button>
      </div>

      <div className="third-calc__summary">
        <div className="third-calc__summary-card third-calc__summary-card--qualified">
          <div className="third-calc__summary-label">Qualified (top 8)</div>
          <div className="third-calc__summary-value">{qualifiedThirds.length}</div>
          <div className="third-calc__summary-desc">Advance to Round of 32</div>
        </div>
        <div className="third-calc__summary-card third-calc__summary-card--eliminated">
          <div className="third-calc__summary-label">Eliminated (bottom 4)</div>
          <div className="third-calc__summary-value">{eliminatedThirds.length}</div>
          <div className="third-calc__summary-desc">End of tournament</div>
        </div>
        <div className="third-calc__summary-card">
          <div className="third-calc__summary-label">Total third places</div>
          <div className="third-calc__summary-value">{allThirdPlaces.length}</div>
          <div className="third-calc__summary-desc">Groups A–L</div>
        </div>
      </div>

      <div className="third-calc__table">
        <h4 className="third-calc__section-title">Ranking of all third-placed teams</h4>
        <table className="third-calc__ranking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>Group</th>
              <th>Pts</th>
              <th>GD</th>
              <th>GS</th>
              <th>Fair play</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allThirdPlaces.map((team, index) => (
              <tr
                key={`${team.group}-${team.name}`}
                className={
                  index < 8
                    ? 'third-calc__row third-calc__row--qualified'
                    : 'third-calc__row third-calc__row--eliminated'
                }
              >
                <td>#{index + 1}</td>
                <td className="third-calc__cell-team">{team.name}</td>
                <td>
                  <span className="third-calc__badge">Grp {team.group}</span>
                </td>
                <td>{team.points}</td>
                <td>{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                <td>{team.gs}</td>
                <td>{team.fairPlayScore}</td>
                <td>
                  <span
                    className={
                      'third-calc__status ' +
                      (index < 8 ? 'third-calc__status--ok' : 'third-calc__status--out')
                    }
                  >
                    {index < 8 ? 'QUALIFIED' : 'ELIMINATED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetails && (
        <div className="third-calc__details">
          <h4 className="third-calc__section-title">Assignment preview (Round of 32)</h4>
          <div className="third-calc__assign-grid">
            {[74, 77, 79, 80, 81, 82, 85, 87].map((matchId) => {
              const info = getMatchInfo(matchId);
              const team = assignments[matchId];
              return (
                <div key={matchId} className="third-calc__assign-card">
                  <div className="third-calc__assign-header">
                    <span className="third-calc__assign-match">Match {matchId}</span>
                    <span className="third-calc__assign-vs">vs {info.vs}</span>
                  </div>
                  <div className="third-calc__assign-body">
                    {team ? (
                      <>
                        <div className="third-calc__assign-team">
                          <span className="third-calc__assign-name">{team.name}</span>
                          <span className="third-calc__assign-group">(Group {team.group})</span>
                        </div>
                        <div className="third-calc__assign-allowed">
                          Allowed groups: {info.allowed.join(', ')}
                        </div>
                      </>
                    ) : (
                      <div className="third-calc__assign-placeholder">
                        Will be assigned from groups: {info.allowed.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThirdPlaceCalculator;
