import React, { useState, useEffect } from 'react';
import { useSimulator } from '../../SimulatorContext';
import { calculateThirdPlaceTeams, assignThirdPlaceTeams } from '../../utils/thirdPlace';
import { knockoutFormat } from '../../data/knockoutFormat';
import './ThirdPlaceTable.css';

const ThirdPlaceTable = () => {
  const { groups, setKnockoutTeams } = useSimulator();
  const [allThirdPlaces, setAllThirdPlaces] = useState([]);
  const [qualifiedThirds, setQualifiedThirds] = useState([]);
  const [eliminatedThirds, setEliminatedThirds] = useState([]);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    if (groups && Object.keys(groups).length === 12) {
      const thirds = calculateThirdPlaceTeams(groups);
      setAllThirdPlaces(thirds);
      
      const qualified = thirds.slice(0, 8);
      const eliminated = thirds.slice(8);
      
      setQualifiedThirds(qualified);
      setEliminatedThirds(eliminated);
      
      const thirdPlaceAssignments = assignThirdPlaceTeams(qualified, knockoutFormat);
      setAssignments(thirdPlaceAssignments);
      
      // Update knockout bracket with assigned teams
      setKnockoutTeams(thirdPlaceAssignments);
    }
  }, [groups, setKnockoutTeams]);

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
      <div className="third-place-loading">
        <h3>Third Place Table</h3>
        <p>Complete group stage matches to see third place rankings.</p>
      </div>
    );
  }

  return (
    <div className="third-place-table">
      <h2>Third Place Qualification Table</h2>
      
      <div className="explanation-box">
        <h4>How Third Place Qualification Works:</h4>
        <ul>
          <li>12 third-placed teams from Groups A-L are ranked</li>
          <li>Top 8 qualify for Round of 32</li>
          <li>Ranking criteria: Points → Goal Difference → Goals Scored → Fair Play → Drawing of Lots</li>
          <li>Assigned to specific knockout matches to avoid rematches with group opponents</li>
        </ul>
      </div>

      {/* Qualified Teams */}
      <div className="section qualified-section">
        <h3>
          <span className="icon">✅</span>
          Qualified for Round of 32 (Top 8)
        </h3>
        <div className="teams-grid">
          {qualifiedThirds.map((team, index) => (
            <div key={`${team.group}-${index}`} className="team-card qualified">
              <div className="team-rank">#{index + 1}</div>
              <div className="team-details">
                <div className="team-name">{team.name}</div>
                <div className="team-meta">
                  <span className="team-group">Group {team.group}</span>
                  <span className="team-stats">
                    Pts: {team.points} | GD: {team.gd} | GS: {team.gs}
                  </span>
                </div>
                <div className="team-fairplay">
                  Fair Play: {team.fairPlayScore}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eliminated Teams */}
      {eliminatedThirds.length > 0 && (
        <div className="section eliminated-section">
          <h3>
            <span className="icon">❌</span>
            Eliminated (Bottom 4)
          </h3>
          <div className="teams-grid">
            {eliminatedThirds.map((team, index) => (
              <div key={`${team.group}-${index}`} className="team-card eliminated">
                <div className="team-rank">#{qualifiedThirds.length + index + 1}</div>
                <div className="team-details">
                  <div className="team-name">{team.name}</div>
                  <div className="team-meta">
                    <span className="team-group">Group {team.group}</span>
                    <span className="team-stats">
                      Pts: {team.points} | GD: {team.gd} | GS: {team.gs}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Round of 32 Assignments */}
      <div className="section assignments-section">
        <h3>Round of 32 Assignments</h3>
        <div className="assignments-grid">
          {[74, 77, 79, 80, 81, 82, 85, 87].map(matchId => {
            const matchInfo = getMatchInfo(matchId);
            const assignedTeam = assignments[matchId];
            
            return (
              <div key={matchId} className="assignment-card">
                <div className="match-header">
                  <span className="match-number">Match {matchId}</span>
                  <span className="match-vs">vs {matchInfo.vs}</span>
                </div>
                <div className="match-body">
                  {assignedTeam ? (
                    <div className="assigned-info">
                      <div className="assigned-team">
                        <span className="team-name">{assignedTeam.name}</span>
                        <span className="team-group">(Group {assignedTeam.group})</span>
                      </div>
                      <div className="allowed-groups">
                        <span className="allowed-label">Allowed groups:</span>
                        <span className="allowed-list">{matchInfo.allowed.join(', ')}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="no-assignment">
                      Will be assigned from allowed groups
                    </div>
                  )}
                  <div className="match-guarantee">
                    ✅ No rematch with {matchInfo.vs.split(' ')[1]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="algorithm-section">
        <h4>Assignment Algorithm</h4>
        <div className="algorithm-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong>Rank all third-place teams</strong> using FIFA criteria
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong>Top 8 qualify</strong>, bottom 4 are eliminated
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong>Process matches in fixed order:</strong> 74 → 77 → 79 → 80 → 81 → 82 → 85 → 87
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong>For each match:</strong> Assign highest-ranked available team from allowed groups
            </div>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <div className="step-content">
              <strong>Guarantee:</strong> No group-stage rematches possible
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdPlaceTable;