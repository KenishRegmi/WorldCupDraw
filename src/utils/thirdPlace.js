// src/utils/thirdPlace.js
import { calculateFairPlayScore } from './ranking';

// Rank 12 third-placed teams using official criteria
export const calculateThirdPlaceTeams = (groups) => {
  const allThirds = [];

  Object.keys(groups).forEach((groupId) => {
    const group = groups[groupId];

    const sortedTeams = [...group.teams].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gs !== a.gs) return b.gs - a.gs;
      return a.name.localeCompare(b.name);
    });

    const third = sortedTeams[2];

    allThirds.push({
      ...third,
      group: groupId,
      fairPlayScore: calculateFairPlayScore(third, group.matches),
    });
  });

  allThirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gs !== a.gs) return b.gs - a.gs;
    if (a.fairPlayScore !== b.fairPlayScore) return a.fairPlayScore - b.fairPlayScore;
    return a.group.localeCompare(b.group);
  });

  return allThirds;
};

// Assign top 8 thirds into their Round of 32 slots (matches 74,77,79,80,81,82,85,87)
export const assignThirdPlaceTeams = (qualifiedThirds) => {
  const allowedGroups = {
    74: ['A', 'B', 'C', 'D', 'F'],
    77: ['C', 'D', 'F', 'G', 'H'],
    79: ['C', 'E', 'F', 'H', 'I'],
    80: ['E', 'H', 'I', 'J', 'K'],
    81: ['B', 'E', 'F', 'I', 'J'],
    82: ['A', 'E', 'H', 'I', 'J'],
    85: ['E', 'F', 'G', 'I', 'J'],
    87: ['D', 'E', 'I', 'J', 'L'],
  };

  const matchesInOrder = [74, 77, 79, 80, 81, 82, 85, 87];

  const remaining = [...qualifiedThirds];
  const assignments = {};

  matchesInOrder.forEach((matchId) => {
    const allowed = allowedGroups[matchId];
    for (let i = 0; i < remaining.length; i += 1) {
      const cand = remaining[i];
      if (allowed.includes(cand.group)) {
        assignments[matchId] = cand;
        remaining.splice(i, 1);
        break;
      }
    }
  });

  return assignments; // { 74: teamObj, 77: teamObj, ... }
};
