import React from 'react';
import { useSimulator } from '../../SimulatorContext';
import './GroupTable.css';

const GroupTable = ({ groupId }) => {
  const { groups, calculateGroupStandings } = useSimulator();
  const group = groups[groupId];

  if (!group) return null;

  const standings = calculateGroupStandings(group);
  const completedMatches = group.matches.filter(m => m.played).length;

  return (
    <div className="group-table-container">
      <div className="group-header">
        <h3>Group {groupId}</h3>
        <div className={`completion-status ${group.isCompleted ? 'completed' : 'in-progress'}`}>
          {group.isCompleted ? '✓ Completed' : `${completedMatches}/6 matches`}
        </div>
      </div>

      <div className="standings-table">
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={team.id} className={index < 2 ? 'qualifying' : index === 2 ? 'third-place' : 'eliminated'}>
                <td className="position">{index + 1}</td>
                <td className="team-name">
                  <span className={`team-badge pos-${index + 1}`}></span>
                  {team.name}
                </td>
                <td>{team.played}</td>
                <td>{team.wins}</td>
                <td>{team.draws}</td>
                <td>{team.losses}</td>
                <td>{team.gs}</td>
                <td>{team.ga}</td>
                <td className={team.gd >= 0 ? 'positive' : 'negative'}>
                  {team.gd > 0 ? `+${team.gd}` : team.gd}
                </td>
                <td className="points">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="qualification-info">
        <div className="qualification-item">
          <span className="badge qualifying-badge">1</span>
          <span>→ Round of 32 (Winner)</span>
        </div>
        <div className="qualification-item">
          <span className="badge qualifying-badge">2</span>
          <span>→ Round of 32 (Runner-up)</span>
        </div>
        <div className="qualification-item">
          <span className="badge third-place-badge">3</span>
          <span>→ Third Place Table</span>
        </div>
      </div>
    </div>
  );
};

export default GroupTable;