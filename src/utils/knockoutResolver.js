import { calculateGroupStandings } from './ranking.js';
import { calculateThirdPlaceTeams, assignThirdPlaceTeams } from './thirdPlace.js';

export const resolveKnockoutBracket = (groups, knockoutFormat) => {
  const resolved = JSON.parse(JSON.stringify(knockoutFormat));
  
  // 1. Determine group winners and runners-up
  const groupStandings = {};
  Object.keys(groups).forEach(groupId => {
    const standings = calculateGroupStandings(groups[groupId]);
    groupStandings[groupId] = {
      winner: standings[0],
      runnerUp: standings[1],
      thirdPlace: standings[2]
    };
  });
  
  // 2. Calculate and assign third place teams
  const allThirdPlaces = calculateThirdPlaceTeams(groups);
  const qualifiedThirds = allThirdPlaces.slice(0, 8);
  const thirdPlaceAssignments = assignThirdPlaceTeams(qualifiedThirds, knockoutFormat);
  
  // 3. Fill Round of 32 matches
  resolved.roundOf32 = resolved.roundOf32.map(match => {
    const [team1Desc, team2Desc] = match.teams;
    let home = null;
    let away = null;
    
    // Helper function to resolve team description
    const resolveTeam = (desc) => {
      if (desc.includes('Group') && desc.includes('winners')) {
        const groupId = desc.split(' ')[1];
        return groupStandings[groupId]?.winner || null;
      } else if (desc.includes('Group') && desc.includes('runners-up')) {
        const groupId = desc.split(' ')[1];
        return groupStandings[groupId]?.runnerUp || null;
      } else if (desc.includes('third place')) {
        // Extract group letters from description
        const groupMatch = desc.match(/Group ([A-L]) third place/);
        if (groupMatch) {
          const groupId = groupMatch[1];
          return groupStandings[groupId]?.thirdPlace || null;
        }
        // For combined third place slots
        const matchId = match.id;
        return thirdPlaceAssignments[matchId] || null;
      }
      return null;
    };
    
    home = resolveTeam(team1Desc);
    away = resolveTeam(team2Desc);
    
    return {
      ...match,
      home,
      away,
      homeScore: home ? 0 : null,
      awayScore: away ? 0 : null,
      winner: null,
      played: !!(home && away)
    };
  });
  
  return resolved;
};

export const simulateKnockoutMatch = (match) => {
  if (!match.home || !match.away || match.played) return match;
  
  // Simple simulation - could be enhanced with team ratings
  const homeStrength = calculateTeamStrength(match.home);
  const awayStrength = calculateTeamStrength(match.away);
  
  // Weighted random result
  const totalStrength = homeStrength + awayStrength;
  const homeWinProbability = homeStrength / totalStrength;
  
  const random = Math.random();
  let homeScore, awayScore;
  
  if (random < homeWinProbability * 0.5) {
    // Home win
    homeScore = Math.floor(Math.random() * 3) + 1;
    awayScore = Math.floor(Math.random() * 2);
  } else if (random < homeWinProbability) {
    // Draw
    homeScore = Math.floor(Math.random() * 3);
    awayScore = homeScore;
  } else {
    // Away win
    awayScore = Math.floor(Math.random() * 3) + 1;
    homeScore = Math.floor(Math.random() * 2);
  }
  
  return {
    ...match,
    homeScore,
    awayScore,
    winner: homeScore > awayScore ? match.home : homeScore < awayScore ? match.away : null,
    played: true
  };
};

const calculateTeamStrength = (team) => {
  // Simple strength calculation based on group performance
  // Could be enhanced with FIFA rankings or other metrics
  if (!team) return 1;
  
  const baseStrength = 50;
  const pointsBonus = team.points * 5;
  const gdBonus = team.gd * 2;
  const gsBonus = team.gs * 1;
  
  return baseStrength + pointsBonus + gdBonus + gsBonus;
};

export const advanceWinners = (knockoutData, matchResults) => {
  const updated = JSON.parse(JSON.stringify(knockoutData));
  
  // Update Round of 16 based on Round of 32 winners
  updated.roundOf16.forEach(match => {
    if (match.winnerAdvancesTo) {
      const sourceMatch1 = matchResults.find(m => m.id === match.winnerAdvancesTo);
      const sourceMatch2 = matchResults.find(m => m.id === match.winnerAdvancesTo + 1);
      
      if (sourceMatch1 && sourceMatch2) {
        match.home = sourceMatch1.winner;
        match.away = sourceMatch2.winner;
        match.played = !!(sourceMatch1.winner && sourceMatch2.winner);
      }
    }
  });
  
  return updated;
};