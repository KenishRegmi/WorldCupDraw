// src/components/ThirdPlaceTable/ThirdPlaceTable.jsx
import React, { useState, useEffect } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
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
    if (!groups || Object.keys(groups).length !== 12) return;

    const thirds = calculateThirdPlaceTeams(groups);
    setAllThirdPlaces(thirds);

    const qualified = thirds.slice(0, 8);
    const eliminated = thirds.slice(8);

    setQualifiedThirds(qualified);
    setEliminatedThirds(eliminated);

    const thirdPlaceAssignments = assignThirdPlaceTeams(qualified, knockoutFormat);
    setAssignments(thirdPlaceAssignments);
    setKnockoutTeams(thirdPlaceAssignments);
  }, [groups, setKnockoutTeams]);

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
      <div className="third-table third-table--empty">
        <h3 className="third-table__title">Third-place table</h3>
        <p className="third-table__text">
          Complete all group matches to see third-place rankings.
        </p>
      </div>
    );
  }

  return (
    <div className="third-table">
      <h2 className="third-table__title">Third-place qualification table</h2>

      <div className="third-table__info">
        <h4 className="third-table__info-title">How it works</h4>
        <ul className="third-table__info-list">
          <li>12 third-placed teams from Groups A–L are ranked.</li>
          <li>Top 8 qualify for the Round of 32.</li>
          <li>
            Ranking criteria: points → goal difference → goals scored → fair play → drawing of
            lots.
          </li>
          <li>
            Qualified thirds are assigned to fixed Round of 32 slots to avoid group-stage rematches.
          </li>
        </ul>
      </div>

      {/* Qualified teams */}
      <section className="third-table__section third-table__section--qualified">
        <h3 className="third-table__section-title">
          <span className="third-table__icon">✅</span>
          Qualified for Round of 32 (top 8)
        </h3>
        <div className="third-table__grid">
          {qualifiedThirds.map((team, index) => (
            <div key={`${team.group}-${team.name}`} className="third-table__card third-table__card--qualified">
              <div className="third-table__card-rank">#{index + 1}</div>
              <div className="third-table__card-main">
                <div className="third-table__card-name">{team.name}</div>
                <div className="third-table__card-meta">
                  <span className="third-table__chip">Group {team.group}</span>
                  <span className="third-table__stats">
                    Pts {team.points} • GD {team.gd} • GS {team.gs}
                  </span>
                </div>
                <div className="third-table__fairplay">Fair play: {team.fairPlayScore}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Eliminated teams */}
      {eliminatedThirds.length > 0 && (
        <section className="third-table__section third-table__section--eliminated">
          <h3 className="third-table__section-title">
            <span className="third-table__icon">❌</span>
            Eliminated (bottom 4)
          </h3>
          <div className="third-table__grid">
            {eliminatedThirds.map((team, index) => (
              <div key={`${team.group}-${team.name}`} className="third-table__card third-table__card--eliminated">
                <div className="third-table__card-rank">
                  #{qualifiedThirds.length + index + 1}
                </div>
                <div className="third-table__card-main">
                  <div className="third-table__card-name">{team.name}</div>
                  <div className="third-table__card-meta">
                    <span className="third-table__chip">Group {team.group}</span>
                    <span className="third-table__stats">
                      Pts {team.points} • GD {team.gd} • GS {team.gs}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Round of 32 assignments */}
      <section className="third-table__section">
        <h3 className="third-table__section-title">Round of 32 assignments</h3>
        <div className="third-table__assign-grid">
          {[74, 77, 79, 80, 81, 82, 85, 87].map((matchId) => {
            const info = getMatchInfo(matchId);
            const team = assignments[matchId];

            return (
              <div key={matchId} className="third-table__assign-card">
                <div className="third-table__assign-header">
                  <span className="third-table__assign-match">Match {matchId}</span>
                  <span className="third-table__assign-vs">vs {info.vs}</span>
                </div>
                <div className="third-table__assign-body">
                  {team ? (
                    <>
                      <div className="third-table__assign-team">
                        <span className="third-table__assign-name">{team.name}</span>
                        <span className="third-table__assign-group">(Group {team.group})</span>
                      </div>
                      <div className="third-table__assign-detail">
                        Allowed groups: {info.allowed.join(', ')}
                      </div>
                      <div className="third-table__assign-detail third-table__assign-detail--note">
                        Guaranteed: no rematch with {info.vs.split(' ')[1]}.
                      </div>
                    </>
                  ) : (
                    <div className="third-table__assign-placeholder">
                      Will be assigned from groups: {info.allowed.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ThirdPlaceTable;
