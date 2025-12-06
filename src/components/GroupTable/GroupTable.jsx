// src/components/GroupTable/GroupTable.jsx
import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import './GroupTable.css';

const GroupTable = ({ groupId }) => {
  const { groups, calculateGroupStandings } = useSimulator();
  const group = groups[groupId];

  if (!group) return null;

  const standings = calculateGroupStandings(group);
  const completedMatches = group.matches.filter((m) => m.played).length;

  return (
    <div className="group-table">
      <div className="group-table__header">
        <h3 className="group-table__title">Group {groupId}</h3>
        <div
          className={
            'group-table__status ' +
            (group.isCompleted ? 'group-table__status--done' : 'group-table__status--progress')
          }
        >
          {group.isCompleted ? '✓ Completed' : `${completedMatches}/6 matches`}
        </div>
      </div>

      <div className="group-table__table-wrapper">
        <table className="group-table__table">
          <thead className="group-table__head">
            <tr>
              <th className="group-table__th">Pos</th>
              <th className="group-table__th group-table__th--team">Team</th>
              <th className="group-table__th">P</th>
              <th className="group-table__th">W</th>
              <th className="group-table__th">D</th>
              <th className="group-table__th">L</th>
              <th className="group-table__th">GF</th>
              <th className="group-table__th">GA</th>
              <th className="group-table__th">GD</th>
              <th className="group-table__th">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr
                key={team.id}
                className={
                  'group-table__row ' +
                  (index < 2
                    ? 'group-table__row--qualify'
                    : index === 2
                    ? 'group-table__row--third'
                    : 'group-table__row--out')
                }
              >
                <td className="group-table__cell group-table__cell--pos">{index + 1}</td>
                <td className="group-table__cell group-table__cell--team">
                  <span className={`group-table__badge group-table__badge--pos-${index + 1}`} />
                  <span className="group-table__team-name">{team.name}</span>
                </td>
                <td className="group-table__cell">{team.played}</td>
                <td className="group-table__cell">{team.wins}</td>
                <td className="group-table__cell">{team.draws}</td>
                <td className="group-table__cell">{team.losses}</td>
                <td className="group-table__cell">{team.gs}</td>
                <td className="group-table__cell">{team.ga}</td>
                <td
                  className={
                    'group-table__cell group-table__cell--gd ' +
                    (team.gd >= 0 ? 'group-table__cell--gd-pos' : 'group-table__cell--gd-neg')
                  }
                >
                  {team.gd > 0 ? `+${team.gd}` : team.gd}
                </td>
                <td className="group-table__cell group-table__cell--pts">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="group-table__legend">
        <span className="group-table__legend-item">
          <span className="group-table__legend-dot group-table__legend-dot--qualify" />
          1st–2nd: qualify for Round of 32
        </span>
        <span className="group-table__legend-item">
          <span className="group-table__legend-dot group-table__legend-dot--third" />
          3rd: enters third-place ranking
        </span>
      </div>
    </div>
  );
};

export default GroupTable;
