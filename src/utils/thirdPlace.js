import { calculateFairPlayScore } from './ranking.js';

export const calculateThirdPlaceTeams = (groups) => {
  const allThirds = [];
  
  Object.keys(groups).forEach(groupId => {
    const group = groups[groupId];
    
    // Sort teams in the group
    const sortedTeams = [...group.teams].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gs !== a.gs) return b.gs - a.gs;
      return a.name.localeCompare(b.name);
    });
    
    const thirdPlaceTeam = {
      ...sortedTeams[2],
      group: groupId,
      fairPlayScore: calculateFairPlayScore(sortedTeams[2], group.matches)
    };
    
    allThirds.push(thirdPlaceTeam);
  });
  
  // Sort all third place teams using FIFA criteria
  const sortedThirds = allThirds.sort((a, b) => {
    // a) Points
    if (b.points !== a.points) return b.points - a.points;
    
    // b) Goal difference
    if (b.gd !== a.gd) return b.gd - a.gd;
    
    // c) Goals scored
    if (b.gs !== a.gs) return b.gs - a.gs;
    
    // d) Fair play score (lower/less negative is better)
    if (a.fairPlayScore !== b.fairPlayScore) return a.fairPlayScore - b.fairPlayScore;
    
    // e) Drawing of lots (simulated by group order)
    return a.group.localeCompare(b.group);
  });
  
  return sortedThirds;
};

export const assignThirdPlaceTeams = (qualifiedThirds, knockoutFormat) => {
  // FIFA's allowed groups for each third-place match slot
  const allowedGroups = {
    74: ['A', 'B', 'C', 'D', 'F'],  // vs Winner E
    77: ['C', 'D', 'F', 'G', 'H'],  // vs Winner I
    79: ['C', 'E', 'F', 'H', 'I'],  // vs Winner A
    80: ['E', 'H', 'I', 'J', 'K'],  // vs Winner L
    81: ['B', 'E', 'F', 'I', 'J'],  // vs Winner D
    82: ['A', 'E', 'H', 'I', 'J'],  // vs Winner G
    85: ['E', 'F', 'G', 'I', 'J'],  // vs Winner B
    87: ['D', 'E', 'I', 'J', 'L']   // vs Winner K
  };
  
  const matchesInOrder = [74, 77, 79, 80, 81, 82, 85, 87];
  const assignments = {};
  const remainingThirds = [...qualifiedThirds];
  
  matchesInOrder.forEach(matchId => {
    for (let i = 0; i < remainingThirds.length; i++) {
      const candidate = remainingThirds[i];
      if (allowedGroups[matchId].includes(candidate.group)) {
        assignments[matchId] = candidate;
        remainingThirds.splice(i, 1);
        break;
      }
    }
  });
  
  return assignments;
};