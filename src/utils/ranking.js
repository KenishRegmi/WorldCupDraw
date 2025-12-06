export const calculateGroupStandings = (group) => {
  const sortedTeams = [...group.teams].sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) return b.points - a.points;
    
    // 2. Goal difference
    if (b.gd !== a.gd) return b.gd - a.gd;
    
    // 3. Goals scored
    if (b.gs !== a.gs) return b.gs - a.gs;
    
    // 4. Head-to-head points (calculate based on matches between the teams)
    const headToHeadResult = compareHeadToHead(a, b, group.matches);
    if (headToHeadResult !== 0) return headToHeadResult;
    
    // 5. Head-to-head goal difference
    if (headToHeadResult === 0) {
      const h2hGD = getHeadToHeadGoalDifference(a, b, group.matches);
      if (h2hGD !== 0) return h2hGD > 0 ? -1 : 1;
    }
    
    // 6. Head-to-head goals scored
    if (headToHeadResult === 0) {
      const h2hGS = getHeadToHeadGoalsScored(a, b, group.matches);
      if (h2hGS !== 0) return h2hGS > 0 ? -1 : 1;
    }
    
    // 7. Fair play points (simplified - would use actual card data)
    if (a.fairPlayScore !== b.fairPlayScore) return a.fairPlayScore - b.fairPlayScore;
    
    // 8. Drawing of lots (use alphabetical order as tiebreaker for simulation)
    return a.name.localeCompare(b.name);
  });
  
  return sortedTeams;
};

const compareHeadToHead = (teamA, teamB, matches) => {
  const matchesBetween = matches.filter(match => 
    match.played && 
    ((match.home.id === teamA.id && match.away.id === teamB.id) ||
     (match.home.id === teamB.id && match.away.id === teamA.id))
  );
  
  if (matchesBetween.length === 0) return 0;
  
  let pointsA = 0;
  let pointsB = 0;
  
  matchesBetween.forEach(match => {
    if (match.home.id === teamA.id) {
      if (match.homeScore > match.awayScore) pointsA += 3;
      else if (match.homeScore === match.awayScore) {
        pointsA += 1;
        pointsB += 1;
      } else pointsB += 3;
    } else {
      if (match.homeScore > match.awayScore) pointsB += 3;
      else if (match.homeScore === match.awayScore) {
        pointsA += 1;
        pointsB += 1;
      } else pointsA += 3;
    }
  });
  
  return pointsB - pointsA;
};

const getHeadToHeadGoalDifference = (teamA, teamB, matches) => {
  const matchesBetween = matches.filter(match => 
    match.played && 
    ((match.home.id === teamA.id && match.away.id === teamB.id) ||
     (match.home.id === teamB.id && match.away.id === teamA.id))
  );
  
  let gdA = 0;
  
  matchesBetween.forEach(match => {
    if (match.home.id === teamA.id) {
      gdA += (match.homeScore - match.awayScore);
    } else {
      gdA += (match.awayScore - match.homeScore);
    }
  });
  
  return gdA;
};

const getHeadToHeadGoalsScored = (teamA, teamB, matches) => {
  const matchesBetween = matches.filter(match => 
    match.played && 
    ((match.home.id === teamA.id && match.away.id === teamB.id) ||
     (match.home.id === teamB.id && match.away.id === teamA.id))
  );
  
  let gsA = 0;
  
  matchesBetween.forEach(match => {
    if (match.home.id === teamA.id) {
      gsA += match.homeScore;
    } else {
      gsA += match.awayScore;
    }
  });
  
  return gsA;
};

export const calculateFairPlayScore = (team, matches) => {
  // Simplified fair play calculation
  // In reality, this would count yellow/red cards from all matches
  let score = 0;
  
  // Simulate some card data
  const matchesPlayed = matches.filter(m => 
    m.played && (m.home.id === team.id || m.away.id === team.id)
  ).length;
  
  // Random card simulation (for demonstration)
  const yellowCards = Math.floor(Math.random() * 3) * matchesPlayed;
  const redCards = Math.floor(Math.random() * 1) * matchesPlayed;
  
  score -= yellowCards; // -1 per yellow
  score -= redCards * 4; // -4 per red
  
  return score;
};