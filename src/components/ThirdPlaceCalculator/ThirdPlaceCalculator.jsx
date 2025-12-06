import React, { useState, useEffect } from 'react';
import { useSimulator } from '../../SimulatorContext';
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
    if (groups && Object.keys(groups).length === 12) {
      // Calculate all third place teams
      const thirds = calculateThirdPlaceTeams(groups);
      setAllThirdPlaces(thirds);
      
      // Top 8 qualify, bottom 4 eliminated
      const qualified = thirds.slice(0, 8);
      const eliminated = thirds.slice(8);
      
      setQualifiedThirds(qualified);
      setEliminatedThirds(eliminated);
      
      // Simulate assignments (would need knockout format data for actual assignment)
      const fakeKnockoutFormat = { roundOf32: [] }; // Placeholder
      const thirdPlaceAssignments = assignThirdPlaceTeams(qualified, fakeKnockoutFormat);
      setAssignments(thirdPlaceAssignments);
    }
  }, [groups]);

  const getAllowedGroups = (matchId) => {
    const allowedGroupsMap = {
      74: ['A', 'B', 'C', 'D', 'F'],
      77: ['C', 'D', 'F', 'G', 'H'],
      79: ['C', 'E', 'F', 'H', 'I'],
      80: ['E', 'H', 'I', 'J', 'K'],
      81: ['B', 'E', 'F', 'I', 'J'],
      82: ['A', 'E', 'H', 'I', 'J'],
      85: ['E', 'F', 'G', 'I', 'J'],
      87: ['D', 'E', 'I', 'J', 'L']
    };
    return allowedGroupsMap[matchId] || [];
  };

  const getMatchInfo = (matchId) => {
    const matchInfo = {
      74: { vs: 'Winner E', allowed: ['A','B','C','D','F'] },
      77: { vs: 'Winner I', allowed: ['C','D','F','G','H'] },
      79: { vs: 'Winner A', allowed: ['C','E','F','H','I'] },
      80: { vs: 'Winner L', allowed: ['E','H','I','J','K'] },
      81: { vs: 'Winner D', allowed: ['B','E','F','I','J'] },
      82: { vs: 'Winner G', allowed: ['A','E','H','I','J'] },
      85: { vs: 'Winner B', allowed: ['E','F','G','I','J'] },
      87: { vs: 'Winner K', allowed: ['D','E','I','J','L'] }
    };
    return matchInfo[matchId] || { vs: 'Unknown', allowed: [] };
  };

  if (allThirdPlaces.length === 0) {
    return (
      <div className="third-place-empty">
        <h3>Third Place Calculator</h3>
        <p>Complete group stage matches to calculate third place rankings.</p>
      </div>
    );
  }

  return (
    <div className="third-place-calculator">
      <div className="calculator-header">
        <h3>Third Place Qualification Calculator</h3>
        <button 
          className="toggle-details"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Calculation Details'}
        </button>
      </div>

      <div className="calculator-summary">
        <div className="summary-card qualified">
          <div className="summary-title">✅ Qualified (Top 8)</div>
          <div className="summary-count">{qualifiedThirds.length}</div>
          <div className="summary-desc">Advance to Round of 32</div>
        </div>
        <div className="summary-card eliminated">
          <div className="summary-title">❌ Eliminated (Bottom 4)</div>
          <div className="summary-count">{eliminatedThirds.length}</div>
          <div className="summary-desc">End tournament here</div>
        </div>
        <div className="summary-card total">
          <div className="summary-title">Total Third Places</div>
          <div className="summary-count">{allThirdPlaces.length}</div>
          <div className="summary-desc">From 12 groups</div>
        </div>
      </div>

      <div className="ranking-table">
        <h4>Third Place Ranking (All 12 Teams)</h4>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Group</th>
              <th>Pts</th>
              <th>GD</th>
              <th>GS</th>
              <th>Fair Play</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allThirdPlaces.map((team, index) => (
              <tr key={`${team.group}-${index}`} className={index < 8 ? 'qualifying-row' : 'eliminated-row'}>
                <td className="rank-cell">#{index + 1}</td>
                <td className="team-cell">
                  <div className="team-name">{team.name}</div>
                </td>
                <td className="group-cell">
                  <span className="group-badge">Grp {team.group}</span>
                </td>
                <td className="points-cell">{team.points}</td>
                <td className="gd-cell">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                <td className="gs-cell">{team.gs}</td>
                <td className="fairplay-cell">{team.fairPlayScore}</td>
                <td className="status-cell">
                  <span className={`status-badge ${index < 8 ? 'qualified' : 'eliminated'}`}>
                    {index < 8 ? 'QUALIFIED' : 'ELIMINATED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetails && (
        <div className="calculation-details">
          <h4>Calculation Details</h4>
          
          <div className="criteria-list">
            <div className="criterion">
              <h5>Ranking Criteria (in order):</h5>
              <ol>
                <li><strong>Points</strong> (3 for win, 1 for draw)</li>
                <li><strong>Goal Difference</strong></li>
                <li><strong>Goals Scored</strong></li>
                <li><strong>Fair Play Points</strong> (-1 yellow, -3 indirect red, -4 direct red, -5 yellow+direct red)</li>
                <li><strong>Drawing of Lots</strong> (by FIFA if still tied)</li>
              </ol>
            </div>
            
            <div className="criterion">
              <h5>Third Place Assignment Rules:</h5>
              <ul>
                <li>Top 8 third-place teams qualify for Round of 32</li>
                <li>Assigned to specific matches to avoid group-stage rematches</li>
                <li>Each match has 5 allowed groups for third-place teams</li>
                <li>Winner's group is always excluded from allowed list</li>
                <li>Assignment order: Matches 74, 77, 79, 80, 81, 82, 85, 87</li>
              </ul>
            </div>
          </div>

          <div className="assignment-preview">
            <h5>Predicted Round of 32 Assignments:</h5>
            <div className="assignment-grid">
              {[74, 77, 79, 80, 81, 82, 85, 87].map(matchId => {
                const matchInfo = getMatchInfo(matchId);
                const assignedTeam = assignments[matchId];
                return (
                  <div key={matchId} className="assignment-card">
                    <div className="match-header">
                      <span className="match-name">Match {matchId}</span>
                      <span className="vs-text">vs {matchInfo.vs}</span>
                    </div>
                    <div className="assignment-content">
                      {assignedTeam ? (
                        <>
                          <div className="assigned-team">
                            <span className="team-name">{assignedTeam.name}</span>
                            <span className="team-group">(Group {assignedTeam.group})</span>
                          </div>
                          <div className="allowed-groups">
                            Allowed: {matchInfo.allowed.join(', ')}
                          </div>
                        </>
                      ) : (
                        <div className="no-assignment">
                          Will be assigned from: {matchInfo.allowed.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThirdPlaceCalculator;